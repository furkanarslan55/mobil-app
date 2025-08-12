import AsyncStorage from "@react-native-async-storage/async-storage";
import { SplashScreen, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

// Splash Screen otomatik kapanmasını engelle
SplashScreen.preventAutoHideAsync();

const getToken = async () => {
  try {
    return await AsyncStorage.getItem("authToken");
  } catch (error) {
    console.error("Token alınamadı", error);
    return null;
  }
};

export default function AppLayout() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    async function checkAuthStatus() {
      try {
        const token = await getToken();
        setLoggedIn(!!token); // token varsa true, yoksa false
      } catch (e) {
        console.error("Token kontrol hatası:", e);
        setLoggedIn(false);
      } finally {
        setIsAuthChecked(true);
        SplashScreen.hideAsync();
      }
    }
    checkAuthStatus();
  }, []);

  if (!isAuthChecked) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {loggedIn ? (
        <>
          <Stack.Screen name="home" />
          {/* Giriş yapılmış diğer sayfalar */}
        </>
      ) : (
        <>
          <Stack.Screen name="index" />
          {/* Giriş yapılmamış diğer sayfalar */}
        </>
      )}
    </Stack>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
});
