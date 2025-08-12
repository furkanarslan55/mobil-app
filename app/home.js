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
                outputRange: [-width * 0.5, width * 1.5], // Ekranın dışından içeri gelsin
              }),
            },
            {
              translateY: animValue.interpolate({
                inputRange: [0, 1],
                outputRange: [-height * 0.5, height * 1.5], // Ekranın dışından içeri gelsin
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

  // Yeni sayfaya yönlendirme fonksiyonu
  const handleZimmetler = () => {
    router.push("/zimmetler");
  };

  // Yeni sayfaya yönlendirme fonksiyonu
  const handleTalep = () => {
    router.push("/talep-olustur");
  };

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
            width: Math.random() * 8 + 2, // 2-10 arası
            height: Math.random() * 8 + 2, // 2-10 arası
            borderRadius: 50,
            backgroundColor: "rgba(255, 215, 0, 0.7)", // Altın sarısı, hafif şeffaf
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000", // Koyu siyah
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
    backgroundColor: "#FFD700", // Altın sarısı
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
    color: "#000000", // Siyah
    fontSize: 22,
    fontWeight: 'bold', // Montserrat Bold yerine, font yüklenene kadar bu kullanılabilir.
  },
  // Basit parçacık stili
  particle: {
    position: "absolute",
    backgroundColor: "#FFD700",
    opacity: 0,
  },
});
