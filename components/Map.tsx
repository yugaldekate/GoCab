import { useEffect, useState } from 'react';
import { useColorScheme } from 'nativewind';
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";

import { useDriverStore, useLocationStore } from '@/store';

import { icons } from '@/constants';
import { MarkerData } from '@/types/type';
import { calculateRegion, generateMarkersFromData } from '@/lib/map';

const drivers = [
    {
        "id": 1,
        "first_name": "James",
        "last_name": "Wilson",
        "profile_image_url": "https://ucarecdn.com/dae59f69-2c1f-48c3-a883-017bcf0f9950/-/preview/1000x666/",
        "car_image_url": "https://ucarecdn.com/a2dc52b2-8bf7-4e49-9a36-3ffb5229ed02/-/preview/465x466/",
        "car_seats": 4,
        "rating": 4.80,
        "latitude": 21.8694, // Slightly adjusted latitude
        "longitude": 84.3053, // Slightly adjusted longitude
        "title": "Sedan",
        "time": 5,
        "price": "150"
    },
    {
        "id": 2,
        "first_name": "David",
        "last_name": "Brown",
        "profile_image_url": "https://ucarecdn.com/6ea6d83d-ef1a-483f-9106-837a3a5b3f67/-/preview/1000x666/",
        "car_image_url": "https://ucarecdn.com/a3872f80-c094-409c-82f8-c9ff38429327/-/preview/930x932/",
        "car_seats": 5,
        "rating": 4.60,
        "latitude": 21.8760, // Slightly adjusted latitude
        "longitude": 84.3150, // Slightly adjusted longitude
        "title": "SUV",
        "time": 8,
        "price": "180"
    },
    {
        "id": 3,
        "first_name": "Michael",
        "last_name": "Johnson",
        "profile_image_url": "https://ucarecdn.com/0330d85c-232e-4c30-bd04-e5e4d0e3d688/-/preview/826x822/",
        "car_image_url": "https://ucarecdn.com/289764fb-55b6-4427-b1d1-f655987b4a14/-/preview/930x932/",
        "car_seats": 4,
        "rating": 4.70,
        "latitude": 21.8698, // Slightly adjusted latitude
        "longitude": 84.3080, // Slightly adjusted longitude
        "title": "Hatchback",
        "time": 3,
        "price": "120"
    },
    {
        "id": 4,
        "first_name": "Robert",
        "last_name": "Green",
        "profile_image_url": "https://ucarecdn.com/fdfc54df-9d24-40f7-b7d3-6f391561c0db/-/preview/626x417/",
        "car_image_url": "https://ucarecdn.com/b6fb3b55-7676-4ff3-8484-fb115e268d32/-/preview/930x932/",
        "car_seats": 4,
        "rating": 4.90,
        "latitude": 21.8775, // Slightly adjusted latitude
        "longitude": 84.3105, // Slightly adjusted longitude
        "title": "Luxury Sedan",
        "time": 6,
        "price": "200"
    },
    
];

const Map = () => {

    const { colorScheme } = useColorScheme();
    const UIStyle = (colorScheme === "dark") ? "dark" : "light";

    const { userLatitude, userLongitude, destinationLatitude, destinationLongitude } = useLocationStore();
    const { selectedDriver, setDrivers } = useDriverStore();

    const region = calculateRegion({ userLatitude, userLongitude, destinationLatitude, destinationLongitude }); //default map region

    const [markers, setMarkers] = useState<MarkerData[]>([]); // avaiable drivers

    useEffect(() => {

        setDrivers(drivers);

        if (Array.isArray(drivers)) {
            if (!userLatitude || !userLongitude) return;
        
            const newMarkers = generateMarkersFromData({ data: drivers, userLatitude, userLongitude }); //mock driver locations
        
            setMarkers(newMarkers);
        }
    }, []);

    useEffect(() => {
        if (Array.isArray(drivers)) {
            if (!userLatitude || !userLongitude) return;
        
            const newMarkers = generateMarkersFromData({ data: drivers, userLatitude, userLongitude }); //mock driver locations
        
            setMarkers(newMarkers);
        }
    }, [drivers, userLatitude, userLongitude]);

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
            {markers.map((marker, index) => (
                <Marker
                    key={marker.id}
                    title={marker.title}
                    image={ selectedDriver === +marker.id ? icons.selectedMarker : icons.marker }
                    coordinate={{
                        latitude: marker.latitude,
                        longitude: marker.longitude,
                    }}
                />
            ))}
        </MapView>
    )
}

export default Map