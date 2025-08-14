import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
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

const { width, height } = Dimensions.get('window');

// API kısıtlamasına takılmamak için bekleme (delay) fonksiyonu
const delay = (ms) => new Promise(res => setTimeout(res, ms));

// Basit bir parçacık efekti için animasyonlu bir bileşen
// Bu bileşen, LoginScreen'den önce tanımlanarak "ReferenceError" hatası giderildi.
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

// Bu fonksiyon, API'ye HTTP isteğini gönderir ve yanıtı işler.
// Artık 200 (OK) yanıtı geldiği sürece hata fırlatmayacak.
const loginUser = async (email, password) => {
    try {
        console.log("📡 API'ye istek gönderiliyor:", "http://10.10.114.160:7190/api/Auth/login");
        console.log("📧 Gönderilen data:", { Email: email, Password: "***" });
        
        const response = await fetch("http://10.10.114.160:7190/api/Auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ Email: email, Password: password }),
        });

        console.log("📊 Response status:", response.status);

        // API yanıtı başarılı değilse, hatayı yakala ve mesaj fırlat
        if (!response.ok) {
            let errorData;
            const responseText = await response.text();
            try {
                errorData = JSON.parse(responseText);
            } catch {
                errorData = { message: responseText || "Bilinmeyen sunucu hatası" };
            }
            console.log("❌ API'den dönen hata:", errorData.message);
            throw new Error(errorData.message || "Giriş başarısız oldu.");
        }
        
        // Yanıt başarılı olduğu için, token kontrolü yapılmadan veriyi döndür.
        const responseText = await response.text();
        if (!responseText) {
            console.log("✅ Başarılı yanıt, ancak gövdesi boş.");
            return {};
        }

        const data = JSON.parse(responseText);
        console.log("✅ Başarılı yanıt:", data);
        return data;
    } catch (error) {
        console.log("🔥 Fetch hatası:", error.message);
        throw error;
    }
};

export default function LoginScreen() {
    // E-posta ve şifre için state'ler
    const [email, setEmail] = useState("bt.mudur@asyaport.com");
    // Şifreyi boş string olarak başlatmak daha güvenlidir.
    const [password, setPassword] = useState(""); 
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null); // Özel mesaj kutusu için state
    const router = useRouter();

    const fadeAnim = useState(new Animated.Value(0))[0];
    const slideAnim = useState(new Animated.Value(50))[0];
    const particleAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Ekranın açılışındaki animasyonlar
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                // useNativeDriver'ı React Native Web'de kullanmak yerine false olarak ayarlıyoruz.
                useNativeDriver: Platform.OS !== 'web',
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: Platform.OS !== 'web',
            }),
        ]).start();

        // Arka plan parçacıklarının döngüsel animasyonu
        const animation = Animated.loop(
            Animated.timing(particleAnim, {
                toValue: 1,
                duration: 8000,
                useNativeDriver: Platform.OS !== 'web',
            })
        );
        animation.start();
        return () => animation.stop();
    }, []);

    // Kullanıcıya mesaj göstermek için yardımcı fonksiyon
    const showMessage = (text, type = 'error') => {
        setMessage({ text, type });
        // 4 saniye sonra mesajı temizle
        setTimeout(() => setMessage(null), 4000); 
    };

    // Login butonuna basıldığında çalışacak ana fonksiyon
    const handleLogin = async () => {
        // Basit ön doğrulama
        if (!email || !password) {
            showMessage("Lütfen email ve şifre giriniz.", "warning");
            return;
        }

        setLoading(true);
        showMessage(null); // Yeni bir işlem başladığında eski mesajı temizle

        try {
            await loginUser(email, password);

            // API'den 200 OK geldiğinde giriş başarılı kabul ediliyor
            showMessage("Giriş başarılı.", "success");
            // Yönlendirme için 1 saniye bekle
            await delay(1000); 
            router.replace("/home");
            
        } catch (error) {
            console.log("🔥 Login işlemi hatası:", error.message);
            const errorMessage = error.message || "E-posta veya şifre hatalı olabilir.";
            showMessage(`Giriş başarısız: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
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
                        <TextInput
                            style={styles.input}
                            placeholder="E-posta"
                            placeholderTextColor="#666666"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            editable={!loading}
                        />
                    </View>

                    {/* Şifre Input */}
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            placeholder="Şifre"
                            placeholderTextColor="#666666"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                            editable={!loading}
                        />
                    </View>

                    {/* Mesaj Kutusu */}
                    {message && (
                        <View style={[styles.messageBox, styles[`messageBox-${message.type}`]]}>
                            <Text style={styles.messageText}>{message.text}</Text>
                        </View>
                    )}

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
                    <TouchableOpacity>
                        <Text style={styles.footerText}>
                            Şifremi Unuttum?
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text style={styles.footerText}>
                            Hesabınız yok mu? <Text style={styles.signUpText}>Kayıt Olun</Text>
                        </Text>
                    </TouchableOpacity>
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
    input: {
        height: 60,
        backgroundColor: "#1A1A1A",
        color: "#FFFFFF",
        borderRadius: 30,
        paddingHorizontal: 20,
        fontSize: 18,
        fontWeight: "500",
        borderWidth: 1,
        borderColor: '#333333',
        ...Platform.select({
            web: {
                boxShadow: '0 4px 5px rgba(255, 215, 0, 0.1)',
            },
            default: {
                shadowColor: '#FFD700',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 5,
                elevation: 5,
            }
        })
    },
    messageBox: {
        borderRadius: 30,
        padding: 15,
        marginBottom: 24,
        alignItems: 'center',
        ...Platform.select({
            web: {
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            },
            default: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 5,
            }
        })
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
    loginButton: {
        backgroundColor: '#FFD700',
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        ...Platform.select({
            web: {
                boxShadow: '0 4px 10px rgba(255, 215, 0, 0.5)',
            },
            default: {
                shadowColor: '#FFD700',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.5,
                shadowRadius: 10,
                elevation: 8,
            }
        }),
        marginTop: 20,
    },
    loginButtonDisabled: {
        backgroundColor: '#444444',
        ...Platform.select({
            web: {
                boxShadow: 'none',
            },
            default: {
                shadowOpacity: 0,
                elevation: 0,
            }
        })
    },
    buttonText: {
        color: '#000000',
        fontSize: 22,
        fontWeight: '700',
    },
    footer: {
        alignItems: 'center',
        marginTop: 40,
        gap: 15,
    },
    footerText: {
        color: '#CCCCCC',
        fontSize: 14,
        fontWeight: '500',
    },
    signUpText: {
        color: '#FFD700',
        fontWeight: '700',
        textDecorationLine: 'underline',
    },
    particle: {
        position: "absolute",
        backgroundColor: "#FFD700",
        opacity: 0,
    },
});
