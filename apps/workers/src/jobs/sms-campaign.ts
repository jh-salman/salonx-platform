import { Job } from 'bullmq';
import { db } from '@repo/db';
import { smsCampaigns, smsSubscribers } from '@repo/db/schema';
import { eq, and } from 'drizzle-orm';
import { sendSms } from '../services/sms';
import { isQuietHours } from '../utils/sms-compliance';

interface SmsCampaignJobData {
  campaignId: string;
}

export async function processSmsCampaign(job: Job<SmsCampaignJobData>) {
  const { campaignId } = job.data;

  try {
    const campaign = await db
      .select()
      .from(smsCampaigns)
      .where(eq(smsCampaigns.id, campaignId))
      .limit(1);

    if (!campaign.length) {
      throw new Error(`SMS campaign ${campaignId} not found`);
    }

    const campaignData = campaign[0];

    if (campaignData.status !== 'SCHEDULED') {
      console.log(`Skipping SMS campaign ${campaignId} with status ${campaignData.status}`);
      return;
    }

    if (isQuietHours()) {
      console.log(`Delaying SMS campaign ${campaignId} due to quiet hours`);
      const nextMorning = new Date();
      nextMorning.setHours(8, 0, 0, 0);
      if (nextMorning <= new Date()) {
        nextMorning.setDate(nextMorning.getDate() + 1);
      }
      
      throw new Error(`Rescheduled for ${nextMorning.toISOString()} due to quiet hours`);
    }

    await db
      .update(smsCampaigns)
      .set({ 
        status: 'SENDING',
        updatedAt: new Date(),
      })
      .where(eq(smsCampaigns.id, campaignId));

    const subscribers = await db
      .select()
      .from(smsSubscribers)
      .where(and(
        eq(smsSubscribers.brandId, campaignData.brandId),
        eq(smsSubscribers.isActive, true)
      ));

    let sentCount = 0;
    let deliveredCount = 0;
    const errors: string[] = [];

    for (const subscriber of subscribers) {
      try {
        const personalizedMessage = campaignData.message
          .replace(/{{firstName}}/g, subscriber.firstName || 'Valued Customer')
          .replace(/{{lastName}}/g, subscriber.lastName || '');

        const result = await sendSms({
          to: subscriber.phone,
          message: personalizedMessage + '\n\nReply STOP to opt out.',
        });

        sentCount++;
        if (result.delivered) {
          deliveredCount++;
        }
      } catch (error) {
        console.error(`Failed to send SMS to ${subscriber.phone}:`, error);
        errors.push(`${subscriber.phone}: ${error}`);
      }
    }

    await db
      .update(smsCampaigns)
      .set({
        status: 'SENT',
        sentAt: new Date(),
        recipientCount: sentCount,
        deliveredCount,
        updatedAt: new Date(),
      })
      .where(eq(smsCampaigns.id, campaignId));

    console.log(`SMS campaign ${campaignId} completed. Sent: ${sentCount}, Delivered: ${deliveredCount}, Errors: ${errors.length}`);

    if (errors.length > 0) {
      console.error('SMS campaign errors:', errors);
    }
  } catch (error) {
    await db
      .update(smsCampaigns)
      .set({
        status: 'CANCELLED',
        updatedAt: new Date(),
      })
      .where(eq(smsCampaigns.id, campaignId));

    console.error(`Failed to process SMS campaign ${campaignId}:`, error);
    throw error;
  }
}
