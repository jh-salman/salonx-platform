"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createSalonXClient } from "@repo/sdk";
import type { Service } from "@/types";

const salonxClient = createSalonXClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1",
});

export function useServices(brandId: string) {
  return useQuery({
    queryKey: ["services", brandId],
    queryFn: () => salonxClient.getServices(brandId),
    enabled: !!brandId,
  });
}

export function useStylists() {
  return useQuery({
    queryKey: ["stylists"],
    queryFn: () => salonxClient.getStylists(),
  });
}

export function useCreateStylist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (stylist: any) => salonxClient.createStylist(stylist),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stylists"] });
    },
  });
}

export function useUpdateStylist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) =>
      salonxClient.updateStylist(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stylists"] });
    },
  });
}
