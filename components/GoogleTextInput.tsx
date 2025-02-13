import { Image, Text, View, TextInput, FlatList, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { useColorScheme } from "nativewind";
import { useState } from "react";

import { GoogleInputProps } from "@/types/type";
import { icons } from "@/constants";
import { useRoute } from "@react-navigation/native";

const GEOAPIFY_API_KEY = process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY;

interface GeoapifyPlace {
    geometry: {
        coordinates: [number, number];
    };
    properties: {
        formatted: string;
        place_id: string;
    };
}

const GoogleTextInput = ({ icon, containerStyle, initialLocation, textInputBackgroundColor, handlePress }: GoogleInputProps) => {
    const { colorScheme } = useColorScheme();
    const isDarkMode = colorScheme === "dark";

    const tintColor = isDarkMode ? "white" : "#171616";
    const textColor = isDarkMode ? "#FFFFFF" : "#171616";
    const backgroundColor = isDarkMode ? "bg-gray-800" : "bg-gray-200";

    const [query, setQuery] = useState<string | undefined>(initialLocation); 
    const [suggestions, setSuggestions] = useState<GeoapifyPlace[]>([]);

    const route = useRoute();

    const isHomePage = route.name === "home";

    const fetchPlaces = async (text: string) => {
        if (text.length < 3) {
            setSuggestions([]);
            return;
        }

        try {
            const response = await fetch(
                `https://api.geoapify.com/v1/geocode/autocomplete?text=${text}&apiKey=${GEOAPIFY_API_KEY}`
            );
            const data = await response.json();
            setSuggestions(data.features || []);
        } catch (error) {
            console.error("Error fetching places:", error);
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <View className={`flex flex-col items-center justify-center relative rounded-xl ${containerStyle} ${isHomePage ? 'z-50' : ""}`} style={{ position: "relative" }}>
                <View className="absolute left-4 transform -translate-y-1/2">
                    <Image source={icon ? icon : icons.search} tintColor={tintColor} className="w-6 h-6" resizeMode="contain" />
                </View>

                <View style={{ flexDirection: "row", alignItems: "center", width: "100%" }}>
                    <TextInput
                        placeholder="Search"
                        value={query}
                        className="mx-2"
                        onChangeText={(text) => {
                            setQuery(text);
                            fetchPlaces(text);
                            if (text.length === 0) setSuggestions([]);
                        }}
                        style={{
                            color: textColor,
                            backgroundColor: textInputBackgroundColor || backgroundColor,
                            fontSize: 16,
                            fontWeight: "600",
                            paddingLeft: 40,
                            paddingVertical: 12,
                            flex: 1,
                            minWidth: 50,
                            borderRadius: 200,
                            textAlignVertical: "center",
                        }}
                        placeholderTextColor="gray"
                        numberOfLines={1}
                    />
                </View>

                {suggestions.length > 0 && (
                    <View style={{ position: "absolute", top: "110%", width: "100%", zIndex: 40, elevation: 5 }}>
                        <FlatList
                            data={suggestions}
                            keyExtractor={(item, index) => item.properties.place_id + index}
                            keyboardShouldPersistTaps="handled"
                            scrollEnabled={true}
                            style={{
                                // maxHeight: 350,
                                backgroundColor: isDarkMode ? "#2d2d2d" : "#fff",
                                borderRadius: 8,
                                overflow: "scroll",
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.2,
                                shadowRadius: 4,
                            }}
                            renderItem={({ item }: { item: GeoapifyPlace }) => (
                                <TouchableOpacity
                                    onPress={() => {
                                        handlePress({
                                            latitude: item.geometry.coordinates[1],
                                            longitude: item.geometry.coordinates[0],
                                            address: item.properties.formatted,
                                        });
                                        setQuery(item.properties.formatted);
                                        setSuggestions([]);
                                    }}
                                >
                                    <Text
                                        style={{
                                            padding: 12,
                                            borderBottomWidth: 1,
                                            borderColor: isDarkMode ? "#444" : "#ccc",
                                            backgroundColor: isDarkMode ? "#1F2937" : "#E5E7EB",
                                            color: textColor,
                                        }}
                                    >
                                        {item.properties.formatted}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                )}
            </View>
        </KeyboardAvoidingView>
    );
};

export default GoogleTextInput;
