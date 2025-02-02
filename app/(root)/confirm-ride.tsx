import { router } from "expo-router";
import { FlatList, View } from "react-native";

import { useDriverStore } from "@/store";

import RideLayout from "@/components/RideLayout";
import DriverCard from "@/components/DriverCard";
import CustomButton from "@/components/CustomButton";


const ConfirmRide = () => {
    const { drivers, selectedDriver, setSelectedDriver } = useDriverStore();

    return (
        <RideLayout title={"Choose a Rider"}>
            <FlatList
                data={drivers}
                keyExtractor={(item, index) => index.toString()}
                scrollEnabled={true}
                nestedScrollEnabled={true}
                renderItem={({ item, index }) => (
                    <DriverCard
                        item={item}
                        selected={selectedDriver!}
                        setSelected={() => setSelectedDriver(Number(item.id)!)}
                    />
                )}
                ListFooterComponent={() => (
                    <View className="mx-5 mt-10 mb-10">
                        <CustomButton
                            title="Select Ride"
                            onPress={() => router.push("/(root)/book-ride")}
                        />
                    </View>
                )}
            />
        </RideLayout>
    );
};

export default ConfirmRide;
