import { Tabs } from "expo-router";
import { Image, ImageSourcePropType, View, useColorScheme } from "react-native";

import { icons } from "@/constants";

const TabIcon = ({ imageSource, focused }: { imageSource: ImageSourcePropType; focused: boolean }) => (
    <View className="flex flex-row absolute bottom-1 items-center justify-center">
        {focused ? (
            <View className="w-12 h-12 rounded-full bg-general-400 items-center justify-center shadow-lg">
                <Image
                    source={imageSource}
                    tintColor="white"
                    resizeMode="contain"
                    className="w-6 h-6"
                />
            </View>
        ) : (
            <View className="w-12 h-12 rounded-full items-center justify-center shadow-lg">
                <Image
                    source={imageSource}
                    tintColor="#B0B0B0"
                    resizeMode="contain"
                    className="w-6 h-6"
                />
            </View>
        )}
    </View>
);

export default function Layout() {
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === "dark";

    return (
        <Tabs
            initialRouteName="home"
            screenOptions={{
                tabBarActiveTintColor: "white",
                tabBarInactiveTintColor: "white",
                tabBarShowLabel: false,
                tabBarStyle: {
                    backgroundColor: "#171616", // Adjust for dark/light mode
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    overflow: "hidden",
                    borderRadius: 50,
                    paddingBottom: 0, // iOS only
                    marginHorizontal: 20,
                    marginBottom: 5,
                    height: 65,
                    position: "absolute",
                    borderTopWidth: 0,
                    elevation: 5,
                    shadowColor: "#000",
                    shadowOpacity: 0.1,
                    shadowRadius: 5,
                    shadowOffset: { width: 0, height: 5 },
                },
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: "Home",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => <TabIcon imageSource={icons.home} focused={focused} />,
                }}
            />
            <Tabs.Screen
                name="rides"
                options={{
                    title: "Rides",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => <TabIcon imageSource={icons.list} focused={focused} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => <TabIcon imageSource={icons.profile} focused={focused} />,
                }}
            />
        </Tabs>
    );
}
