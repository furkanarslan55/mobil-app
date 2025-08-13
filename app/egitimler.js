import { Ionicons } from '@expo/vector-icons'; // İkon için gerekli
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
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

// Eğitim verileri - İhtiyacınıza göre bu veriyi düzenleyebilirsiniz
const trainingsData = [
  {
    category: "Güvenlik Eğitimleri",
    trainings: [
      { id: 1, title: "Bilgi Güvenliği Temelleri" },
      { id: 2, title: "Siber Güvenlik Farkındalığı" },
      { id: 3, title: "Oltalama Saldırıları ve Korunma Yöntemleri" },
    ],
  },
  {
    category: "SAP Sistemleri",
    trainings: [
      { id: 4, title: "Modülerlik " },
      { id: 5, title: "Temel SAP" },
      { id: 6, title: "SAP Performans Optimizasyonu" },
    ],
  },
  {
    category: "İş Sağlığı ve Güvenliği",
    trainings: [
      { id: 7, title: "Temel İş Sağlığı" },
      { id: 8, title: "Temel İş Güvenliği" },
    ],
  },
];

export default function EgitimlerScreen() {
  const router = useRouter();
  const particleAnim = useRef(new Animated.Value(0)).current;
  const [expandedCategory, setExpandedCategory] = useState(null); // Hangi kategorinin açık olduğunu tutar

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

  // Kategoriye tıklama işlemi
  const toggleCategory = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
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
            width: Math.random() * 8 + 2,
            height: Math.random() * 8 + 2,
            borderRadius: 50,
            backgroundColor: "rgba(255, 215, 0, 0.7)",
          }}
        />
      ))}

      <View style={styles.contentContainer}>
        {/* Geri Butonu */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.push("/home")}>
          <Text style={styles.backButtonText}>{"< Ana Sayfa"}</Text>
        </TouchableOpacity>

        <Text style={styles.pageTitle}>Eğitimler</Text>

        {/* Eğitim Kategorileri Listesi */}
        <View style={styles.listContainer}>
          {trainingsData.map((item, index) => (
            <View key={index} style={styles.categoryCard}>
              <TouchableOpacity
                style={styles.categoryHeader}
                onPress={() => toggleCategory(item.category)}
              >
                <Text style={styles.categoryTitle}>{item.category}</Text>
                <Ionicons
                  name={expandedCategory === item.category ? "chevron-up" : "chevron-down"}
                  size={24}
                  color="#FFD700"
                />
              </TouchableOpacity>
              {expandedCategory === item.category && (
                <View style={styles.trainingList}>
                  {item.trainings.map((training) => (
                    <Text key={training.id} style={styles.trainingItem}>
                      - {training.title}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
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
    width: "90%",
    paddingTop: 80,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFD700",
    textAlign: "center",
    marginBottom: 30,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 0,
    zIndex: 10,
    padding: 10,
  },
  backButtonText: {
    color: "#FFD700",
    fontSize: 16,
    fontWeight: "bold",
  },
  listContainer: {
    width: "100%",
  },
  categoryCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 20,
    overflow: "hidden", // İçerik açıldığında taşmasını engeller
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "600",
  },
  trainingList: {
    marginTop: 15,
  },
  trainingItem: {
    color: "#FFD700",
    fontSize: 16,
    marginBottom: 8,
  },
  particle: {
    position: "absolute",
    backgroundColor: "#FFD700",
    opacity: 0,
  },
});
