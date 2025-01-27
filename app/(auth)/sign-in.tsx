import React, { useCallback, useState } from "react";
import { Link, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { Alert, Image, ScrollView, Text, View } from "react-native";

import { useSignIn } from "@clerk/clerk-expo";

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

    const { signIn, setActive, isLoaded } = useSignIn();

    const { colorScheme } = useColorScheme();
    const [form, setForm] = useState<FormState>({
        email: "",
        password: "",
    });

    // Handle the submission of the sign-in form
    const onSignInPress = useCallback(async () => {
        if (!isLoaded) return;

        // Start the sign-in process using the email and password provided
        try {
            const signInAttempt = await signIn.create({
                identifier: form.email,
                password: form.password,
            });

            // If sign-in process is complete, set the created session as active
            // and redirect the user
            if (signInAttempt.status === 'complete') {
                await setActive({ session: signInAttempt.createdSessionId });
                router.replace("/(root)/(tabs)/home");
            } else {
                // If the status isn't complete, check why. User might need to
                // complete further steps.
                console.error(JSON.stringify(signInAttempt, null, 2));
                Alert.alert("Error", "Log in failed. Please try again.");
            }
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2));
            Alert.alert("Error", err.errors[0].longMessage);
        }
    }, [isLoaded, form]);

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
                        keyboardType="email-address"
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
                        onPress={() => onSignInPress()} 
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
