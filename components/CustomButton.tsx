import { TouchableOpacity, Text } from "react-native";
import { useColorScheme } from "nativewind";

import { ButtonProps } from "@/types/type";

const getBgVariantStyle = (variant: ButtonProps["bgVariant"], isDarkMode: boolean) => {
    switch (variant) {
        case "secondary":
            return "bg-gray-500";
        case "danger":
            return "bg-red-500";
        case "success":
            return "bg-green-500";
        case "outline":
            return isDarkMode
                ? "bg-transparent border-gray-500 border-[0.5px]"
                : "bg-transparent border-neutral-300 border-[0.5px]";
        default:
            return "bg-[#0286FF]";
    }
};

const getTextVariantStyle = (variant: ButtonProps["textVariant"], isDarkMode: boolean) => {
    switch (variant) {
        case "primary":
            return isDarkMode ? "text-white" : "text-black";
        case "secondary":
            return "text-gray-100";
        case "danger":
            return "text-red-100";
        case "success":
            return "text-green-100";
        default:
            return "text-white";
    }
};

const CustomButton = ({ onPress, title, bgVariant = "primary", textVariant = "default", IconLeft, IconRight, className, ...props }: ButtonProps) => {
    const { colorScheme } = useColorScheme();
    const isDarkMode = colorScheme === "dark";

    return (
        <TouchableOpacity
            onPress={onPress}
            className={`w-full rounded-full p-3 flex flex-row justify-center items-center shadow-md ${isDarkMode ? "shadow-black/50" : "shadow-neutral-400/70"} ${getBgVariantStyle(bgVariant, isDarkMode)} ${className}`}
            {...props}
        >
            {IconLeft && <IconLeft />}

            <Text
                className={`text-lg font-bold ${getTextVariantStyle(
                    textVariant,
                    isDarkMode
                )}`}
            >
                {title}
            </Text>

            {IconRight && <IconRight />}
        </TouchableOpacity>
    );
};

export default CustomButton