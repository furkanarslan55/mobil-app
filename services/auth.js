import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveToken = async (token) => {
  try {
    await AsyncStorage.setItem("authToken", token);
  } catch (error) {
    console.log("Token kaydedilemedi", error);
  }
};

export const getToken = async () => {
  try {
    return await AsyncStorage.getItem("authToken");
  } catch (error) {
    console.log("Token alınamadı", error);
    return null;
  }
};
