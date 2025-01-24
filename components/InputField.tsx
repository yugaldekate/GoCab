import { TextInput, View, Text, Image, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform } from "react-native";
  
import { useColorScheme } from "nativewind";
import { InputFieldProps } from "@/types/type";
  
const InputField = ({ label, icon, secureTextEntry = false, labelStyle, containerStyle, inputStyle, iconStyle, className, ...props }: InputFieldProps) => {
    const { colorScheme } = useColorScheme();
  
    // Define dynamic styles based on the theme
    const isDarkMode = colorScheme === "dark";
    const bgColor = isDarkMode ? "bg-neutral-800" : "bg-neutral-100";
    const borderColor = isDarkMode ? "border-neutral-700" : "border-neutral-100";
    const textColor = isDarkMode ? "text-white" : "text-black";
    const placeholderColor = isDarkMode ? "#A3A3A3" : "#6B7280";
  
    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View className="my-2 w-full">
                    {/* Label */}
                    <Text className={`text-lg font-JakartaSemiBold mb-3 ${textColor} ${labelStyle}`}>
                        {label}
                    </Text>
        
                    {/* Input Container */}
                    <View className={`flex flex-row justify-start items-center relative ${bgColor} rounded-full border ${borderColor} focus:border-primary-500 ${containerStyle}`} >
                        {/* Icon */}
                        {icon && <Image source={icon} className={`w-6 h-6 ml-4 ${iconStyle}`} />}
        
                        {/* Text Input */}
                        <TextInput
                            className={`rounded-full p-4 font-JakartaSemiBold text-[15px] flex-1 ${textColor} ${inputStyle}`}
                            secureTextEntry={secureTextEntry}
                            placeholderTextColor={placeholderColor}
                            {...props}
                        />
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};
  
export default InputField;
  