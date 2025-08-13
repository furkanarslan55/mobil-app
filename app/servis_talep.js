// app/servis-talep.js
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

// Backend API URL
const API_URL = "http://10.10.114.160:7190/api/ServiceRequests"; // Mobil cihazın erişebileceği IP

export default function ServisTalepScreen() {
  const router = useRouter();

  const [esya, setEsya] = useState(null);
  const [tarih, setTarih] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [sorunTipi, setSorunTipi] = useState(null);
  const [aciklama, setAciklama] = useState("");

  const handleSubmit = async () => {
    if (!esya || !sorunTipi || !aciklama) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun.");
      return;
    }

    const data = {
      assignedItem: esya,
      problemDate: tarih.toISOString(),
      problemType: sorunTipi,
      description: aciklama,
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        Alert.alert("Başarılı", "Servis talebiniz oluşturuldu.");
        router.push("/home");
      } else {
        // Hata mesajını daha açıklayıcı al
        let errorText = await res.text();
        try {
          const errorJson = JSON.parse(errorText);
          errorText = errorJson.message || JSON.stringify(errorJson);
        } catch {
          // text olarak kullan
        }
        console.log("Backend Hatası:", errorText);
        Alert.alert("Hata", `Talep oluşturulamadı:\n${errorText}`);
      }
    } catch (error) {
      console.error("Bağlantı Hatası:", error);
      Alert.alert(
        "Bağlantı Hatası",
        `Backend'e ulaşılamadı. URL ve ağ bağlantısını kontrol edin.\n\nDetay: ${error.message}`
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formWrapper}>
        <Text style={styles.label}>Zimmetli Eşya</Text>
        <Picker selectedValue={esya} style={styles.picker} onValueChange={setEsya}>
          <Picker.Item label="Seçiniz" value={null} />
          <Picker.Item label="Laptop" value="Laptop" />
          <Picker.Item label="Yazıcı" value="Yazıcı" />
          <Picker.Item label="Monitör" value="Monitör" />
        </Picker>

        <Text style={styles.label}>Sorunun Oluştuğu Tarih</Text>
        <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
          <Text style={{ color: "#fff" }}>{tarih.toLocaleDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={tarih}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setTarih(selectedDate);
            }}
          />
        )}

        <Text style={styles.label}>Sorun Tipi</Text>
        <Picker selectedValue={sorunTipi} style={styles.picker} onValueChange={setSorunTipi}>
          <Picker.Item label="Seçiniz" value={null} />
          <Picker.Item label="Donanım Arızası" value="Donanım Arızası" />
          <Picker.Item label="Yazılım Hatası" value="Yazılım Hatası" />
          <Picker.Item label="Ağ Problemi" value="Ağ Problemi" />
        </Picker>

        <Text style={styles.label}>Açıklama</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Sorununuzu detaylı yazınız"
          placeholderTextColor="#999"
          multiline
          value={aciklama}
          onChangeText={setAciklama}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Gönder</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", paddingTop: 80, justifyContent: "center", alignItems: "center" },
  formWrapper: { width: "90%" },
  label: { color: "#FFD700", marginBottom: 5 },
  picker: { backgroundColor: "#1a1a1a", color: "#fff", marginBottom: 20 },
  dateButton: { backgroundColor: "#1a1a1a", padding: 15, borderRadius: 10, marginBottom: 20 },
  textArea: { backgroundColor: "#1a1a1a", color: "#fff", borderRadius: 10, padding: 15, height: 100, marginBottom: 20, textAlignVertical: "top" },
  button: { backgroundColor: "#FFD700", padding: 15, borderRadius: 30, alignItems: "center" },
  buttonText: { color: "#000", fontSize: 18, fontWeight: "bold" },
});
