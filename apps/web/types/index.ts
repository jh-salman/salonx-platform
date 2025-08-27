export interface User {
  id: string;
  email: string;
  role: "owner" | "member";
  orgId: string;
  accessToken: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  timezone: string;
  depositPercentage: number;
  policyText: string;
  theme: Record<string, any>;
  isActive: boolean;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  priceInCents: number;
  depositInCents: number;
  durationInMinutes: number;
  isActive: boolean;
}

export interface Stylist {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isActive: boolean;
}

export interface Client {
  id: string;
  brandId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  clientId: string;
  serviceId: string;
  stylistId: string;
  startAt: string;
  endAt: string;
  status: "PENDING" | "CONFIRMED" | "PARKED" | "CANCELLED" | "COMPLETED";
  paymentStatus: "UNPAID" | "PAID" | "REFUNDED";
  totalAmountInCents: number;
  depositAmountInCents: number;
  notes: string;
}

export interface AvailabilitySlot {
  startAt: string;
  endAt: string;
  stylistId: string;
}

export interface BookingFormData {
  serviceId: string;
  stylistId: string;
  startAt: string;
  clientInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  notes?: string;
}
