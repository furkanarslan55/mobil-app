// app/talep-olustur.js
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function TalepOlusturmaScreen() {
  const router = useRouter();

  const handleZimmetTalep = () => {
    router.push("/zimmet_talep");
  };

  const handleServisTalep = () => {
    router.push("/servis_talep");
  };

  return (
    <View style={styles.container}>
      {/* Ana Sayfa butonu */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push("/home")}
      >
        <Text style={styles.backButtonText}>{"< Ana Sayfa"}</Text>
      </TouchableOpacity>

      

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleZimmetTalep}>
          <Text style={styles.buttonText}>Zimmet Talep</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleServisTalep}>
          <Text style={styles.buttonText}>Servis Talep</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 20,
    paddingTop: 60,
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
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 40,
    textAlign: "center",
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    gap: 20,
  },
  button: {
    backgroundColor: "#FFD700",
    paddingVertical: 20,
    borderRadius: 30,
    alignItems: "center",
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonText: {
    color: "#000",
    fontSize: 20,
    fontWeight: "bold",
  },
});
