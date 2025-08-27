"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAvailability } from "@/hooks/use-booking";
import { format } from "date-fns";

interface SlotPickerProps {
  serviceId: string;
  onSelect: (data: { startAt: string; stylistId: string }) => void;
}

export function SlotPicker({ serviceId, onSelect }: SlotPickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedStylist, setSelectedStylist] = useState<string | null>(null);

  const availabilityMutation = useAvailability();

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setSelectedStylist(null);
    
    if (date) {
      availabilityMutation.mutate({
        serviceId,
        date: format(date, "yyyy-MM-dd"),
      });
    }
  };

  const handleSlotSelect = (slot: any) => {
    setSelectedSlot(slot.startAt);
    setSelectedStylist(slot.stylistId);
  };

  const handleContinue = () => {
    if (selectedSlot && selectedStylist) {
      onSelect({
        startAt: selectedSlot,
        stylistId: selectedStylist,
      });
    }
  };

  const availableSlots = availabilityMutation.data?.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Choose Date & Time</h2>
        <p className="text-gray-600">Select your preferred appointment time</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium mb-4">Select Date</h3>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={(date: Date) => date < new Date()}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium mb-4">Available Times</h3>
            {availabilityMutation.isPending && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-sm text-gray-600 mt-2">Loading available times...</p>
              </div>
            )}
            
            {availableSlots.length === 0 && !availabilityMutation.isPending && selectedDate && (
              <div className="text-center py-8">
                <p className="text-gray-600">No available times for this date</p>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-2">
              {availableSlots.map((slot: any, index: number) => (
                <Button
                  key={index}
                  variant={selectedSlot === slot.startAt ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSlotSelect(slot)}
                  className="text-sm"
                >
                  {format(new Date(slot.startAt), "h:mm a")}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleContinue}
          disabled={!selectedSlot}
          className="px-8"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
