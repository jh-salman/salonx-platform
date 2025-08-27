"use client";

import { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppointments } from "@/hooks/use-appointments";
import { Plus, Calendar as CalendarIcon, List } from "lucide-react";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

export default function AppointmentsPage() {
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const { data: appointments, isLoading } = useAppointments();

  const events = appointments?.data?.map((apt: any) => ({
    id: apt.id,
    title: `${apt.service?.name} - ${apt.client?.firstName} ${apt.client?.lastName}`,
    start: new Date(apt.startAt),
    end: new Date(apt.endAt),
    resource: apt,
  })) || [];

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
          <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
          <p className="text-muted-foreground">
            Manage your salon appointments and schedule
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Appointment
        </Button>
      </div>

      <Tabs value={view} onValueChange={(v) => setView(v as "calendar" | "list")}>
        <TabsList>
          <TabsTrigger value="calendar">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="list">
            <List className="mr-2 h-4 w-4" />
            List
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div style={{ height: 600 }}>
                <Calendar
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: "100%" }}
                  views={["month", "week", "day"]}
                  defaultView="week"
                  step={15}
                  timeslots={4}
                  onSelectEvent={(event) => {
                    console.log("Selected event:", event);
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events.map((event: any) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {moment(event.start).format("MMM DD, YYYY - h:mm A")}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                        {event.resource.status}
                      </span>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
