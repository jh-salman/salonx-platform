import { Router } from 'express';
import { z } from 'zod';
import { db } from '@repo/db';
import { brands, services, stylists, appointments, clients } from '@repo/db/schema';
import { eq, and, gte, lte } from 'drizzle-orm';
import { validateBody, validateQuery } from '../middleware/validation';
import type { TenantRequest } from '../middleware/tenancy';
import Stripe from 'stripe';
import { env } from '@repo/config/env';

const router = Router();
const stripe = new Stripe(env.STRIPE_SECRET_KEY || '', { apiVersion: '2023-10-16' });

router.get('/brand', async (req: TenantRequest, res) => {
  try {
    if (!req.brand) {
      return res.status(404).json({
        success: false,
        error: 'Brand not found',
      });
    }

    const brand = await db
      .select()
      .from(brands)
      .where(eq(brands.id, req.brand.id))
      .limit(1);

    res.json({
      success: true,
      data: brand[0],
    });
  } catch (error) {
    console.error('Failed to get brand:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get brand',
    });
  }
});

router.get('/services', async (req: TenantRequest, res) => {
  try {
    if (!req.brand) {
      return res.status(400).json({
        success: false,
        error: 'Brand context required',
      });
    }

    const brandServices = await db
      .select()
      .from(services)
      .where(and(
        eq(services.brandId, req.brand.id),
        eq(services.isActive, true)
      ));

    res.json({
      success: true,
      data: brandServices,
    });
  } catch (error) {
    console.error('Failed to get services:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get services',
    });
  }
});

const availabilitySchema = z.object({
  serviceId: z.string().uuid(),
  stylistId: z.string().uuid().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

router.post('/availability', validateBody(availabilitySchema), async (req: TenantRequest, res) => {
  try {
    if (!req.brand) {
      return res.status(400).json({
        success: false,
        error: 'Brand context required',
      });
    }

    const { serviceId, stylistId, date } = req.body;

    const service = await db
      .select()
      .from(services)
      .where(and(
        eq(services.id, serviceId),
        eq(services.brandId, req.brand.id),
        eq(services.isActive, true)
      ))
      .limit(1);

    if (!service.length) {
      return res.status(404).json({
        success: false,
        error: 'Service not found',
      });
    }

    const availableStylists = await db
      .select()
      .from(stylists)
      .where(and(
        eq(stylists.brandId, req.brand.id),
        eq(stylists.isActive, true),
        ...(stylistId ? [eq(stylists.id, stylistId)] : [])
      ));

    const startOfDay = new Date(`${date}T00:00:00Z`);
    const endOfDay = new Date(`${date}T23:59:59Z`);

    const existingAppointments = await db
      .select()
      .from(appointments)
      .where(and(
        eq(appointments.brandId, req.brand.id),
        gte(appointments.startAt, startOfDay),
        lte(appointments.startAt, endOfDay),
        eq(appointments.isActive, true)
      ));

    const slots = [];
    const businessHours = { start: 9, end: 17 }; // 9 AM to 5 PM
    const slotDuration = service[0].durationMinutes;

    for (const stylist of availableStylists) {
      for (let hour = businessHours.start; hour < businessHours.end; hour++) {
        for (let minute = 0; minute < 60; minute += slotDuration) {
          const slotStart = new Date(`${date}T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00Z`);
          const slotEnd = new Date(slotStart.getTime() + slotDuration * 60000);

          const hasConflict = existingAppointments.some(apt => 
            apt.stylistId === stylist.id &&
            ((slotStart >= apt.startAt && slotStart < apt.endAt) ||
             (slotEnd > apt.startAt && slotEnd <= apt.endAt))
          );

          if (!hasConflict && slotEnd.getHours() <= businessHours.end) {
            slots.push({
              startAt: slotStart.toISOString(),
              endAt: slotEnd.toISOString(),
              stylistId: stylist.id,
            });
          }
        }
      }
    }

    res.json({
      success: true,
      data: slots,
    });
  } catch (error) {
    console.error('Failed to get availability:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get availability',
    });
  }
});

const createAppointmentSchema = z.object({
  serviceId: z.string().uuid(),
  stylistId: z.string().uuid(),
  startAt: z.string().datetime(),
  client: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email().optional(),
    phone: z.string().optional(),
  }),
  notes: z.string().optional(),
});

