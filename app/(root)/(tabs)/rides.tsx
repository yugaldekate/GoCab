import { useUser } from "@clerk/clerk-expo";
import { useColorScheme } from "nativewind";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";

import { Ride } from "@/types/type";
import { images } from "@/constants";
import { useFetch } from "@/lib/fetch";
import RideCard from "@/components/RideCard";
import { StatusBar } from "expo-status-bar";

const Rides = () => {
    const { user } = useUser();

    const { colorScheme } = useColorScheme();
    const isDarkMode = colorScheme === "dark";
    
    const textColor = isDarkMode ? "text-white" : "text-gray-800";

    const { data: recentRides, loading, error } = useFetch<Ride[]>(`/(api)/ride/${user?.id}`);

    return (
        <SafeAreaView className={`${isDarkMode ? "bg-black" : "bg-white"}`}>
            <StatusBar style={isDarkMode ? "light" : "dark"} />

            <FlatList
                data={recentRides}
                renderItem={({ item }) => <RideCard ride={item} />}
                keyExtractor={(item, index) => index.toString()}
                className="px-5"
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{
                    paddingBottom: 100,
                }}
                ListHeaderComponent={
                    <>
                        <Text className={`text-2xl my-5 font-JakartaExtraBold ${textColor}`}>
                            All Rides
                        </Text>
                    </>
                }
                ListEmptyComponent={() => (
                    <View className="flex flex-col items-center justify-center">
                        {!loading ? (
                        <>
                            <Image
                                source={images.noResult}
                                className="w-40 h-40"
                                alt="No recent rides found"
                                resizeMode="contain"
                            />
                            <Text className={`text-sm ${textColor}`}>
                                No recent rides found
                            </Text>
                        </>
                        ) : (
                            <ActivityIndicator size="large" color={`${isDarkMode ? "#fff" : "#000"}`} />
                        )}
                    </View>
                )}
            />
        </SafeAreaView>
    );
};

export default Rides;