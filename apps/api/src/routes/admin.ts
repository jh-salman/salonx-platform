import { Router } from 'express';
import { z } from 'zod';
import { db } from '@repo/db';
import { appointments, services, stylists, clients, brands } from '@repo/db/schema';
import { eq, and, desc, gte, lte, count } from 'drizzle-orm';
import { validateBody, validateQuery, validateParams } from '../middleware/validation';
import type { AuthenticatedRequest } from '../middleware/auth';

const router = Router();

const appointmentQuerySchema = z.object({
  page: z.string().transform(val => parseInt(val, 10)).default('1'),
  limit: z.string().transform(val => parseInt(val, 10)).default('20'),
  status: z.enum(['PENDING', 'CONFIRMED', 'PARKED', 'CANCELLED', 'COMPLETED']).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

router.get('/appointments', validateQuery(appointmentQuerySchema), async (req: AuthenticatedRequest, res) => {
  try {
    const { page, limit, status, date } = req.query as any;
    const offset = (page - 1) * limit;

    const conditions = [
      eq(appointments.isActive, true),
    ];

    if (status) {
      conditions.push(eq(appointments.status, status));
    }

    if (date) {
      const startOfDay = new Date(`${date}T00:00:00Z`);
      const endOfDay = new Date(`${date}T23:59:59Z`);
      conditions.push(
        gte(appointments.startAt, startOfDay),
        lte(appointments.startAt, endOfDay)
      );
    }

    const appointmentsList = await db
      .select({
        appointment: appointments,
        service: services,
        stylist: stylists,
        client: clients,
      })
      .from(appointments)
      .innerJoin(services, eq(appointments.serviceId, services.id))
      .innerJoin(stylists, eq(appointments.stylistId, stylists.id))
      .innerJoin(clients, eq(appointments.clientId, clients.id))
      .where(and(...conditions))
      .orderBy(desc(appointments.startAt))
      .limit(limit)
      .offset(offset);

    const totalCount = await db
      .select({ count: count() })
      .from(appointments)
      .where(and(...conditions));

    res.json({
      success: true,
      data: appointmentsList,
      meta: {
        pagination: {
          page,
          limit,
          total: totalCount[0].count,
          totalPages: Math.ceil(totalCount[0].count / limit),
        },
      },
    });
  } catch (error) {
    console.error('Failed to get appointments:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get appointments',
    });
  }
});

const updateAppointmentSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'PARKED', 'CANCELLED', 'COMPLETED']).optional(),
  paymentStatus: z.enum(['UNPAID', 'PAID', 'REFUNDED']).optional(),
  notes: z.string().optional(),
  startAt: z.string().datetime().optional(),
});

const appointmentParamsSchema = z.object({
  id: z.string().uuid(),
});

router.patch('/appointments/:id', 
  validateParams(appointmentParamsSchema),
  validateBody(updateAppointmentSchema),
  async (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const updatedAppointment = await db
        .update(appointments)
        .set({
          ...updates,
          updatedAt: new Date(),
        })
        .where(eq(appointments.id, id))
        .returning();

      if (!updatedAppointment.length) {
        return res.status(404).json({
          success: false,
          error: 'Appointment not found',
        });
      }

      res.json({
        success: true,
        data: updatedAppointment[0],
      });
    } catch (error) {
      console.error('Failed to update appointment:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update appointment',
      });
    }
  }
);

router.post('/appointments/:id/park', validateParams(appointmentParamsSchema), async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;

    const updatedAppointment = await db
      .update(appointments)
      .set({
        status: 'PARKED',
        updatedAt: new Date(),
      })
      .where(eq(appointments.id, id))
      .returning();

    res.json({
      success: true,
      data: updatedAppointment[0],
    });
  } catch (error) {
    console.error('Failed to park appointment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to park appointment',
    });
  }
});

router.post('/appointments/:id/return', validateParams(appointmentParamsSchema), async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;

    const updatedAppointment = await db
      .update(appointments)
      .set({
        status: 'CONFIRMED',
        updatedAt: new Date(),
      })
      .where(eq(appointments.id, id))
      .returning();

    res.json({
      success: true,
      data: updatedAppointment[0],
    });
  } catch (error) {
    console.error('Failed to return appointment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to return appointment',
    });
  }
});

const cancelAppointmentSchema = z.object({
  reason: z.string().optional(),
});

router.post('/appointments/:id/cancel', 
  validateParams(appointmentParamsSchema),
  validateBody(cancelAppointmentSchema),
  async (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      const updatedAppointment = await db
        .update(appointments)
        .set({
          status: 'CANCELLED',
          notes: reason ? `Cancelled: ${reason}` : 'Cancelled',
          updatedAt: new Date(),
        })
        .where(eq(appointments.id, id))
        .returning();

      res.json({
        success: true,
        data: updatedAppointment[0],
      });
    } catch (error) {
      console.error('Failed to cancel appointment:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to cancel appointment',
      });
    }
  }
);

const rescheduleAppointmentSchema = z.object({
  newStartAt: z.string().datetime(),
});

