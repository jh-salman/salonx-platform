"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createSalonXClient } from "@repo/sdk";
import type { Appointment } from "@/types";

const salonxClient = createSalonXClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1",
});

export function useAppointments(params?: {
  page?: number;
  limit?: number;
  status?: string;
  date?: string;
}) {
  return useQuery({
    queryKey: ["appointments", params],
    queryFn: () => salonxClient.getAppointments(params),
  });
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Appointment> }) =>
      salonxClient.updateAppointment(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
}

export function useParkAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => salonxClient.parkAppointment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
}

export function useReturnAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => salonxClient.returnAppointment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
}

export function useCancelAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      salonxClient.cancelAppointment(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
}

export function useRescheduleAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, newStartAt }: { id: string; newStartAt: string }) =>
      salonxClient.rescheduleAppointment(id, newStartAt),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
}

export function useMarkAppointmentPaid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => salonxClient.markAppointmentPaid(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
}
