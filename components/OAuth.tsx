import { useColorScheme } from "nativewind";
import { Image, Text, View } from "react-native";

import { icons } from "@/constants";
import CustomButton from "./CustomButton";

const OAuth = () => {

    const { colorScheme } = useColorScheme();

    const isDarkMode = colorScheme === "dark";
    const textColor = isDarkMode ? "text-white" : "text-black";

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
                onPress={() => {}}
            />
        </View>
    )
}

export default OAuth