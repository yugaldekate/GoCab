import { Driver, MarkerData } from "@/types/type";

interface CalculateRegionProps {
    userLatitude: number | null;
    userLongitude: number | null;
    destinationLatitude?: number | null;
    destinationLongitude?: number | null;
}

export const calculateRegion = ({ userLatitude, userLongitude, destinationLatitude, destinationLongitude }: CalculateRegionProps) => {
    if (!userLatitude || !userLongitude) {
        return {
            latitude: 19.0760,  // Default latitude for Mumbai, India
            longitude: 72.8777, // Default longitude for Mumbai, India
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        };
    }

    if (!destinationLatitude || !destinationLongitude) {
        return {
            latitude: userLatitude,
            longitude: userLongitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        };
    }

    const latitude = (userLatitude + destinationLatitude) / 2;
    const longitude = (userLongitude + destinationLongitude) / 2;

    const latitudeDelta = Math.abs(userLatitude - destinationLatitude) * 1.3;
    const longitudeDelta = Math.abs(userLongitude - destinationLongitude) * 1.3;

    return { latitude, longitude, latitudeDelta, longitudeDelta };
};

interface GenerateMarkersFromDataProps {
    data: Driver[];
    userLatitude: number;
    userLongitude: number;
}

export const generateMarkersFromData = ({ data, userLatitude, userLongitude }: GenerateMarkersFromDataProps): MarkerData[] => {
    return data.map((driver) => {
        const latOffset = (Math.random() - 0.5) * 0.01;
        const lngOffset = (Math.random() - 0.5) * 0.01;

        return {
            ...driver,
            latitude: userLatitude + latOffset,
            longitude: userLongitude + lngOffset,
            title: `${driver.first_name} ${driver.last_name}`,
        };
    });
};
