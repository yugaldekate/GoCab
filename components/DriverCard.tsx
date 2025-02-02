import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

import { icons } from "@/constants";
import { formatTime } from "@/lib/utils";
import { DriverCardProps } from "@/types/type";
import { useColorScheme } from "nativewind";

const DriverCard = ({ item, selected, setSelected }: DriverCardProps) => {

    const { colorScheme } = useColorScheme();
    const isDarkMode = colorScheme === "dark";
    
    const textColor = isDarkMode ? "text-white" : "text-gray-800";
    const selectedTextColor = selected === item.id ? "text-black" : textColor;
    const backgroundColor = isDarkMode ? "bg-gray-800" : "bg-gray-200";

    return (
        <TouchableOpacity
            onPress={setSelected}
            className={`${
                selected === item.id ? "bg-general-700" : `${backgroundColor}`
            } ${ !isDarkMode && selected === item.id ? "border border-gray-700" : ""} flex flex-row items-center justify-between py-5 px-3 rounded-xl mb-2`}
        >
            <Image
                source={{ uri: item.profile_image_url }}
                className="w-14 h-14 rounded-full"
            />

            <View className="flex-1 flex flex-col items-start justify-center mx-3">
                <View className="flex flex-row items-center justify-start mb-1">
                    <Text className={`text-lg font-JakartaRegular ${selectedTextColor}`}>
                        {item.title}
                    </Text>

                    <View className="flex flex-row items-center space-x-1 ml-2">
                        <Image source={icons.star} className="w-3.5 h-3.5" />
                        <Text className={`text-sm font-JakartaRegular ${selectedTextColor}`}>
                            {item.rating}
                        </Text>
                    </View>
                </View>

                <View className="flex flex-row items-center justify-start">
                    <View className="flex flex-row items-center">
                        <Image source={icons.dollar} className="w-4 h-4" />
                        <Text className={`text-sm font-JakartaRegular ml-1 ${selectedTextColor}`}>
                            ${item.price}
                        </Text>
                    </View>

                    <Text className="text-sm font-JakartaRegular text-general-800 mx-1">
                        |
                    </Text>

                    <Text className="text-sm font-JakartaRegular text-general-800">
                        {formatTime(item.time!)}
                    </Text>

                    <Text className="text-sm font-JakartaRegular text-general-800 mx-1">
                        |
                    </Text>

                    <Text className="text-sm font-JakartaRegular text-general-800">
                        {item.car_seats} seats
                    </Text>
                </View>
            </View>

            <Image
                source={{ uri: item.car_image_url }}
                className="h-14 w-14"
                resizeMode="contain"
            />
        </TouchableOpacity>
    );
};

export default DriverCard;
