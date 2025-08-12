import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
// import { loginUser } from "../services/api"; // Orijinal API servisiniz
// import { saveToken } from "../services/auth"; // Orijinal auth servisiniz

// API kısıtlamasına takılmamak için bekleme (delay) fonksiyonu
const delay = (ms) => new Promise(res => setTimeout(res, ms));

const { width, height } = Dimensions.get('window');

// Mock API servisleri, gerçek API çağrılarınızı buraya entegre edin.
const loginUser = async (email, password) => {
    // API'nin gerçek yanıt formatını burada taklit ediyoruz.
    // Lütfen kendi API'nizden gelen doğru formatı buraya göre ayarlayın.
    // Başarılı bir giriş için:
    if (email === "bt.mudur@asyaport.com" && password === "1234567890") {
        await delay(1500); // Gerçek ağ gecikmesini simüle edin
        // API'den gelen token'ı içeren başarılı yanıt.
        return { token: "fake-jwt-token-for-user-bt.mudur" };
    }
    // Başarısız bir giriş için:
    if (email === "wrong@email.com") {
        await delay(1500);
        return { error: "E-posta veya şifre hatalı." };
    }
    await delay(1500);
    // Token'ın olmadığı ama hatanın da olmadığı bir senaryo.
    return { success: false };
};

const saveToken = async (token) => {
    // AsyncStorage veya benzeri bir depolama mekanizması ile token'ı kaydetme.
    // Bu fonksiyonu kendi auth servisinize göre güncelleyin.
    await delay(500);
    console.log("💾 Mock Token kaydedildi:", token);
};


