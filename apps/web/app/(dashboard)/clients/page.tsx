"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useClients } from "@/hooks/use-clients";
import { Plus, Search, Mail, Phone } from "lucide-react";

export default function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: clients, isLoading } = useClients();

  const filteredClients = clients?.data?.filter((client: any) =>
    `${client.firstName} ${client.lastName} ${client.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  ) || [];

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
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">
            Manage your client database and history
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Client
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredClients.map((client: any) => (
              <Card key={client.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold">
                      {client.firstName} {client.lastName}
                    </h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Mail className="mr-2 h-3 w-3" />
                      {client.email}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Phone className="mr-2 h-3 w-3" />
                      {client.phone}
                    </div>
                    {client.notes && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {client.notes}
                      </p>
                    )}
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-xs text-muted-foreground">
                        Last visit: Never
                      </span>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredClients.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No clients found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
