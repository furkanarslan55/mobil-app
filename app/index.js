import AsyncStorage from "@react-native-async-storage/async-storage";
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

const loginUser = async (email, password) => {
    try {
        const response = await fetch("http://10.10.114.160:7190/api/Auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ Email: email, Password: password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Giriş başarısız");
        }

        return await response.json(); // backend’den gelen token ve kullanıcı bilgileri
    } catch (error) {
        throw error;
    }
};

const saveToken = async (token) => {
    await AsyncStorage.setItem("token", token);
    console.log("💾 Token kaydedildi:", token);
};

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

export default function LoginScreen() {
    const [email, setEmail] = useState("bt.mudur@asyaport.com");
    const [password, setPassword] = useState("1234567890");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null); // Özel mesaj kutusu için state
    const router = useRouter();

    const fadeAnim = useState(new Animated.Value(0))[0];
    const slideAnim = useState(new Animated.Value(50))[0];
    const particleAnim = useRef(new Animated.Value(0)).current;

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
            }),
        ]).start();

        const animation = Animated.loop(
            Animated.timing(particleAnim, {
                toValue: 1,
                duration: 8000,
                useNativeDriver: true,
            })
        );
        animation.start();
        return () => animation.stop();
    }, []);

    const showMessage = (text, type = 'error') => {
        setMessage({ text, type });
        setTimeout(() => setMessage(null), 4000);
    };

    const handleLogin = async () => {
        if (!email || !password) {
            showMessage("Lütfen email ve şifre giriniz.", "warning");
            return;
        }

        console.log("🚀 Login işlemi başlıyor...");
        setLoading(true);

        try {
            const data = await loginUser(email, password);

            if (data && data.token) {
                await saveToken(data.token);
                showMessage("Giriş başarılı.", "success");
                router.replace("/home");
            } else if (data && data.error) {
                showMessage(data.error);
            } else {
                showMessage("Giriş başarısız. Lütfen bilgilerinizi kontrol edin.");
            }
        } catch (error) {
            console.log("🔥 Login hatası:", error);
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
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    messageBox: {
        borderRadius: 30,
        padding: 15,
        marginBottom: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
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
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 8,
        marginTop: 20,
    },
    loginButtonDisabled: {
        backgroundColor: '#444444',
        shadowOpacity: 0,
        elevation: 0,
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