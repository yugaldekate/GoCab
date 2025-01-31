import { Driver, MarkerData } from "@/types/type";

interface CalculateRegionProps {
    userLatitude: number | null, 
    userLongitude: number | null, 
    destinationLatitude?: number | null, 
    destinationLongitude?: number | null
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
   
    const minLat = Math.min(userLatitude, destinationLatitude);
    const maxLat = Math.max(userLatitude, destinationLatitude);

    const minLng = Math.min(userLongitude, destinationLongitude);
    const maxLng = Math.max(userLongitude, destinationLongitude);
  
    const latitudeDelta = (maxLat - minLat) * 1.3; // Adding some padding
    const longitudeDelta = (maxLng - minLng) * 1.3; // Adding some padding
  
    const latitude = (userLatitude + destinationLatitude) / 2;
    const longitude = (userLongitude + destinationLongitude) / 2;
  
    return { latitude, longitude, latitudeDelta, longitudeDelta };
};


interface GenerateMarkersFromDataProps { 
    data: Driver[], 
    userLatitude: number, 
    userLongitude: number 
}

export const generateMarkersFromData = ({ data, userLatitude, userLongitude }: GenerateMarkersFromDataProps): MarkerData[] => {
    
    return data.map((driver) => {

        const latOffset = (Math.random() - 0.5) * 0.01; // Random offset between -0.005 and 0.005
        const lngOffset = (Math.random() - 0.5) * 0.01; // Random offset between -0.005 and 0.005
    
        return {
            ...driver,
            latitude: userLatitude + latOffset,
            longitude: userLongitude + lngOffset,
            title: `${driver.first_name} ${driver.last_name}`,
        };
    });
};