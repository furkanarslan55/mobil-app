import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

// Basit bir parçacık efekti için animasyonlu bir bileşen
const Particle = ({ animValue, style }) => {
  return (
    <Animated.View
      style={[
        styles.particle,
        style,
        {
          transform: [
            {
              translateX: animValue.interpolate({
                inputRange: [0, 1],
                outputRange: [-width * 0.5, width * 1.5],
              }),
            },
            {
              translateY: animValue.interpolate({
                inputRange: [0, 1],
                outputRange: [-height * 0.5, height * 1.5],
              }),
            },
            {
              scale: animValue.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0.5, 1, 0.5],
              }),
            },
          ],
          opacity: animValue.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, 1, 0],
          }),
        },
      ]}
    />
  );
};

export default function HomeScreen() {
  const router = useRouter();
  const particleAnim = useRef(new Animated.Value(0)).current;

  // Parçacık animasyonunu başlat
  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(particleAnim, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: true,
      })
    );
    animation.start();
    return () => animation.stop();
  }, [particleAnim]);

  // Yönlendirme fonksiyonları
  const handleZimmetler = () => router.push("/zimmetler");
  const handleTalep = () => router.push("/talep-olustur");
  const handleEgitimler = () => router.push("/egitimler");

  return (
    <View style={styles.container}>
      {/* Arka plan parçacıkları */}
      {Array.from({ length: 50 }).map((_, i) => (
        <Particle
          key={i}
          animValue={particleAnim}
          style={{
            position: "absolute",
            top: Math.random() * height,
            left: Math.random() * width,
            width: Math.random() * 8 + 2,
            height: Math.random() * 8 + 2,
            borderRadius: 50,
            backgroundColor: "rgba(255, 215, 0, 0.7)",
          }}
        />
      ))}

      <View style={styles.contentContainer}>
        <TouchableOpacity style={styles.button} onPress={handleZimmetler}>
          <Text style={styles.buttonText}>ZİMMETLER</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleTalep}>
          <Text style={styles.buttonText}>TALEP</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleEgitimler}>
          <Text style={styles.buttonText}>EĞİTİMLER</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
  },
  button: {
    width: "100%",
    height: 70,
    backgroundColor: "#FFD700",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 35,
    marginVertical: 15,
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonText: {
    color: "#000000",
    fontSize: 22,
    fontWeight: "bold",
  },
  particle: {
    position: "absolute",
    backgroundColor: "#FFD700",
    opacity: 0,
  },
});