export default function LoginScreen() {
    const [email, setEmail] = useState("bt.mudur@asyaport.com");
    const [password, setPassword] = useState("1234567890");
    const [loading, setLoading] = useState(false);
    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [message, setMessage] = useState(null); // Özel mesaj kutusu için state
    const router = useRouter();

    // Animasyonlar
    const fadeAnim = useState(new Animated.Value(0))[0];
    const slideAnim = useState(new Animated.Value(50))[0];

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    // Hata veya bilgi mesajını ekranda göstermek için yardımcı fonksiyon
    const showMessage = (text, type = 'error') => {
        setMessage({ text, type });
        // Mesajı 4 saniye sonra otomatik olarak gizle
        setTimeout(() => setMessage(null), 4000);
    };

    const handleLogin = async () => {
        // Form alanları boşsa hata uyarısı ver
        if (!email || !password) {
            showMessage("Lütfen email ve şifre giriniz.", "warning");
            return;
        }

        console.log("🚀 Login işlemi başlıyor...");
        console.log("📧 Email:", email);
        console.log("🔐 Password length:", password.length);

        setLoading(true); // Giriş işlemi başladığında loading durumunu true yap

        try {
            console.log("🌐 API çağrısı yapılıyor...");
            // loginUser API çağrısını yap
            const data = await loginUser(email, password);
            
            // API'den gelen yanıtı konsola basarak inceleyebiliriz.
            // Bu satır, API yanıtınızın yapısını anlamak için kritik.
            console.log("✅ API Response:", data);

            // Gelen yanıtta hem 'token' hem de 'error' anahtarlarını kontrol edin.
            if (data && data.token) {
                console.log("🎯 Token alındı:", data.token.substring(0, 20) + "...");

                // Token başarılıysa kaydet ve ana sayfaya yönlendir
                console.log("💾 Token kaydediliyor...");
                await saveToken(data.token);
                console.log("✅ Token kaydedildi");

                showMessage("Giriş başarılı.", "success");

                console.log("🚀 Ana sayfaya yönlendiriliyor...");
                router.replace("/home");

            } else if (data && data.error) {
                // Eğer API'den gelen bir hata mesajı varsa
                console.log("❌ API'den hata mesajı geldi:", data.error);
                showMessage(data.error);

            } else {
                // API'den ne token ne de hata mesajı gelmediyse genel bir hata göster
                console.log("❌ Token veya hata mesajı bulunamadı. Response:", data);
                showMessage("Giriş başarısız. Lütfen bilgilerinizi kontrol edin.");
            }
        } catch (error) {
            console.log("🔥 Login hatası:", error);
            console.log("🔥 Error message:", error.message);

            // API'den gelen hatayı yakala
            const errorMessage = error.message || "E-posta veya şifre hatalı olabilir.";
            showMessage(`Giriş başarısız: ${errorMessage}`);

            // Eğer "Too many attempts" veya sunucuya erişilememe hatası varsa, 10 saniye bekle
            if (errorMessage.includes("Too many attempts") || errorMessage.includes("Sunucuya erişilemiyor")) {
                showMessage("Çok fazla deneme yaptınız. Lütfen 10 saniye bekleyin.");
                await delay(10000);
            }
        } finally {
            // İşlem bittiğinde (başarılı veya hatalı) loading durumunu false yap
            console.log("🏁 Loading durumu kapatılıyor...");
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <Animated.View
                style={[
                    styles.content,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }],
                    },
                ]}
            >
                {/* Brand Section */}
                <View style={styles.brandSection}>
                    <Text style={styles.brandText}>asyaport</Text>
                </View>

                {/* Form Section */}
                <View style={styles.formSection}>
                    {/* E-posta Input */}
                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>E-posta</Text>
                        <View style={[
                            styles.inputContainer,
                            emailFocused && styles.inputContainerFocused
                        ]}>
                            <TextInput
                                style={styles.input}
                                placeholder="ornek@email.com"
                                placeholderTextColor="#666666"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                editable={!loading}
                                onFocus={() => setEmailFocused(true)}
                                onBlur={() => setEmailFocused(false)}
                            />
                        </View>
                    </View>

                    {/* Şifre Input */}
                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>Şifre</Text>
                        <View style={[
                            styles.inputContainer,
                            passwordFocused && styles.inputContainerFocused
                        ]}>
                            <TextInput
                                style={styles.input}
                                placeholder="••••••••"
                                placeholderTextColor="#666666"
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                                editable={!loading}
                                onFocus={() => setPasswordFocused(true)}
                                onBlur={() => setPasswordFocused(false)}
                            />
                        </View>
                    </View>

                    {/* Mesaj Kutusu */}
                    {message && (
                        <View style={[styles.messageBox, styles[`messageBox-${message.type}`]]}>
                            <Text style={styles.messageText}>{message.text}</Text>
                        </View>
                    )}

                    {/* Şifremi Unuttum */}
                    <TouchableOpacity style={styles.forgotPasswordButton}>
                        <Text style={styles.forgotPasswordText}>Şifremi Unuttum?</Text>
                    </TouchableOpacity>

                    {/* Giriş Yap Butonu */}
                    <TouchableOpacity
                        style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                        onPress={handleLogin}
                        disabled={loading}
                        activeOpacity={0.8}
                    >
                        {loading ? (
                            <ActivityIndicator color="#000000" size="small" />
                        ) : (
                            <Text style={styles.buttonText}>Giriş Yap</Text>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Hesabınız yok mu?{' '}
                        <Text style={styles.signUpText}>Kayıt Olun</Text>
                    </Text>
                </View>
            </Animated.View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000000",
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    brandSection: {
        alignItems: 'center',
        marginBottom: 60,
    },
    brandText: {
        fontSize: 42,
        fontWeight: '800',
        color: '#FFD700',
        textAlign: 'center',
        letterSpacing: 1,
    },
    formSection: {
        width: '100%',
    },
    inputWrapper: {
        marginBottom: 24,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFD700',
        marginBottom: 12,
        marginLeft: 4,
    },
    inputContainer: {
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#333333',
        paddingHorizontal: 16,
        paddingVertical: 2,
        shadowColor: '#FFD700',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
    },
    inputContainerFocused: {
        borderColor: '#FFD700',
        backgroundColor: '#1F1F1F',
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
    },
    input: {
        height: 44,
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: '500',
    },
    messageBox: {
        borderRadius: 8,
        padding: 12,
        marginBottom: 24,
        alignItems: 'center',
    },
    'messageBox-error': {
        backgroundColor: '#D9534F',
    },
    'messageBox-warning': {
        backgroundColor: '#F0AD4E',
    },
    'messageBox-success': {
        backgroundColor: '#5CB85C',
    },
    messageText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    forgotPasswordButton: {
        alignItems: 'flex-end',
        marginBottom: 32,
    },
    forgotPasswordText: {
        color: '#FFD700',
        fontSize: 14,
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
    loginButton: {
        backgroundColor: '#FFD700',
        height: 60,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#FFD700',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 8,
        marginBottom: 20,
    },
    loginButtonDisabled: {
        backgroundColor: '#444444',
        shadowOpacity: 0,
        elevation: 0,
    },
    buttonText: {
        color: '#000000',
        fontSize: 18,
        fontWeight: '700',
    },
    footer: {
        alignItems: 'center',
        marginTop: 40,
    },
    footerText: {
        color: '#CCCCCC',
        fontSize: 14,
    },
    signUpText: {
        color: '#FFD700',
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
});
