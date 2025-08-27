import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, isToday } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../../src/hooks/useAuth';
import { useSalonXClient } from '../../src/hooks/useSalonXClient';
import { AppointmentCard } from '../../src/components/AppointmentCard';
import { LoadingSpinner } from '../../src/components/LoadingSpinner';
import { EmptyState } from '../../src/components/EmptyState';

export default function TodayScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();
  const client = useSalonXClient();

  const { data: appointments, isLoading, refetch } = useQuery({
    queryKey: ['appointments', 'today'],
    queryFn: () => client.getAppointments({
      date: format(new Date(), 'yyyy-MM-dd'),
      limit: 50,
    }),
    enabled: !!user,
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const todayAppointments = appointments?.data?.filter(apt => 
    isToday(new Date(apt.appointment.startAt))
  ) || [];

  const upcomingAppointments = todayAppointments.filter(apt => 
    new Date(apt.appointment.startAt) > new Date() &&
    apt.appointment.status !== 'CANCELLED'
  );

  const completedAppointments = todayAppointments.filter(apt => 
    apt.appointment.status === 'COMPLETED'
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View className="p-4">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-900">
            {format(new Date(), 'EEEE, MMMM d')}
          </Text>
          <Text className="text-gray-600 mt-1">
            {todayAppointments.length} appointments today
          </Text>
        </View>

        {/* Quick Stats */}
        <View className="flex-row mb-6 space-x-4">
          <View className="flex-1 bg-white p-4 rounded-lg shadow-sm">
            <Text className="text-2xl font-bold text-blue-600">
              {upcomingAppointments.length}
            </Text>
            <Text className="text-gray-600 text-sm">Upcoming</Text>
          </View>
          <View className="flex-1 bg-white p-4 rounded-lg shadow-sm">
            <Text className="text-2xl font-bold text-green-600">
              {completedAppointments.length}
            </Text>
            <Text className="text-gray-600 text-sm">Completed</Text>
          </View>
        </View>

        {/* Upcoming Appointments */}
        {upcomingAppointments.length > 0 && (
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">
              Upcoming
            </Text>
            {upcomingAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.appointment.id}
                appointment={appointment}
                onPress={() => router.push(`/appointment/${appointment.appointment.id}`)}
              />
            ))}
          </View>
        )}

        {/* Completed Appointments */}
        {completedAppointments.length > 0 && (
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">
              Completed
            </Text>
            {completedAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.appointment.id}
                appointment={appointment}
                onPress={() => router.push(`/appointment/${appointment.appointment.id}`)}
              />
            ))}
          </View>
        )}

        {/* Empty State */}
        {todayAppointments.length === 0 && (
          <EmptyState
            icon="calendar-outline"
            title="No appointments today"
            description="Enjoy your day off!"
          />
        )}

        {/* Quick Actions */}
        <View className="mt-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Quick Actions
          </Text>
          <View className="flex-row space-x-4">
            <TouchableOpacity
              className="flex-1 bg-blue-600 p-4 rounded-lg flex-row items-center justify-center"
              onPress={() => router.push('/calendar')}
            >
              <Ionicons name="calendar" size={20} color="white" />
              <Text className="text-white font-medium ml-2">View Calendar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 bg-gray-600 p-4 rounded-lg flex-row items-center justify-center"
              onPress={() => router.push('/clients')}
            >
              <Ionicons name="people" size={20} color="white" />
              <Text className="text-white font-medium ml-2">View Clients</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
