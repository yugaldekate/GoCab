import { useRef } from "react";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import { Image, Text, TouchableOpacity, View } from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetScrollView, BottomSheetView } from "@gorhom/bottom-sheet";

import Map from "./Map";
import { icons } from "@/constants";
import { StatusBar } from "expo-status-bar";

interface RideLayoutProps {
    title: string,
    snapPoints?: string[],
    children: React.ReactNode
}

const RideLayout = ({ title, snapPoints, children }: RideLayoutProps) => {

    const { colorScheme } = useColorScheme();
    const isDarkMode = colorScheme === "dark";
    
    const tintColor = isDarkMode ? "white" : "#171616";
    const backgroundColor = isDarkMode ? "bg-gray-800" : "bg-gray-200";

    const bottomSheetRef = useRef<BottomSheet>(null);

    return (
        <GestureHandlerRootView className="flex-1">
            <StatusBar style={isDarkMode ? "dark" : "light"} />

            <View className={`flex-1 ${isDarkMode ? "bg-black" : "bg-white"}`}>
                <View className="flex flex-col h-screen bg-blue-500">
                    
                    <View className="flex flex-row absolute z-10 top-16 items-center justify-start px-5">
                        <TouchableOpacity onPress={() => router.back()}>
                            <View className={`w-10 h-10 rounded-full items-center justify-center ${backgroundColor}`}>
                                <Image
                                    source={icons.backArrow}
                                    resizeMode="contain"
                                    className="w-6 h-6"
                                    tintColor={tintColor}
                                />
                            </View>
                        </TouchableOpacity>

                        <Text className="text-xl font-JakartaSemiBold ml-5">
                            {title || "Go Back"}
                        </Text>
                    </View>

                    <Map />
                </View>

                <BottomSheet
                    ref={bottomSheetRef}
                    snapPoints={snapPoints || ["50%", "85%"]}
                    index={0}
                    backgroundStyle={{backgroundColor: isDarkMode ? "#000" : "#fff"}}
                    handleIndicatorStyle={{backgroundColor: isDarkMode ? "#fff" : "#000"}}
                >
                    {title === "Choose a Rider" ? (
                        <BottomSheetView style={{ flex: 1, padding: 20 }}>
                            {children}
                        </BottomSheetView>
                    ) : (
                        <BottomSheetScrollView style={{ flex: 1, padding: 20 }}>
                            {children}
                        </BottomSheetScrollView>
                    )}
                </BottomSheet>
            </View>
        </GestureHandlerRootView>        
    )
}

export default RideLayout;
