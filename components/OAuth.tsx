import { useState } from "react";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import { Image, Text, View } from "react-native";
import ReactNativeModal from "react-native-modal";

import { icons, images } from "@/constants"; // Assuming images.check exists
import CustomButton from "./CustomButton";
import { useOAuth } from "@clerk/clerk-expo";
import { googleOAuth } from "@/lib/auth";

const OAuth = () => {
    const { colorScheme } = useColorScheme();
    const isDarkMode = colorScheme === "dark";
    const textColor = isDarkMode ? "text-white" : "text-black";

    const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

    const [modalVisible, setModalVisible] = useState(false);
    const [modalData, setModalData] = useState({ title: "", message: "", success: false });

    const handleGoogleSignIn = async () => {
        const result = await googleOAuth(startOAuthFlow);

        setModalData({
            title: result.success ? "Success" : "Error",
            message: result.success
                ? "You have successfully signed in with Google."
                : result.message,
            success: result.success,
        });

        setModalVisible(true);

        //if already signedIn
        if (result.code === "session_exists") {
            setTimeout(() => {
                setModalVisible(false);
                router.replace("/(root)/(tabs)/home");
            }, 2000);
        }
    };

    return (
        <View>
            <View className="flex flex-row justify-center items-center mt-4 gap-x-3">
                <View className={`flex-1 h-[1px] ${isDarkMode ? "bg-general-100" : "bg-general-800"}`} />
                <Text className={`text-lg ${textColor}`}>Or</Text>
                <View className={`flex-1 h-[1px] ${isDarkMode ? "bg-general-100" : "bg-general-800"}`} />
            </View>

            <CustomButton
                title="Log In with Google"
                className="mt-5 w-full shadow-none"
                IconLeft={() => (
                    <Image
                        source={icons.google}
                        resizeMode="contain"
                        className="w-5 h-5 mx-2"
                    />
                )}
                bgVariant="outline"
                textVariant="primary"
                onPress={() => handleGoogleSignIn()}
            />

            {/* Success/Error Modal */}
            <ReactNativeModal isVisible={modalVisible} onBackdropPress={() => setModalVisible(false)}>
                <View className="flex items-center justify-center bg-white p-7 rounded-2xl">
                    <Image source={modalData.success ? images.check : images.error} className="w-20 h-20 mt-5" />
                    <Text className="text-2xl text-center font-JakartaBold mt-5">
                        {modalData.title}
                    </Text>
                    <Text className="text-md text-general-200 font-JakartaRegular text-center mt-3">
                        {modalData.message}
                    </Text>
                    <CustomButton
                        title={modalData.success ? "Ok" : "SignIn"}
                        className="mt-5"
                        onPress={() => {
                            setModalVisible(false);
                            if (modalData.success) {
                                router.replace("/(root)/(tabs)/home")
                            } else {
                                router.replace("/(auth)/sign-in")
                            }
                        }}
                    />
                </View>
            </ReactNativeModal>
        </View>
    );
};

export default OAuth;
