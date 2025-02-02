import { router } from "expo-router";
import { Text, View } from "react-native";
import { useColorScheme } from "nativewind";

import { icons } from "@/constants";
import { useLocationStore } from "@/store";

import RideLayout from "@/components/RideLayout";
import CustomButton from "@/components/CustomButton";
import GoogleTextInput from "@/components/GoogleTextInput";

const FindRide = () => {
    const { userAddress, destinationAddress, setDestinationLocation, setUserLocation } = useLocationStore();

    const { colorScheme } = useColorScheme();
    const isDarkMode = colorScheme === "dark";
        
    const tintColor = isDarkMode ? "white" : "#171616";
    const textColor = isDarkMode ? "text-white" : "text-gray-800";
    const backgroundColor = isDarkMode ? "bg-gray-800" : "bg-gray-200";

    return (
        <RideLayout title="Ride">
            <View className="my-3">
                <Text className={`text-lg font-JakartaSemiBold mb-3 ${textColor}`}>From</Text>

                <GoogleTextInput
                    icon={icons.target}
                    initialLocation={userAddress!}
                    containerStyle={backgroundColor}
                    handlePress={(location) => setUserLocation(location)}
                />
            </View>

            <View className="my-3">
                <Text className={`text-lg font-JakartaSemiBold mb-3 ${textColor}`}>To</Text>

                <GoogleTextInput
                    icon={icons.map}
                    initialLocation={destinationAddress!}
                    containerStyle={backgroundColor}
                    handlePress={(location) => setDestinationLocation(location)}
                />
            </View>

            <CustomButton
                title="Find Now"
                onPress={() => router.push(`/(root)/confirm-ride`)}
                className="mt-5"
            />
        </RideLayout>
    );
};

export default FindRide;