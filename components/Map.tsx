import { Text, View } from 'react-native';
import { useColorScheme } from 'nativewind';
import MapView, { PROVIDER_DEFAULT } from "react-native-maps";

const Map = () => {

    const { colorScheme } = useColorScheme();
    const UIStyle = (colorScheme === "dark") ? "dark" : "light"; 

    return (
        <MapView
            provider={PROVIDER_DEFAULT}
            className="w-full h-full rounded-2xl"
            tintColor="black"
            mapType='standard'
            showsPointsOfInterest={false}
            showsUserLocation={true}
            userInterfaceStyle={UIStyle}
        >
            
        </MapView>
    )
}

export default Map