// ../services/api.js
import axios from "axios";

// Proje genelinde kullanılacak temel API URL'si
const API_URL = "http://10.10.114.160:7190/api";

/**
 * Kullanıcı girişi yapmak için API çağrısı.
 *
 * @param {string} email Kullanıcı e-posta adresi.
 * @param {string} password Kullanıcı şifresi.
 * @returns {Promise<Object>} Backend'den dönen veri.
 */
export const loginUser = async (email, password) => {
  try {
    const res = await axios.post(`${API_URL}/Auth/login`, { email, password });
    return res.data; // Başarılı giriş durumunda token gibi veriler döner
  } catch (error) {
    // Hata yakalama ve detaylı loglama
    if (error.response) {
      // Sunucudan gelen hata cevabı (örn: 401 Unauthorized, 429 Too many attempts)
      console.error("API Hatası:", error.response.data);
      // loginUser'ı çağıran fonksiyona detaylı hata bilgisini ilet
      throw error.response.data;
    } else if (error.request) {
      // İstek yapıldı ama cevap alınamadı (örn: sunucu kapalı veya ağ bağlantısı yok)
      console.error("API İstek Hatası:", error.request);
      throw new Error("Sunucuya erişilemiyor. Lütfen internet bağlantınızı kontrol edin.");
    } else {
      // İstek ayarlarında oluşan genel bir hata
      console.error("API Genel Hata:", error.message);
      throw new Error(error.message);
    }
  }
};

/**
 * Basit bir API testi için çağrı (örn: healthcheck endpoint).
 * Bu fonksiyon da tutarlılık için axios ile güncellendi.
 * @returns {Promise<Object>} API'den dönen JSON verisi.
 */
export const testApi = async () => {
  try {
    const res = await axios.get(`${API_URL}/healthcheck`);
    // Axios, başarısız durumlar için otomatik olarak catch bloğunu tetikler,
    // bu yüzden `!res.ok` kontrolüne gerek kalmaz.
    return res.data;
  } catch (error) {
    console.error("API test hatası:", error);
    // Hata durumunda, hatayı çağıran fonksiyona ilet
    throw error;
  }
};
