import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';

interface AppointmentCardProps {
  appointment: {
    appointment: {
      id: string;
      startAt: string;
      endAt: string;
      status: string;
      paymentStatus: string;
      notes?: string;
    };
    service: {
      name: string;
      durationMinutes: number;
    };
    client: {
      firstName: string;
      lastName: string;
      phone?: string;
    };
    stylist: {
      firstName: string;
      lastName: string;
    };
  };
  onPress: () => void;
}

export function AppointmentCard({ appointment, onPress }: AppointmentCardProps) {
  const { appointment: apt, service, client, stylist } = appointment;
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'text-green-600';
      case 'PENDING': return 'text-yellow-600';
      case 'COMPLETED': return 'text-blue-600';
      case 'CANCELLED': return 'text-red-600';
      case 'PARKED': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'checkmark-circle';
      case 'PENDING': return 'time';
      case 'COMPLETED': return 'checkmark-done-circle';
      case 'CANCELLED': return 'close-circle';
      case 'PARKED': return 'pause-circle';
      default: return 'help-circle';
    }
  };

  return (
    <TouchableOpacity
      className="bg-white p-4 rounded-lg shadow-sm mb-3 border border-gray-100"
      onPress={onPress}
    >
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-900">
            {client.firstName} {client.lastName}
          </Text>
          <Text className="text-gray-600">{service.name}</Text>
        </View>
        <View className="flex-row items-center">
          <Ionicons 
            name={getStatusIcon(apt.status) as any} 
            size={20} 
            className={getStatusColor(apt.status)}
          />
          <Text className={`ml-1 text-sm font-medium ${getStatusColor(apt.status)}`}>
            {apt.status}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center mb-2">
        <Ionicons name="time-outline" size={16} color="#6b7280" />
        <Text className="text-gray-600 ml-1">
          {format(new Date(apt.startAt), 'h:mm a')} - {format(new Date(apt.endAt), 'h:mm a')}
        </Text>
        <Text className="text-gray-500 ml-2">
          ({service.durationMinutes} min)
        </Text>
      </View>

      {client.phone && (
        <View className="flex-row items-center mb-2">
          <Ionicons name="call-outline" size={16} color="#6b7280" />
          <Text className="text-gray-600 ml-1">{client.phone}</Text>
        </View>
      )}

      {apt.notes && (
        <View className="flex-row items-start">
          <Ionicons name="document-text-outline" size={16} color="#6b7280" />
          <Text className="text-gray-600 ml-1 flex-1">{apt.notes}</Text>
        </View>
      )}

      <View className="flex-row justify-between items-center mt-3 pt-3 border-t border-gray-100">
        <Text className="text-sm text-gray-500">
          with {stylist.firstName} {stylist.lastName}
        </Text>
        <View className="flex-row items-center">
          <Ionicons 
            name={apt.paymentStatus === 'PAID' ? 'card' : 'card-outline'} 
            size={16} 
            color={apt.paymentStatus === 'PAID' ? '#10b981' : '#6b7280'} 
          />
          <Text className={`ml-1 text-sm ${apt.paymentStatus === 'PAID' ? 'text-green-600' : 'text-gray-600'}`}>
            {apt.paymentStatus}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