router.post('/appointments/:id/reschedule',
  validateParams(appointmentParamsSchema),
  validateBody(rescheduleAppointmentSchema),
  async (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;
      const { newStartAt } = req.body;

      const currentAppointment = await db
        .select({
          appointment: appointments,
          service: services,
        })
        .from(appointments)
        .innerJoin(services, eq(appointments.serviceId, services.id))
        .where(eq(appointments.id, id))
        .limit(1);

      if (!currentAppointment.length) {
        return res.status(404).json({
          success: false,
          error: 'Appointment not found',
        });
      }

      const newStartTime = new Date(newStartAt);
      const newEndTime = new Date(newStartTime.getTime() + currentAppointment[0].service.durationMinutes * 60000);

      const updatedAppointment = await db
        .update(appointments)
        .set({
          startAt: newStartTime,
          endAt: newEndTime,
          updatedAt: new Date(),
        })
        .where(eq(appointments.id, id))
        .returning();

      res.json({
        success: true,
        data: updatedAppointment[0],
      });
    } catch (error) {
      console.error('Failed to reschedule appointment:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to reschedule appointment',
      });
    }
  }
);

router.post('/appointments/:id/mark-paid', validateParams(appointmentParamsSchema), async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;

    const updatedAppointment = await db
      .update(appointments)
      .set({
        paymentStatus: 'PAID',
        updatedAt: new Date(),
      })
      .where(eq(appointments.id, id))
      .returning();

    res.json({
      success: true,
      data: updatedAppointment[0],
    });
  } catch (error) {
    console.error('Failed to mark appointment as paid:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to mark appointment as paid',
    });
  }
});

router.get('/services', async (req: AuthenticatedRequest, res) => {
  try {
    const servicesList = await db
      .select()
      .from(services)
      .where(eq(services.isActive, true))
      .orderBy(services.name);

    res.json({
      success: true,
      data: servicesList,
    });
  } catch (error) {
    console.error('Failed to get services:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get services',
    });
  }
});

const createServiceSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  durationMinutes: z.number().min(15),
  priceInCents: z.number().min(0),
  depositInCents: z.number().min(0).optional(),
  category: z.string().optional(),
});

router.post('/services', validateBody(createServiceSchema), async (req: AuthenticatedRequest, res) => {
  try {
    const brandId = req.user!.orgId; // Simplified for demo

    const newService = await db
      .insert(services)
      .values({
        ...req.body,
        brandId,
      })
      .returning();

    res.status(201).json({
      success: true,
      data: newService[0],
    });
  } catch (error) {
    console.error('Failed to create service:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create service',
    });
  }
});

const reportsQuerySchema = z.object({
  range: z.enum(['today', '7d', 'mtd']).default('today'),
});

router.get('/reports/summary', validateQuery(reportsQuerySchema), async (req: AuthenticatedRequest, res) => {
  try {
    const { range } = req.query as any;
    
    let startDate: Date;
    const endDate = new Date();

    switch (range) {
      case 'today':
        startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        break;
      case '7d':
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'mtd':
        startDate = new Date();
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
        break;
      default:
        startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
    }

    const appointmentsInRange = await db
      .select({
        appointment: appointments,
        service: services,
      })
      .from(appointments)
      .innerJoin(services, eq(appointments.serviceId, services.id))
      .where(and(
        gte(appointments.startAt, startDate),
        lte(appointments.startAt, endDate),
        eq(appointments.isActive, true)
      ));

    const totalAppointments = appointmentsInRange.length;
    const completedAppointments = appointmentsInRange.filter(a => a.appointment.status === 'COMPLETED').length;
    const totalRevenue = appointmentsInRange
      .filter(a => a.appointment.paymentStatus === 'PAID')
      .reduce((sum, a) => sum + a.appointment.totalAmountInCents, 0);

    const completionRate = totalAppointments > 0 ? (completedAppointments / totalAppointments) * 100 : 0;
    const averageTicket = completedAppointments > 0 ? totalRevenue / completedAppointments : 0;

    res.json({
      success: true,
      data: {
        totalRevenue,
        totalAppointments,
        completionRate: Math.round(completionRate * 100) / 100,
        averageTicket: Math.round(averageTicket),
      },
    });
  } catch (error) {
    console.error('Failed to get reports summary:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get reports summary',
    });
  }
});

router.get('/exports/appointments.csv', async (req: AuthenticatedRequest, res) => {
  try {
    const appointmentsList = await db
      .select({
        appointment: appointments,
        service: services,
        stylist: stylists,
        client: clients,
      })
      .from(appointments)
      .innerJoin(services, eq(appointments.serviceId, services.id))
      .innerJoin(stylists, eq(appointments.stylistId, stylists.id))
      .innerJoin(clients, eq(appointments.clientId, clients.id))
      .where(eq(appointments.isActive, true))
      .orderBy(desc(appointments.startAt));

    const csvHeader = 'Date,Time,Client,Service,Stylist,Status,Payment Status,Total Amount\n';
    const csvRows = appointmentsList.map(row => {
      const date = new Date(row.appointment.startAt).toLocaleDateString();
      const time = new Date(row.appointment.startAt).toLocaleTimeString();
      const clientName = `${row.client.firstName} ${row.client.lastName}`;
      const stylistName = `${row.stylist.firstName} ${row.stylist.lastName}`;
      const amount = (row.appointment.totalAmountInCents / 100).toFixed(2);
      
      return `${date},${time},"${clientName}","${row.service.name}","${stylistName}",${row.appointment.status},${row.appointment.paymentStatus},$${amount}`;
    }).join('\n');

    const csvContent = csvHeader + csvRows;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="appointments.csv"');
    res.send(csvContent);
  } catch (error) {
    console.error('Failed to export appointments:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to export appointments',
    });
  }
});

export { router as adminRoutes };
