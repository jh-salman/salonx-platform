"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useServices } from "@/hooks/use-services";
import { Plus, Clock, DollarSign } from "lucide-react";

export default function ServicesPage() {
  const { data: services, isLoading } = useServices("brand-id");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Services</h1>
          <p className="text-muted-foreground">
            Manage your salon services and pricing
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Service
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services?.data?.map((service: any) => (
          <Card key={service.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">{service.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {service.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm">
                  <DollarSign className="mr-1 h-3 w-3" />
                  ${(service.priceInCents / 100).toFixed(2)}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-1 h-3 w-3" />
                  {service.durationInMinutes} min
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className={`px-2 py-1 text-xs rounded ${
                  service.isActive 
                    ? "bg-green-100 text-green-800" 
                    : "bg-gray-100 text-gray-800"
                }`}>
                  {service.isActive ? "Active" : "Inactive"}
                </span>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(!services?.data || services.data.length === 0) && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No services found</p>
            <Button className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Service
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
