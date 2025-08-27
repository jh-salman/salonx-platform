import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../src/providers/AuthProvider';
import { NotificationProvider } from '../src/providers/NotificationProvider';
import '../src/styles/global.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationProvider>
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: '#f8fafc',
              },
              headerTintColor: '#1e293b',
              headerTitleStyle: {
                fontWeight: '600',
              },
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="auth" options={{ headerShown: false }} />
            <Stack.Screen name="appointment/[id]" options={{ title: 'Appointment Details' }} />
          </Stack>
          <StatusBar style="auto" />
        </NotificationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
