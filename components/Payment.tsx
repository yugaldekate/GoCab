import React, { useState } from "react";
import { router } from "expo-router";
import * as Linking from "expo-linking";
import ReactNativeModal from "react-native-modal";
import { Alert, Image, Text, View, ActivityIndicator } from "react-native";

import { useAuth } from "@clerk/clerk-expo";
import CustomButton from "@/components/CustomButton";
import { useStripe } from "@stripe/stripe-react-native";

import { fetchAPI } from "@/lib/fetch";
import { PaymentProps } from "@/types/type";
import { useLocationStore } from "@/store";

import { images } from "@/constants";

async function fetchPaymentSheetParams({fullName, email, amount}: {fullName: string, email: string, amount: string}): Promise<{ paymentIntent: string, ephemeralKey: string, customer: string }> {
    return fetch(`/(api)/(stripe)/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: fullName || email.split("@")[0],
            email: email,
            amount: amount,
        })
    }).then((res) => res.json());
}

const Payment = ({ fullName, email, amount, driverId, rideTime }: PaymentProps) => {
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const { userAddress, userLongitude, userLatitude, destinationLatitude, destinationAddress, destinationLongitude } = useLocationStore();
    const { userId } = useAuth();
    
    const [success, setSuccess] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const initializePaymentSheet = async () => {
        setLoading(true);

        const { paymentIntent, ephemeralKey, customer } = await fetchPaymentSheetParams({ fullName, email, amount });

        const { error } = await initPaymentSheet({
            merchantDisplayName: "GoCab, Inc.",
            customerId: customer,
            customerEphemeralKeySecret: ephemeralKey,
            paymentIntentClientSecret: paymentIntent,
            allowsDelayedPaymentMethods: true,
            defaultBillingDetails: {
                name: fullName || email.split("@")[0],
                email: email,
                phone: "888-888-8888",
            },
            returnURL: Linking.createURL("stripe-redirect"),
            applePay: {
                merchantCountryCode: "US",
            },
        });

        if (!error) {
            setLoading(false);
        }
    };

    const openPaymentSheet = async () => {
        setLoading(true);
        await initializePaymentSheet();

        const { error } = await presentPaymentSheet();

        if (error) {
            setErrorMessage(`Error code: ${error.code}\n${error.message}`);
        } else {
            setSuccess(true);

            await fetchAPI("/(api)/ride/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    origin_address: userAddress,
                    destination_address: destinationAddress,
                    origin_latitude: userLatitude,
                    origin_longitude: userLongitude,
                    destination_latitude: destinationLatitude,
                    destination_longitude: destinationLongitude,
                    ride_time: rideTime.toFixed(0),
                    fare_price: Math.round(parseFloat(amount) * 100),
                    payment_status: "paid",
                    driver_id: driverId,
                    user_id: userId,
                }),
            });
        }
        setLoading(false);
    };

    return (
        <>
            <CustomButton 
                title="Confirm Ride" 
                className="my-10" 
                onPress={openPaymentSheet} 
            />

            {/* Loading Overlay */}
            <ReactNativeModal isVisible={loading} backdropOpacity={0.5}>
                <View className="flex items-center justify-center bg-white p-6 rounded-2xl">
                    <ActivityIndicator size="large" color="#3498db" />
                    <Text className="mt-3 text-lg font-JakartaBold">
                        Processing Payment...
                    </Text>
                </View>
            </ReactNativeModal>

            {/* Error Modal */}
            <ReactNativeModal
                isVisible={!!errorMessage}
                onBackdropPress={() => setErrorMessage(null)}
            >
                <View className="flex flex-col items-center justify-center bg-white p-7 rounded-2xl">
                    <Image source={images.error} className="w-28 h-28 mt-5" />

                    <Text className="text-xl font-JakartaBold mt-5 text-red-600">
                        Payment Failed
                    </Text>

                    <Text className="text-md text-general-200 font-JakartaRegular text-center mt-3">
                        {errorMessage}
                    </Text>

                    <CustomButton
                        title="Try Again"
                        onPress={() => setErrorMessage(null)}
                        className="mt-5"
                    />
                </View>
            </ReactNativeModal>

            {/* Success Modal */}
            <ReactNativeModal isVisible={success} onBackdropPress={() => setSuccess(false)}>
                <View className="flex items-center justify-center bg-white p-7 rounded-2xl">
                    <Image source={images.check} className="w-28 h-28 mt-5" />
                    <Text className="text-2xl text-center font-JakartaBold mt-5">
                        Booking placed successfully
                    </Text>
                    <Text className="text-md text-general-200 font-JakartaRegular text-center mt-3">
                        Thank you for your booking. Your reservation has been successfully placed. Please proceed with your trip.
                    </Text>
                    <CustomButton title="Back Home" 
                        className="mt-5" 
                        onPress={() => { 
                            setSuccess(false)
                            router.push("/(root)/(tabs)/home") 
                        }} 
                    />
                </View>
            </ReactNativeModal>
        </>
    );
};

export default Payment;
