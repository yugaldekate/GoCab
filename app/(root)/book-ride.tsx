import React from "react";
import { useColorScheme } from "nativewind";
import { useUser } from "@clerk/clerk-expo";
import { Image, Text, View } from "react-native";
import { StripeProvider } from "@stripe/stripe-react-native";

import { icons } from "@/constants";
import { formatTime } from "@/lib/utils";

import Payment from "@/components/Payment";
import RideLayout from "@/components/RideLayout";

import { useDriverStore, useLocationStore } from "@/store";
import ExpoStripeProvider from "@/components/StripeProvider";

const BookRide = () => {

    const { user } = useUser();

    const { userAddress, destinationAddress } = useLocationStore();
    const { drivers, selectedDriver } = useDriverStore();

    const driverDetails = drivers?.filter((driver) => +driver.id === selectedDriver)[0];

    const { colorScheme } = useColorScheme();
    const isDarkMode = colorScheme === "dark";
        
    const textColor = isDarkMode ? "text-white" : "text-gray-800";
    const tintColor = isDarkMode ? "white" : "#171616";

    return (
        <ExpoStripeProvider>
            <RideLayout title="Book Ride">
                <>
                    <Text className={`text-xl font-JakartaSemiBold mb-3 ${textColor}`}>
                        Ride Information
                    </Text>

                    <View className="flex flex-col w-full items-center justify-center mt-10">
                        <Image
                            source={{ uri: driverDetails?.profile_image_url }}
                            className="w-28 h-28 rounded-full"
                        />

                        <View className="flex flex-row items-center justify-center mt-5 space-x-2">
                            <Text className={`text-lg font-JakartaSemiBold ${textColor}`}>
                                Type : {driverDetails?.title}
                            </Text>

                            <View className="flex flex-row items-center space-x-0.5">
                                <Image
                                    source={icons.star}
                                    className="w-5 h-5"
                                    resizeMode="contain"
                                />
                                <Text className={`text-lg font-JakartaSemiBold ${textColor}`}>
                                    {driverDetails?.rating}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View className="flex flex-col w-full items-start justify-center py-3 px-5 rounded-3xl bg-general-600 mt-5">
                        <View className="flex flex-row items-center justify-between w-full border-b border-white py-3">
                            <Text className="text-lg font-JakartaRegular">
                                Ride Price
                            </Text>
                            <Text className="text-lg font-JakartaRegular text-[#0CC25F]">
                                ${driverDetails?.price}
                            </Text>
                        </View>

                        <View className="flex flex-row items-center justify-between w-full border-b border-white py-3">
                            <Text className="text-lg font-JakartaRegular">
                                Pickup Time
                            </Text>
                            <Text className="text-lg font-JakartaRegular">
                                {formatTime(driverDetails?.time!)}
                            </Text>
                        </View>

                        <View className="flex flex-row items-center justify-between w-full py-3">
                            <Text className="text-lg font-JakartaRegular">
                                Car Seats
                            </Text>
                            <Text className="text-lg font-JakartaRegular">
                                {driverDetails?.car_seats}
                            </Text>
                        </View>
                    </View>

                    <View className="flex flex-col w-full items-start justify-center mt-5 mb-10">
                        <View className="flex flex-row items-center justify-start mt-3 border-t border-b border-general-700 w-full py-3">
                            <Image
                                source={icons.to} 
                                className="w-6 h-6"
                                tintColor={tintColor}
                            />
                            <Text className={`text-lg font-JakartaRegular ml-2 ${textColor}`}>
                                {userAddress}
                            </Text>
                        </View>

                        <View className="flex flex-row items-center justify-start border-b border-general-700 w-full py-3">
                            <Image 
                                source={icons.point} 
                                className="w-6 h-6" 
                                tintColor={tintColor} 
                            />
                            <Text className={`text-lg font-JakartaRegular ml-2 ${textColor}`}>
                                {destinationAddress}
                            </Text>
                        </View>
                    </View>

                    <Payment
                        fullName={user?.fullName!}
                        email={user?.emailAddresses[0].emailAddress!}
                        amount={driverDetails?.price!}
                        driverId={driverDetails?.id}
                        rideTime={driverDetails?.time!}
                    />
                </>
            </RideLayout>
        </ExpoStripeProvider>
    );
};

export default BookRide;
