import React, { useEffect, useState } from 'react';
import { useColorScheme } from 'nativewind';
import { ActivityIndicator, Text, View } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from "react-native-maps";

import { useDriverStore, useLocationStore } from '@/store';

import { icons } from '@/constants';
import { Driver, MarkerData } from '@/types/type';

import { fetchAPI, useFetch } from '@/lib/fetch';
import { calculateRegion, generateMarkersFromData } from '@/lib/map';

const Map = () => {

    const { colorScheme } = useColorScheme();
    const UIStyle = (colorScheme === "dark") ? "dark" : "light";

    const { userLatitude, userLongitude, destinationLatitude, destinationLongitude } = useLocationStore();
    const { selectedDriver, setDrivers } = useDriverStore();

    const region = calculateRegion({ userLatitude, userLongitude, destinationLatitude, destinationLongitude }); // default map region

    const { data: drivers, loading, error } = useFetch<Driver[]>("/(api)/driver");

    const [markers, setMarkers] = useState<MarkerData[]>([]); // available drivers
    const [routeCoordinates, setRouteCoordinates] = useState<any[]>([]);

    useEffect(() => {
        if (Array.isArray(drivers)) {
            if (!userLatitude || !userLongitude) return;
        
            const newMarkers = generateMarkersFromData({ data: drivers, userLatitude, userLongitude }); // mock driver locations
            setMarkers(newMarkers);
        }
    }, [drivers, userLatitude, userLongitude]);

    const fetchRoute = async () => {
        try {
            const response = await fetchAPI("/(api)/(drive)/route", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    sourceLatitude: userLatitude,
                    sourceLongitude: userLongitude,
                    destinationLatitude,
                    destinationLongitude,
                }),
            });

            return response?.coordinates || [];
        } catch (error) {
            console.error("Error fetching route:", error);
            return [];
        }
    };

    useEffect(() => {
        if (markers.length > 0 && destinationLatitude !== undefined && destinationLongitude !== undefined) {
            const getRoute = async () => {
                const coordinates = await fetchRoute();
                setRouteCoordinates(coordinates);
            };

            getRoute();
        }
    }, [markers, destinationLatitude, destinationLongitude]);

    const fetchTime = async() => {
        try {
            const response = await fetchAPI("/(api)/(drive)/time", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    markers, 
                    userLatitude, 
                    userLongitude, 
                    destinationLatitude, 
                    destinationLongitude 
                }),
            });
            
            return response;
        } catch (error) {
            console.error("Error fetching route:", error);
            return {};
        }
    }

    useEffect(() => {
        if (markers.length > 0 && destinationLatitude !== undefined && destinationLongitude !== undefined) {
            const getTime = async () => {
                const driversWithTime = await fetchTime();
                setDrivers(driversWithTime);                
            };

            getTime();
        }
    }, [ destinationLatitude, destinationLongitude]);

    if (loading || (!userLatitude && !userLongitude)) {
        return (
            <View className="flex justify-between items-center w-full">
                <ActivityIndicator size="small" color="#000" />
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex justify-between items-center w-full">
                <Text>Error: {error}</Text>
            </View>
        );
    }

    return (
        <MapView
            provider={PROVIDER_DEFAULT}
            className="w-full h-full rounded-2xl"
            tintColor="black"
            mapType='standard'
            initialRegion={region}
            showsPointsOfInterest={false}
            showsUserLocation={true}
            userInterfaceStyle={UIStyle}
        >
            {markers.map((marker) => (
                <Marker
                    key={marker.id}
                    title={marker.title}
                    image={selectedDriver === +marker.id ? icons.selectedMarker : icons.marker}
                    coordinate={{
                        latitude: marker.latitude,
                        longitude: marker.longitude,
                    }}
                />
            ))}

            {destinationLatitude && destinationLongitude && (
                <>
                    <Marker
                        key="destination"
                        title="Destination"
                        image={icons.pin}
                        coordinate={{
                            latitude: destinationLatitude,
                            longitude: destinationLongitude,
                        }}
                    />

                    {routeCoordinates.length > 0 && (
                        <Polyline coordinates={routeCoordinates} strokeWidth={3} strokeColor="#0286FF" />
                    )}
                </>
            )}
        </MapView>
    );
};

export default Map;
