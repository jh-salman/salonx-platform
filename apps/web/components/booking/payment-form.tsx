"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCreateAppointment, useCreatePaymentCheckout } from "@/hooks/use-booking";
import { CreditCard, Lock } from "lucide-react";
import { toast } from "react-hot-toast";

interface PaymentFormProps {
  bookingData: any;
  onComplete: (data?: any) => void;
}

export function PaymentForm({ bookingData, onComplete }: PaymentFormProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const createAppointmentMutation = useCreateAppointment();
  const createCheckoutMutation = useCreatePaymentCheckout();

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      const appointmentResult = await createAppointmentMutation.mutateAsync(bookingData);
      
      if (appointmentResult.success) {
        const checkoutResult = await createCheckoutMutation.mutateAsync({
          appointmentId: appointmentResult.data.id,
          successUrl: `${window.location.origin}/booking/success`,
          cancelUrl: `${window.location.origin}/booking/cancel`,
        });

        if (checkoutResult.success) {
          window.location.href = checkoutResult.data.checkoutUrl;
        } else {
          throw new Error("Failed to create checkout session");
        }
      } else {
        throw new Error("Failed to create appointment");
      }
    } catch (error) {
      toast.error("Payment processing failed. Please try again.");
      setIsProcessing(false);
    }
  };

  const depositAmount = 50;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Payment</h2>
        <p className="text-gray-600">Secure your appointment with a deposit</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Deposit Required</span>
              <span className="font-semibold">${depositAmount.toFixed(2)}</span>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center font-semibold">
                <span>Total Due Today</span>
                <span>${depositAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start space-x-2">
                <Lock className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Secure Payment</p>
                  <p>Your payment information is encrypted and secure. The remaining balance will be collected at your appointment.</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={handlePayment}
          disabled={isProcessing}
          className="px-8"
        >
          <CreditCard className="mr-2 h-4 w-4" />
          {isProcessing ? "Processing..." : "Pay Deposit"}
        </Button>
      </div>
    </div>
  );
}
