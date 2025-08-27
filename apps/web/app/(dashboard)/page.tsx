"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppointments } from "@/hooks/use-appointments";
import { useClients } from "@/hooks/use-clients";
import { Calendar, Users, DollarSign, Clock } from "lucide-react";

export default function DashboardPage() {
  const { data: appointments } = useAppointments();
  const { data: clients } = useClients();

  const stats = [
    {
      title: "Today's Appointments",
      value: "12",
      description: "+2 from yesterday",
      icon: Calendar,
    },
    {
      title: "Total Clients",
      value: clients?.data?.length?.toString() || "0",
      description: "+5 this week",
      icon: Users,
    },
    {
      title: "Revenue Today",
      value: "$1,234",
      description: "+12% from yesterday",
      icon: DollarSign,
    },
    {
      title: "Avg. Service Time",
      value: "45 min",
      description: "Across all services",
      icon: Clock,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening at your salon today.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Appointments</CardTitle>
            <CardDescription>
              Your upcoming appointments for today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Hair Cut & Style - John Doe
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {9 + i}:00 AM - {10 + i}:00 AM
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">$85</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks to get you started
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <button className="w-full text-left p-2 rounded hover:bg-muted">
              Add New Appointment
            </button>
            <button className="w-full text-left p-2 rounded hover:bg-muted">
              Add New Client
            </button>
            <button className="w-full text-left p-2 rounded hover:bg-muted">
              View Today's Schedule
            </button>
            <button className="w-full text-left p-2 rounded hover:bg-muted">
              Send Marketing Email
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
