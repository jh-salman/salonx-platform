import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <View className="flex-1 justify-center items-center p-8">
      <Ionicons name={icon} size={64} color="#9ca3af" />
      <Text className="text-xl font-semibold text-gray-900 mt-4 text-center">
        {title}
      </Text>
      <Text className="text-gray-600 mt-2 text-center">
        {description}
      </Text>
    </View>
  );
}
