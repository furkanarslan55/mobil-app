// app/zimmetler.js
import { useRouter } from "expo-router";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Mock (sahte) zimmet verileri
const zimmetler = [
  { id: "1", ad: "Laptop", model: "MacBook Pro", zimmetTarihi: "12.03.2023" },
  { id: "2", ad: "Monitör", model: "Dell UltraSharp", zimmetTarihi: "05.01.2024" },
  { id: "3", ad: "Klavye", model: "Logitech MX Keys", zimmetTarihi: "21.07.2023" },
  { id: "4", ad: "Mouse", model: "Logitech MX Master 3", zimmetTarihi: "21.07.2023" },
];

const ZimmetItem = ({ zimmet }) => (
  <View style={styles.itemContainer}>
    <Text style={styles.itemTitle}>{zimmet.ad}</Text>
    <Text style={styles.itemText}>Model: {zimmet.model}</Text>
    <Text style={styles.itemText}>Zimmet Tarihi: {zimmet.zimmetTarihi}</Text>
  </View>
);

export default function ZimmetlerScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Geri butonu */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>{"< Geri"}</Text>
      </TouchableOpacity>

      <Text style={styles.headerTitle}>Zimmetlerim</Text>
      
      {/* Zimmetleri listeleyen FlatList */}
      <FlatList
        data={zimmetler}
        renderItem={({ item }) => <ZimmetItem zimmet={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 20,
    textAlign: "center",
  },
  list: {
    paddingBottom: 20,
  },
  itemContainer: {
    backgroundColor: "#1a1a1a",
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  itemTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 5,
  },
  itemText: {
    fontSize: 16,
    color: "#e0e0e0",
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 1,
  },
  backButtonText: {
    color: "#FFD700",
    fontSize: 18,
    fontWeight: "bold",
  },
});
