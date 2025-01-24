import React, { useState } from "react";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { Image, ScrollView, Text, View } from "react-native";

import { icons, images } from "@/constants";

import OAuth from "@/components/OAuth";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";


// Define the type for the form state
interface FormState {
    email: string;
    password: string;
}

const SignIn = () => {
    const { colorScheme } = useColorScheme();
    const [form, setForm] = useState<FormState>({
        email: "",
        password: "",
    });

    return (
        <>
            {/* StatusBar adjusts dynamically based on the theme */}
            <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

            <ScrollView className={`flex-1 ${colorScheme === "dark" ? "bg-black" : "bg-white"}`}>
                {/* Header Section */}
                <View className="relative w-full h-[250px]">
                    {colorScheme === "dark" ? (
                        <Image source={images.signUpCarDark} className="z-0 w-full h-[250px]" />
                    ) : (
                        <Image source={images.signUpCar} className="z-0 w-full h-[250px]" />
                    )}

                    <Text className={`text-2xl font-JakartaSemiBold absolute bottom-5 left-5 ${colorScheme === "dark" ? "text-white" : "text-black"}`}>
                        Welcome 👋
                    </Text>
                </View>

                {/* Form Section */}
                <View className="p-5">

                    <InputField
                        label="Email"
                        placeholder="Enter email"
                        icon={icons.email}
                        textContentType="emailAddress"
                        value={form.email}
                        onChangeText={(value: string) => setForm({ ...form, email: value })}
                    />
                    <InputField
                        label="Password"
                        placeholder="Enter password"
                        icon={icons.lock}
                        secureTextEntry={true}
                        textContentType="password"
                        value={form.password}
                        onChangeText={(value: string) => setForm({ ...form, password: value })}
                    />

                    <CustomButton 
                        title="Sign In" 
                        onPress={() => {}} 
                        className="mt-6" 
                    />

                    {/* Clerk Authentication */}
                    <OAuth/>

                    <Link href="/sign-up" className="text-lg text-center text-general-200 mt-10">
                        Dont't have an account?{" "}
                        <Text className="text-primary-500">Sign Up</Text>
                    </Link>
                </View>
            </ScrollView>
        </>
    );
};

export default SignIn;
