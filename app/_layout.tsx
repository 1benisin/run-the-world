import { Stack } from "expo-router";
import { useEffect } from "react";
import { PaperProvider } from "react-native-paper";
import { useUserLocation } from "../hooks/useUserLocation";

export default function RootLayout() {
  const { requestPermission } = useUserLocation();

  useEffect(() => {
    // Request location permission when the app starts
    requestPermission();
  }, [requestPermission]);

  return (
    <PaperProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </PaperProvider>
  );
}
