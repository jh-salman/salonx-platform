"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useBrandByHost, useServices } from "@/hooks/use-booking";
import { ServiceSelector } from "@/components/booking/service-selector";
import { SlotPicker } from "@/components/booking/slot-picker";
import { ClientForm } from "@/components/booking/client-form";
import { PaymentForm } from "@/components/booking/payment-form";
import { CheckCircle } from "lucide-react";

type BookingStep = "service" | "slot" | "client" | "payment" | "confirmation";

export default function BookingPage() {
  const params = useParams();
  const brandSlug = params.brand as string;
  const [currentStep, setCurrentStep] = useState<BookingStep>("service");
  const [bookingData, setBookingData] = useState<any>({});

  const { data: brand } = useBrandByHost(`${brandSlug}.salonx.com`);
  const { data: services } = useServices(brand?.data?.id || "");

  const steps = [
    { id: "service", name: "Select Service", completed: false },
    { id: "slot", name: "Choose Time", completed: false },
    { id: "client", name: "Your Details", completed: false },
    { id: "payment", name: "Payment", completed: false },
    { id: "confirmation", name: "Confirmation", completed: false },
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const updatedSteps = steps.map((step, index) => ({
    ...step,
    completed: index < currentStepIndex,
  }));

  const handleStepComplete = (stepData: any) => {
    setBookingData({ ...bookingData, ...stepData });
    
    const nextSteps: Record<BookingStep, BookingStep> = {
      service: "slot",
      slot: "client",
      client: "payment",
      payment: "confirmation",
      confirmation: "confirmation",
    };
    
    setCurrentStep(nextSteps[currentStep]);
  };

  if (!brand?.data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Salon Not Found</h1>
          <p className="text-gray-600 mt-2">
            The salon you're looking for doesn't exist or is not available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Book with {brand.data.name}
          </h1>
          <p className="text-gray-600 mt-2">
            Schedule your appointment in just a few steps
          </p>
        </div>

        <div className="mb-8">
          <nav aria-label="Progress">
            <ol className="flex items-center justify-between">
              {updatedSteps.map((step, stepIdx) => (
                <li key={step.name} className="flex items-center">
                  <div className="flex items-center">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        step.completed
                          ? "bg-primary text-white"
                          : step.id === currentStep
                          ? "bg-primary text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {step.completed ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <span className="text-sm font-medium">{stepIdx + 1}</span>
                      )}
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-900 hidden sm:block">
                      {step.name}
                    </span>
                  </div>
                  {stepIdx < updatedSteps.length - 1 && (
                    <div className="ml-4 h-px w-full bg-gray-200" />
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </div>

        <Card>
          <CardContent className="p-6">
            {currentStep === "service" && (
              <ServiceSelector
                services={services?.data || []}
                onSelect={handleStepComplete}
              />
            )}
            
            {currentStep === "slot" && (
              <SlotPicker
                serviceId={bookingData.serviceId}
                onSelect={handleStepComplete}
              />
            )}
            
            {currentStep === "client" && (
              <ClientForm onSubmit={handleStepComplete} />
            )}
            
            {currentStep === "payment" && (
              <PaymentForm
                bookingData={bookingData}
                onComplete={handleStepComplete}
              />
            )}
            
            {currentStep === "confirmation" && (
              <div className="text-center py-8">
                <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Booking Confirmed!
                </h2>
                <p className="text-gray-600 mb-6">
                  Your appointment has been successfully booked. You'll receive a confirmation email shortly.
                </p>
                <Button onClick={() => window.location.href = "/"}>
                  Book Another Appointment
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
