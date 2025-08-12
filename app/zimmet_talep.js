// app/zimmet_talep.js
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function ZimmetTalepScreen() {
  const router = useRouter();

  const [kategori, setKategori] = useState("");
  const [zimmetAdi, setZimmetAdi] = useState("");
  const [talepNedeni, setTalepNedeni] = useState("");
  const [aciklama, setAciklama] = useState("");

  const handleSubmit = () => {
    if (!kategori || !zimmetAdi.trim() || !talepNedeni || !aciklama.trim()) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun.");
      return;
    }

    const talepData = {
      kategori,
      zimmetAdi,
      talepNedeni,
      aciklama,
    };

    console.log("Zimmet Talebi:", talepData);

    Alert.alert("Başarılı", "Zimmet talebiniz oluşturuldu.");
    router.push("/home"); // Ana sayfaya dönüş
  };

  return (
    <View style={styles.container}>
      {/* Geri butonu */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.push("/talep-olustur")}>
        <Text style={styles.backButtonText}>{"< Geri"}</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Zimmet Talep Formu</Text>

      {/* Zimmet Kategorisi */}
      <Text style={styles.label}>Zimmet Kategorisi</Text>
      <Picker
        selectedValue={kategori}
        style={styles.picker}
        onValueChange={(itemValue) => setKategori(itemValue)}
      >
        <Picker.Item label="Seçiniz" value="" />
        <Picker.Item label="Elektronik" value="Elektronik" />
        <Picker.Item label="Mobilya" value="Mobilya" />
        <Picker.Item label="Ofis Malzemeleri" value="Ofis Malzemeleri" />
      </Picker>

      {/* Zimmet Adı */}
      <Text style={styles.label}>Zimmet Adı</Text>
      <TextInput
        style={styles.input}
        placeholder="Zimmet adını yazınız"
        placeholderTextColor="#999"
        value={zimmetAdi}
        onChangeText={setZimmetAdi}
      />

      {/* Talep Nedeni */}
      <Text style={styles.label}>Talep Nedeni</Text>
      <Picker
        selectedValue={talepNedeni}
        style={styles.picker}
        onValueChange={(itemValue) => setTalepNedeni(itemValue)}
      >
        <Picker.Item label="Seçiniz" value="" />
        <Picker.Item label="Yeni Talep" value="Yeni Talep" />
        <Picker.Item label="Arıza" value="Arıza" />
        <Picker.Item label="Değişim" value="Değişim" />
      </Picker>

      {/* Açıklama */}
      <Text style={styles.label}>Açıklama</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Talebinizi detaylı yazınız"
        placeholderTextColor="#999"
        multiline
        value={aciklama}
        onChangeText={setAciklama}
      />

      {/* Gönder Butonu */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Gönder</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 1,
    padding: 10,
  },
  backButtonText: {
    color: "#FFD700",
    fontSize: 16,
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 20,
    textAlign: "center",
    marginTop: 40,
  },
  label: {
    color: "#FFD700",
    marginBottom: 5,
  },
  picker: {
    backgroundColor: "#1a1a1a",
    color: "#fff",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#1a1a1a",
    color: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  textArea: {
    backgroundColor: "#1a1a1a",
    color: "#fff",
    borderRadius: 10,
    padding: 15,
    height: 100,
    marginBottom: 20,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#FFD700",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
  },
  buttonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
  },
});
