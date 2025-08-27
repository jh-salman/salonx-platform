"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { createSalonXClient } from "@repo/sdk";
import type { AvailabilitySlot, BookingFormData } from "@/types";

const salonxClient = createSalonXClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1",
});

export function useBrandByHost(host: string) {
  return useQuery({
    queryKey: ["brand", host],
    queryFn: () => salonxClient.getBrandByHost(host),
    enabled: !!host,
  });
}

export function useAvailability() {
  return useMutation({
    mutationFn: (request: {
      serviceId: string;
      stylistId?: string;
      date: string;
    }) => salonxClient.getAvailability(request),
  });
}

export function useCreateAppointment() {
  return useMutation({
    mutationFn: (data: BookingFormData) => {
      const request = {
        serviceId: data.serviceId,
        stylistId: data.stylistId,
        startAt: data.startAt,
        client: {
          firstName: data.clientInfo.firstName,
          lastName: data.clientInfo.lastName,
          email: data.clientInfo.email,
          phone: data.clientInfo.phone,
        },
        notes: data.notes || "",
      };
      return salonxClient.createAppointment(request);
    },
  });
}

export function useServices(brandId?: string) {
  return useQuery({
    queryKey: ["services", brandId],
    queryFn: () => salonxClient.getServices(brandId!),
    enabled: !!brandId,
  });
}

export function useCreatePaymentCheckout() {
  return useMutation({
    mutationFn: ({
      appointmentId,
      successUrl,
      cancelUrl,
    }: {
      appointmentId: string;
      successUrl: string;
      cancelUrl: string;
    }) => salonxClient.createPaymentCheckout(appointmentId, successUrl, cancelUrl),
  });
}
