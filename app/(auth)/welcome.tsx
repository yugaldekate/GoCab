import { router } from "expo-router";
import { useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { Image, Text, TouchableOpacity, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import Swiper from "react-native-swiper";

import { onboarding } from "@/constants";
import CustomButton from "@/components/CustomButton";

const Welcome = () => {
    const { colorScheme } = useColorScheme();
    const isDarkMode = colorScheme === "dark";

    const swiperRef = useRef<Swiper>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const isLastSlide = activeIndex === onboarding.length - 1;

    return (
        <SafeAreaView className={`flex h-full justify-between items-center ${isDarkMode ? "bg-black" : "bg-white"}`}>
            <StatusBar style={isDarkMode ? "light" : "dark"} />

            {/* Skip Button */}
            <TouchableOpacity onPress={() => router.replace("/(auth)/sign-up")} className="flex justify-end items-end w-full p-5">
                <Text className={`text-base font-JakartaBold ${ isDarkMode ? "text-white" : "text-black" }`}>
                    Skip
                </Text>
            </TouchableOpacity>

            {/* Swiper */}
            <Swiper
                ref={swiperRef}
                loop={false}
                dot={<View className={`w-[32px] h-[4px] mx-1 rounded-full ${ isDarkMode ? "bg-gray-600" : "bg-[#E2E8F0]" }`} />}
                activeDot={<View className={`w-[32px] h-[4px] mx-1 rounded-full ${ isDarkMode ? "bg-blue-400" : "bg-[#0286FF]" }`} /> }
                onIndexChanged={(index) => setActiveIndex(index)}
            >
                {onboarding.map((item) => (
                    <View key={item.id} className="flex items-center justify-center p-5">
                        <Image
                            source={item.image}
                            className="w-full h-[300px]"
                            resizeMode="contain"
                        />
                        <View className="flex flex-row items-center justify-center w-full mt-10">
                            <Text className={`text-3xl font-bold mx-10 text-center ${ isDarkMode ? "text-white" : "text-black" }`}>
                                {item.title}
                            </Text>
                        </View>
                        <Text className={`text-md font-JakartaSemiBold text-center mx-10 mt-3 ${ isDarkMode ? "text-gray-400" : "text-[#858585]" }`} >
                            {item.description}
                        </Text>
                    </View>
                ))}
            </Swiper>

            {/* Button */}
            <CustomButton
                title={isLastSlide ? "Get Started" : "Next"}
                onPress={() =>
                    isLastSlide
                        ? router.replace("/(auth)/sign-up")
                        : swiperRef.current?.scrollBy(1)
                }
                className="w-11/12 mt-10 mb-5"
            />
        </SafeAreaView>
    );
};

export default Welcome;