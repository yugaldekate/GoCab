import React, { useState } from "react";
import * as Linking from "expo-linking";
import { Alert } from "react-native";
import { useLocationStore } from "@/store";
import { useAuth } from "@clerk/clerk-expo";
import CustomButton from "@/components/CustomButton";
import { useStripe } from "@stripe/stripe-react-native";

import { PaymentProps } from "@/types/type";
import { fetchAPI } from "@/lib/fetch";

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

const Payment = ( { fullName, email, amount, driverId, rideTime }: PaymentProps) => {

    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const { userAddress, userLongitude, userLatitude, destinationLatitude, destinationAddress, destinationLongitude } = useLocationStore();

    const { userId } = useAuth();
    const [success, setSuccess] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);

    const initializePaymentSheet = async () => {
        const { paymentIntent, ephemeralKey, customer } = await fetchPaymentSheetParams({fullName, email, amount});

        // Use Mock payment data: https://docs.stripe.com/payments/accept-a-payment?platform=react-native&ui=payment-sheet#react-native-test
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
            setLoading(true);
        }
    };

    const openPaymentSheet = async () => {
        await initializePaymentSheet();
    
        const { error } = await presentPaymentSheet();
    
        if (error) {
            Alert.alert(`Error code: ${error.code}`, error.message);
        } else {
            setSuccess(true);

            await fetchAPI("/(api)/ride/create", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
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

            Alert.alert("Success", "Your order is confirmed!");
        }
    };

    return (
        <>
            <CustomButton
                title="Confirm Ride"
                className="my-10"
                onPress={openPaymentSheet}
            />
        </>
    );
};

export default Payment;
