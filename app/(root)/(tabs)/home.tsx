import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import * as Location from "expo-location";
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';

import { useUser } from '@clerk/clerk-expo';

import { icons, images } from '@/constants';

import Map from '@/components/Map';
import RideCard from '@/components/RideCard';
import GoogleTextInput from '@/components/GoogleTextInput';

import { useLocationStore } from '@/store';
import { useFetch } from '@/lib/fetch';
import { Ride } from '@/types/type';

const Home = () => {
    const { user } = useUser();

    const { setUserLocation, setDestinationLocation } = useLocationStore();
    const [hasPermissions, setHasPermissions] = useState(false);

    useEffect(() => {

        const requestLocation = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== "granted") {
                setHasPermissions(false);
                return;
            }
        
            let location = await Location.getCurrentPositionAsync({});
        
            const address = await Location.reverseGeocodeAsync({
                latitude: location.coords?.latitude!,
                longitude: location.coords?.longitude!,
            });
            
            setUserLocation({
                latitude: location.coords?.latitude,
                longitude: location.coords?.longitude,
                address: `${address[0].formattedAddress}`,
            });
        };

        requestLocation();

    }, []);

    const { data: recentRides, loading, error } = useFetch<Ride[]>(`/(api)/ride/${user?.id}`);

    const { colorScheme } = useColorScheme();
    const isDarkMode = colorScheme === "dark";

    const tintColor = isDarkMode ? "white" : "#171616";
    const textColor = isDarkMode ? "text-white" : "text-gray-800";
    const backgroundColor = isDarkMode ? "bg-gray-800" : "bg-gray-200";

    const handleDestinationPress = (location: { latitude: number, longitude: number, address: string }) => {
   
        setDestinationLocation(location);
    
        router.push("/(root)/find-ride");
    };

    return (
        <SafeAreaView className={`${isDarkMode ? "bg-black" : "bg-white"}`}>
            <StatusBar style={isDarkMode ? "light" : "dark"} />

            <FlatList
                data={recentRides?.slice(0, 5)}
                renderItem={ ({ item }) => <RideCard ride={item} /> }
                keyExtractor={(item, index) => index.toString()}
                className="px-5"
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{
                    paddingTop:10,
                    paddingBottom: 70,
                }}
                ListHeaderComponent={
                    <>
                        <View className="flex flex-row items-center justify-between my-5">
                            <View>
                                <Text className={`text-2xl font-JakartaExtraBold ${textColor}`}>
                                    Welcome  👋
                                </Text>
                                <Text className={`text-xl font-JakartaExtraBold ${textColor}`}>
                                    {user?.firstName || user?.emailAddresses[0].emailAddress.split("@")[0].replace(/\d+$/, '')}
                                </Text>
                            </View>

                            <TouchableOpacity
                                onPress={() => {}}
                                className={`flex flex-row justify-center items-center w-10 h-10 rounded-full ${backgroundColor}`}
                            >
                                <Image 
                                    tintColor={tintColor}
                                    source={icons.out} 
                                    className="w-4 h-4" 
                                />
                            </TouchableOpacity>
                        </View>

                        <GoogleTextInput
                            icon={icons.search}
                            containerStyle= {`${backgroundColor} shadow-md shadow-neutral-300`}
                            handlePress={(location) => handleDestinationPress(location)}
                        />

                        <>
                            <Text className={`text-xl font-JakartaBold mt-5 mb-3 ${textColor}`}>
                                Your current location
                            </Text>
                            <View className="flex flex-row items-center bg-transparent h-[300px]">
                                <Map/>
                            </View>
                        </>

                        <Text className={`text-xl font-JakartaBold mt-5 mb-3 ${textColor}`}>
                            Recent Rides
                        </Text>
                    </>
                }
                ListEmptyComponent={() => (
                    <View className="flex flex-col items-center justify-center">
                        { !loading ? (
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
                            <ActivityIndicator size="small" color={`${isDarkMode ? "#fff" : "#000"}`} />
                        )}
                    </View>
                )}
            />

        </SafeAreaView>
    )
}

export default Home;