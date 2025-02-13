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

    // Check if there's a selected driver and find their details
    const driverDetails = drivers?.find(driver => +driver.id === selectedDriver);

    const { colorScheme } = useColorScheme();
    const isDarkMode = colorScheme === "dark";

    const textColor = isDarkMode ? "text-white" : "text-gray-800";
    const tintColor = isDarkMode ? "white" : "#171616";

    return (
        <ExpoStripeProvider>
            <RideLayout title="Book Ride">
                <Text className={`text-xl font-JakartaSemiBold mb-3 ${textColor}`}>
                    Ride Information
                </Text>

                {driverDetails ? (
                    <>
                        <View className="flex flex-col w-full items-center justify-center mt-10">
                            <Image
                                source={{ uri: driverDetails?.profile_image_url }}
                                className="w-28 h-28 rounded-full"
                            />

                            <View className="flex items-center justify-center mt-5 space-x-2">
                                <Text className={`text-lg font-JakartaSemiBold ${textColor}`}>
                                    Driver's Name: {driverDetails?.title || "N/A"}
                                </Text>

                                <View className="flex flex-row items-center space-x-0.5">
                                    <Text className={`text-lg font-JakartaSemiBold ${textColor}`}>
                                        Rating:
                                    </Text>
                                    <Image
                                        source={icons.star}
                                        className="w-5 h-5"
                                        resizeMode="contain"
                                    />
                                    <Text className={`text-lg font-JakartaSemiBold ${textColor}`}>
                                        {driverDetails?.rating || "N/A"}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View className="flex flex-col w-full items-start justify-center py-3 px-5 rounded-3xl bg-general-600 mt-5">
                            <View className="flex flex-row items-center justify-between w-full border-b border-white py-3">
                                <Text className="text-lg font-JakartaRegular">Ride Price</Text>
                                <Text className="text-lg font-JakartaRegular text-[#0CC25F]">
                                    ${driverDetails?.price || "0"}
                                </Text>
                            </View>

                            <View className="flex flex-row items-center justify-between w-full border-b border-white py-3">
                                <Text className="text-lg font-JakartaRegular">Pickup Time</Text>
                                <Text className="text-lg font-JakartaRegular">
                                    {formatTime(driverDetails?.time!) || "N/A"}
                                </Text>
                            </View>

                            <View className="flex flex-row items-center justify-between w-full border-b border-white py-3">
                                <Text className="text-lg font-JakartaRegular">Distance</Text>
                                <Text className="text-lg font-JakartaRegular">
                                    {(driverDetails?.distance ? (driverDetails?.distance / 1000).toFixed(2) : "0")} km
                                </Text>
                            </View>

                            <View className="flex flex-row items-center justify-between w-full py-3">
                                <Text className="text-lg font-JakartaRegular">Car Seats</Text>
                                <Text className="text-lg font-JakartaRegular">
                                    {driverDetails?.car_seats || "N/A"}
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
                                    {userAddress || "N/A"}
                                </Text>
                            </View>

                            <View className="flex flex-row items-center justify-start border-b border-general-700 w-full py-3">
                                <Image
                                    source={icons.point}
                                    className="w-6 h-6"
                                    tintColor={tintColor}
                                />
                                <Text className={`text-lg font-JakartaRegular ml-2 ${textColor}`}>
                                    {destinationAddress || "N/A"}
                                </Text>
                            </View>
                        </View>

                        <Payment
                            fullName={user?.fullName || "N/A"}
                            email={user?.emailAddresses[0]?.emailAddress || "N/A"}
                            amount={driverDetails?.price || '0'}
                            driverId={driverDetails?.id}
                            rideTime={driverDetails?.time || 0}
                        />
                    </>
                ) : (
                    <Text className={`text-lg ${textColor}`}>No driver selected</Text>
                )}
            </RideLayout>
        </ExpoStripeProvider>
    );
};

export default BookRide;
