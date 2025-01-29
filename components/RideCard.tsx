import { Image, Text, View } from "react-native";
import { useColorScheme } from "nativewind";

import { icons } from "@/constants";

import { Ride } from "@/types/type";
import { formatDate, formatTime } from "@/lib/utils";

const RideCard = ({ ride }: { ride: Ride }) => {
    const { colorScheme } = useColorScheme();
    const isDarkMode = colorScheme === "dark";

    // Define styles for dark and light modes
    const backgroundColor = isDarkMode ? "bg-gray-800" : "bg-white";
    const textColor = isDarkMode ? "text-white" : "text-gray-800";
    const secondaryTextColor = isDarkMode ? "text-gray-400" : "text-gray-500";
    const cardBackgroundColor = isDarkMode ? "bg-gray-700" : "bg-general-500";
    const tintColor = isDarkMode ? "white" : "#B0B0B0";
    const border = isDarkMode ? "" : "border border-gray-300";

    return (
        <View className={`flex flex-row items-center justify-center ${border} ${backgroundColor} rounded-lg shadow-sm shadow-neutral-300 mb-3`}>
            <View className="flex flex-col items-start justify-center p-3">
                <View className="flex flex-row items-center justify-between">
                    <Image
                        source={{
                            uri: `https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=600&height=400&center=lonlat:${ride.destination_longitude},${ride.destination_latitude}&zoom=14&apiKey=${process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY}`,
                        }}
                        className="w-[80px] h-[90px] rounded-lg"
                    />

                    <View className="flex flex-col mx-5 gap-y-5 flex-1">
                        <View className="flex flex-row items-center gap-x-2">
                            <Image 
                                tintColor={tintColor}
                                source={icons.to} 
                                className="w-5 h-5" 
                            />
                            <Text className={`text-md font-JakartaMedium ${textColor}`} numberOfLines={1}>
                                {ride.origin_address}
                            </Text>
                        </View>

                        <View className="flex flex-row items-center gap-x-2">
                            <Image 
                                source={icons.point} 
                                className="w-5 h-5"
                                tintColor={tintColor}
                            />
                            <Text className={`text-md font-JakartaMedium ${textColor}`} numberOfLines={1}>
                                {ride.destination_address}
                            </Text>
                        </View>
                    </View>
                </View>

                <View className={`flex flex-col w-full mt-5 ${cardBackgroundColor} rounded-lg p-3 items-start justify-center`}>
                    <View className="flex flex-row items-center w-full justify-between mb-5">
                        <Text className={`text-md font-JakartaMedium ${secondaryTextColor}`}>
                            Date & Time
                        </Text>
                        <Text className={`text-md font-JakartaBold ${textColor}`} numberOfLines={1}>
                            {formatDate(ride.created_at)}, {formatTime(ride.ride_time)}
                        </Text>
                    </View>

                    <View className="flex flex-row items-center w-full justify-between mb-5">
                        <Text className={`text-md font-JakartaMedium ${secondaryTextColor}`}>
                            Driver
                        </Text>
                        <Text className={`text-md font-JakartaBold ${textColor}`}>
                            {ride.driver.first_name} {ride.driver.last_name}
                        </Text>
                    </View>

                    <View className="flex flex-row items-center w-full justify-between mb-5">
                        <Text className={`text-md font-JakartaMedium ${secondaryTextColor}`}>
                            Car Seats
                        </Text>
                        <Text className={`text-md font-JakartaBold ${textColor}`}>
                            {ride.driver.car_seats}
                        </Text>
                    </View>

                    <View className="flex flex-row items-center w-full justify-between">
                        <Text className={`text-md font-JakartaMedium ${secondaryTextColor}`}>
                            Payment Status
                        </Text>
                        <Text
                            className={`text-md capitalize font-JakartaBold ${ride.payment_status === "paid" ? "text-green-500" : "text-red-500"}`}
                        >
                            {ride.payment_status}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default RideCard;
