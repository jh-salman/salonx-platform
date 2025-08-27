"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createSalonXClient } from "@repo/sdk";
import type { Client } from "@/types";

const salonxClient = createSalonXClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1",
});

export function useClients(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["clients", params],
    queryFn: () => salonxClient.getClients(params ? { page: params.page || 1, limit: params.limit || 10 } : { page: 1, limit: 10 }),
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (client: Omit<Client, "id" | "createdAt" | "updatedAt">) =>
      salonxClient.createClient(client),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Client> }) =>
      salonxClient.updateClient(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
}