router.post('/appointments', validateBody(createAppointmentSchema), async (req: TenantRequest, res) => {
  try {
    if (!req.brand) {
      return res.status(400).json({
        success: false,
        error: 'Brand context required',
      });
    }

    const { serviceId, stylistId, startAt, client: clientData, notes } = req.body;

    const service = await db
      .select()
      .from(services)
      .where(and(
        eq(services.id, serviceId),
        eq(services.brandId, req.brand.id)
      ))
      .limit(1);

    if (!service.length) {
      return res.status(404).json({
        success: false,
        error: 'Service not found',
      });
    }

    let clientRecord = await db
      .select()
      .from(clients)
      .where(and(
        eq(clients.brandId, req.brand.id),
        eq(clients.firstName, clientData.firstName),
        eq(clients.lastName, clientData.lastName)
      ))
      .limit(1);

    if (!clientRecord.length) {
      const newClient = await db
        .insert(clients)
        .values({
          brandId: req.brand.id,
          firstName: clientData.firstName,
          lastName: clientData.lastName,
          email: clientData.email,
          phone: clientData.phone,
        })
        .returning();
      
      clientRecord = newClient;
    }

    const startTime = new Date(startAt);
    const endTime = new Date(startTime.getTime() + service[0].durationMinutes * 60000);

    const appointment = await db
      .insert(appointments)
      .values({
        brandId: req.brand.id,
        serviceId,
        stylistId,
        clientId: clientRecord[0].id,
        startAt: startTime,
        endAt: endTime,
        totalAmountInCents: service[0].priceInCents,
        depositAmountInCents: service[0].depositInCents || Math.floor(service[0].priceInCents * 0.5),
        notes,
        status: 'PENDING',
        paymentStatus: 'UNPAID',
      })
      .returning();

    res.status(201).json({
      success: true,
      data: appointment[0],
    });
  } catch (error) {
    console.error('Failed to create appointment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create appointment',
    });
  }
});

const checkoutSchema = z.object({
  appointmentId: z.string().uuid(),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
});

router.post('/payments/checkout', validateBody(checkoutSchema), async (req: TenantRequest, res) => {
  try {
    if (!req.brand) {
      return res.status(400).json({
        success: false,
        error: 'Brand context required',
      });
    }

    const { appointmentId, successUrl, cancelUrl } = req.body;

    const appointment = await db
      .select({
        appointment: appointments,
        service: services,
        client: clients,
      })
      .from(appointments)
      .innerJoin(services, eq(appointments.serviceId, services.id))
      .innerJoin(clients, eq(appointments.clientId, clients.id))
      .where(and(
        eq(appointments.id, appointmentId),
        eq(appointments.brandId, req.brand.id)
      ))
      .limit(1);

    if (!appointment.length) {
      return res.status(404).json({
        success: false,
        error: 'Appointment not found',
      });
    }

    const { appointment: apt, service, client } = appointment[0];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: service.name,
              description: `Appointment with ${req.brand.name}`,
            },
            unit_amount: apt.depositAmountInCents || apt.totalAmountInCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: client.email || undefined,
      metadata: {
        appointmentId: apt.id,
        brandId: req.brand.id,
      },
    });

    res.json({
      success: true,
      data: {
        checkoutUrl: session.url,
        sessionId: session.id,
      },
    });
  } catch (error) {
    console.error('Failed to create checkout session:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create checkout session',
    });
  }
});

router.post('/webhooks/stripe', async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'] as string;
    const webhookSecret = env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      return res.status(400).json({
        success: false,
        error: 'Webhook secret not configured',
      });
    }

    const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const appointmentId = session.metadata?.appointmentId;

      if (appointmentId) {
        await db
          .update(appointments)
          .set({
            paymentStatus: 'PAID',
            status: 'CONFIRMED',
            stripePaymentIntentId: session.payment_intent as string,
          })
          .where(eq(appointments.id, appointmentId));
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({
      success: false,
      error: 'Webhook error',
    });
  }
});

export { router as publicRoutes };
