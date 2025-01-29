import { Text, View } from "react-native";
import { useColorScheme } from "nativewind";

import { GoogleInputProps } from "@/types/type";

const GoogleTextInput = ({icon, containerStyle, initialLocation ,textInputBackgroundColor, handlePress} : GoogleInputProps) => {

    const { colorScheme } = useColorScheme();
    const isDarkMode = colorScheme === "dark";
    
    const textColor = isDarkMode ? "text-white" : "text-gray-800";

    return (
        <View className={`flex flex-row items-center justify-center relative z-50 rounded-xl ${containerStyle}`}>
            <Text className={`${textColor}`}>
                Search
            </Text>
        </View>
    )
}

export default GoogleTextInput