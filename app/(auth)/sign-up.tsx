import React, { useState } from "react";

import { Link, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { ReactNativeModal } from "react-native-modal";
import { Alert, Image, ScrollView, Text, View } from "react-native";

import { useSignUp } from "@clerk/clerk-expo";

import { icons, images } from "@/constants";

import OAuth from "@/components/OAuth";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";

import { fetchAPI } from "@/lib/fetch";

// Define the type for the form state
interface FormState {
    name: string;
    email: string;
    password: string;
}

const SignUp = () => {

    const { isLoaded, signUp, setActive } = useSignUp();
    
    const { colorScheme } = useColorScheme();

    const [form, setForm] = useState<FormState>({
        name: "",
        email: "",
        password: "",
    });

    const [verification, setVerification] = useState({
        state: "default",
        error: "",
        code: "",
    });

    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Handle submission of sign-up form
    const onSignUpPress = async () => {
        if (!isLoaded) return;

        // Start sign-up process using email and password provided
        try {
            await signUp.create({
                emailAddress: form.email,
                password: form.password,
            });

            // Send user an email with verification code
            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

            // Set 'verification' to true to display verify OTP modal and capture OTP code
            setVerification({...verification, state: "pending"});
        } catch (err: any) {
            Alert.alert("Error", err.errors[0].longMessage);
            console.error(JSON.stringify(err, null, 2));
        }
    }

    // Handle submission of verification form
    const onVerifyPress = async () => {
        if (!isLoaded) return;

        try {
            // Use the code the user provided to attempt verification
            const signUpAttempt = await signUp.attemptEmailAddressVerification({code: verification.code });

            // If verification was completed, set the session to active
            // and redirect the user
            if (signUpAttempt.status === 'complete') {               
                
                // Create User in DB
                await fetchAPI("/(api)/user", {
                    method: "POST",
                    body: JSON.stringify({
                        name: form.name,
                        email: form.email,
                        clerkId: signUpAttempt.createdUserId,
                    }),
                });

                await setActive({ session: signUpAttempt.createdSessionId });
                setVerification({ ...verification, state: "success" });
            } else {
                // If the status is not complete, check why. User may need to
                // complete further steps.
                setVerification({ ...verification, error: "Verification failed" , state: "failed" });
                console.error(JSON.stringify(signUpAttempt, null, 2));
            }
        } catch (err: any) {
            setVerification({  ...verification,  error: err.errors[0].longMessage, state: "failed" });
            Alert.alert("Error", err.errors[0].longMessage);
            console.error(JSON.stringify(err, null, 2));
        }
    }

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
                        Create Your Account
                    </Text>
                </View>

                {/* Form Section */}
                <View className="p-5">
                    <InputField
                        label="Name"
                        placeholder="Enter name"
                        icon={icons.person}
                        value={form.name}
                        onChangeText={(value: string) => setForm({ ...form, name: value })}
                    />
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

                    <View id="clerk-captcha"></View>

                    <CustomButton 
                        title="Sign Up" 
                        onPress={() => onSignUpPress()} 
                        className="mt-6" 
                    />

                    {/* Clerk Authentication */}
                    <OAuth/>

                    <Link href="/sign-in" className="text-lg text-center text-general-200 mt-10">
                        Already have an account?{" "}
                        <Text className="text-primary-500">Log In</Text>
                    </Link>

                    {/* Show this modal when email verification is pending */}
                    <ReactNativeModal
                        isVisible={verification.state === "pending"}
                        onModalHide={() => {
                            if (verification.state === "success") {
                                setShowSuccessModal(true);
                            }
                        }}
                        /*
                            onBackdropPress={() =>
                                setVerification({ ...verification, state: "default" })
                            } 
                        */
                    >
                        <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
                            <Text className="font-JakartaExtraBold text-2xl mb-2">
                                Verification
                            </Text>
                            <Text className="font-Jakarta mb-5">
                                We've sent a verification code to {form.email}.
                            </Text>
                            <InputField
                                label={"Code"}
                                icon={icons.lock}
                                placeholder={"12345"}
                                value={verification.code}
                                keyboardType="numeric"
                                onChangeText={(verificationCode) =>
                                    setVerification({ ...verification, code: verificationCode })
                                }
                            />
                            {verification.error && (
                                <Text className="text-red-500 text-sm mt-1">
                                    {verification.error}
                                </Text>
                            )}
                            <CustomButton
                                title="Verify Email"
                                onPress={onVerifyPress}
                                className="mt-5 bg-success-500"
                            />
                        </View>
                    </ReactNativeModal>


                    {/* Show modal if email verified */}
                    <ReactNativeModal isVisible={showSuccessModal} >
                        <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
                            <Image
                                source={images.check}
                                className="w-[110px] h-[110px] mx-auto my-5"
                            />
                            <Text className="text-3xl font-JakartaBold text-center">
                                Verified
                            </Text>
                            <Text className="text-base text-gray-400 font-Jakarta text-center mt-2">
                                You have successfully verified your account.
                            </Text>
                            <CustomButton
                                title="Browse Home"
                                onPress={() => {
                                        router.push(`/(root)/(tabs)/home`);
                                        setShowSuccessModal(false);
                                    }
                                }
                                className="mt-5"
                            />
                        </View>
                    </ReactNativeModal>

                </View>
            </ScrollView>
        </>
    );
};

export default SignUp;
