import { Job } from 'bullmq';
import { db } from '@repo/db';
import { emailCampaigns, emailSubscribers } from '@repo/db/schema';
import { eq, and } from 'drizzle-orm';
import { sendEmail } from '../services/email';

interface EmailCampaignJobData {
  campaignId: string;
}

export async function processEmailCampaign(job: Job<EmailCampaignJobData>) {
  const { campaignId } = job.data;

  try {
    const campaign = await db
      .select()
      .from(emailCampaigns)
      .where(eq(emailCampaigns.id, campaignId))
      .limit(1);

    if (!campaign.length) {
      throw new Error(`Email campaign ${campaignId} not found`);
    }

    const campaignData = campaign[0];

    if (campaignData.status !== 'SCHEDULED') {
      console.log(`Skipping email campaign ${campaignId} with status ${campaignData.status}`);
      return;
    }

    await db
      .update(emailCampaigns)
      .set({ 
        status: 'SENDING',
        updatedAt: new Date(),
      })
      .where(eq(emailCampaigns.id, campaignId));

    const subscribers = await db
      .select()
      .from(emailSubscribers)
      .where(and(
        eq(emailSubscribers.brandId, campaignData.brandId),
        eq(emailSubscribers.isActive, true)
      ));

    let sentCount = 0;
    const errors: string[] = [];

    for (const subscriber of subscribers) {
      try {
        const personalizedHtml = campaignData.htmlContent
          .replace(/{{firstName}}/g, subscriber.firstName || 'Valued Customer')
          .replace(/{{lastName}}/g, subscriber.lastName || '')
          .replace(/{{unsubscribeUrl}}/g, `${process.env.WEB_URL}/unsubscribe?token=${subscriber.unsubscribeToken}`);

        const personalizedText = campaignData.textContent
          ?.replace(/{{firstName}}/g, subscriber.firstName || 'Valued Customer')
          .replace(/{{lastName}}/g, subscriber.lastName || '');

        await sendEmail({
          to: subscriber.email,
          subject: campaignData.subject,
          html: personalizedHtml,
          text: personalizedText,
          headers: {
            'List-Unsubscribe': `<${process.env.WEB_URL}/unsubscribe?token=${subscriber.unsubscribeToken}>`,
            'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
          },
        });

        sentCount++;
      } catch (error) {
        console.error(`Failed to send email to ${subscriber.email}:`, error);
        errors.push(`${subscriber.email}: ${error}`);
      }
    }

    await db
      .update(emailCampaigns)
      .set({
        status: 'SENT',
        sentAt: new Date(),
        recipientCount: sentCount,
        updatedAt: new Date(),
      })
      .where(eq(emailCampaigns.id, campaignId));

    console.log(`Email campaign ${campaignId} completed. Sent: ${sentCount}, Errors: ${errors.length}`);

    if (errors.length > 0) {
      console.error('Email campaign errors:', errors);
    }
  } catch (error) {
    await db
      .update(emailCampaigns)
      .set({
        status: 'CANCELLED',
        updatedAt: new Date(),
      })
      .where(eq(emailCampaigns.id, campaignId));

    console.error(`Failed to process email campaign ${campaignId}:`, error);
    throw error;
  }
}
