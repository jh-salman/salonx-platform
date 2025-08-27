import { Job } from 'bullmq';
import { db } from '@repo/db';
import { appointments, clients, services, brands } from '@repo/db/schema';
import { eq } from 'drizzle-orm';
import { sendEmail } from '../services/email';
import { sendSms } from '../services/sms';
import { env, features } from '@repo/config';

interface ReminderJobData {
  appointmentId: string;
}

export async function processReminder(job: Job<ReminderJobData>) {
  const { appointmentId } = job.data;

  try {
    const appointment = await db
      .select({
        appointment: appointments,
        client: clients,
        service: services,
        brand: brands,
      })
      .from(appointments)
      .innerJoin(clients, eq(appointments.clientId, clients.id))
      .innerJoin(services, eq(appointments.serviceId, services.id))
      .innerJoin(brands, eq(appointments.brandId, brands.id))
      .where(eq(appointments.id, appointmentId))
      .limit(1);

    if (!appointment.length) {
      throw new Error(`Appointment ${appointmentId} not found`);
    }

    const { appointment: apt, client, service, brand } = appointment[0];

    if (apt.status === 'CANCELLED') {
      console.log(`Skipping reminder for cancelled appointment ${appointmentId}`);
      return;
    }

    const appointmentDate = new Date(apt.startAt);
    const reminderText = `Hi ${client.firstName}, this is a reminder that you have an appointment for ${service.name} tomorrow at ${appointmentDate.toLocaleTimeString()} with ${brand.name}. Please call if you need to reschedule.`;

    if (client.email) {
      await sendEmail({
        to: client.email,
        subject: `Appointment Reminder - ${brand.name}`,
        html: `
          <h2>Appointment Reminder</h2>
          <p>Hi ${client.firstName},</p>
          <p>This is a reminder that you have an appointment scheduled:</p>
          <ul>
            <li><strong>Service:</strong> ${service.name}</li>
            <li><strong>Date:</strong> ${appointmentDate.toLocaleDateString()}</li>
            <li><strong>Time:</strong> ${appointmentDate.toLocaleTimeString()}</li>
            <li><strong>Location:</strong> ${brand.name}</li>
          </ul>
          <p>Please call us if you need to reschedule or cancel.</p>
          <p>Thank you!</p>
        `,
        text: reminderText,
      });
    }

    if (client.phone && features.smsCampaigns) {
      await sendSms({
        to: client.phone,
        message: reminderText,
      });
    }

    console.log(`Reminder sent for appointment ${appointmentId}`);
  } catch (error) {
    console.error(`Failed to process reminder for appointment ${appointmentId}:`, error);
    throw error;
  }
}
