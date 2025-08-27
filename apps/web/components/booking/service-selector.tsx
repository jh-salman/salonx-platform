"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, DollarSign } from "lucide-react";

interface Service {
  id: string;
  name: string;
  description: string;
  priceInCents: number;
  durationInMinutes: number;
}

interface ServiceSelectorProps {
  services: Service[];
  onSelect: (data: { serviceId: string }) => void;
}

export function ServiceSelector({ services, onSelect }: ServiceSelectorProps) {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const handleContinue = () => {
    if (selectedService) {
      onSelect({ serviceId: selectedService });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Select a Service</h2>
        <p className="text-gray-600">Choose the service you'd like to book</p>
      </div>

      <div className="grid gap-4">
        {services.map((service) => (
          <Card
            key={service.id}
            className={`cursor-pointer transition-all ${
              selectedService === service.id
                ? "ring-2 ring-primary border-primary"
                : "hover:shadow-md"
            }`}
            onClick={() => setSelectedService(service.id)}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{service.name}</h3>
                  <p className="text-gray-600 mt-1">{service.description}</p>
                  
                  <div className="flex items-center space-x-4 mt-3">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="mr-1 h-4 w-4" />
                      {service.durationInMinutes} min
                    </div>
                    <div className="flex items-center text-sm font-medium">
                      <DollarSign className="mr-1 h-4 w-4" />
                      {(service.priceInCents / 100).toFixed(2)}
                    </div>
                  </div>
                </div>
                
                <div className="ml-4">
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${
                      selectedService === service.id
                        ? "bg-primary border-primary"
                        : "border-gray-300"
                    }`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleContinue}
          disabled={!selectedService}
          className="px-8"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
