// app/servis-talep.js
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function ServisTalepScreen() {
  const router = useRouter();

  // State'ler
  const [esya, setEsya] = useState("");
  const [tarih, setTarih] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [sorunTipi, setSorunTipi] = useState("");
  const [aciklama, setAciklama] = useState("");

  const handleSubmit = async () => {
    if (!esya || !sorunTipi || !aciklama) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun.");
      return;
    }

    const data = {
      esya,
      tarih: tarih.toISOString(),
      sorunTipi,
      aciklama,
    };

    try {
      const res = await fetch("http://senin-api-adresin.com/api/servis-talep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        Alert.alert("Başarılı", "Servis talebiniz oluşturuldu.");
        router.push("/home");
      } else {
        Alert.alert("Hata", "Talep oluşturulamadı.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Hata", "Bağlantı hatası oluştu.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Geri Butonu */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.push("/home")}>
        <Text style={styles.backButtonText}>{"< Ana Sayfa"}</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Servis Talep Formu</Text>

      {/* Eşya seçimi */}
      <Text style={styles.label}>Zimmetli Eşya</Text>
      <Picker
        selectedValue={esya}
        style={styles.picker}
        onValueChange={(itemValue) => setEsya(itemValue)}
      >
        <Picker.Item label="Seçiniz" value="" />
        <Picker.Item label="Laptop" value="Laptop" />
        <Picker.Item label="Yazıcı" value="Yazıcı" />
        <Picker.Item label="Monitör" value="Monitör" />
      </Picker>

      {/* Tarih seçimi */}
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

      {/* Sorun tipi seçimi */}
      <Text style={styles.label}>Sorun Tipi</Text>
      <Picker
        selectedValue={sorunTipi}
        style={styles.picker}
        onValueChange={(itemValue) => setSorunTipi(itemValue)}
      >
        <Picker.Item label="Seçiniz" value="" />
        <Picker.Item label="Donanım Arızası" value="Donanım Arızası" />
        <Picker.Item label="Yazılım Hatası" value="Yazılım Hatası" />
        <Picker.Item label="Ağ Problemi" value="Ağ Problemi" />
      </Picker>

      {/* Açıklama */}
      <Text style={styles.label}>Açıklama</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Sorununuzu detaylı yazınız"
        placeholderTextColor="#999"
        multiline
        value={aciklama}
        onChangeText={setAciklama}
      />

      {/* Gönder butonu */}
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
  dateButton: {
    backgroundColor: "#1a1a1a",
    padding: 15,
    borderRadius: 10,
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
