import { View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-white">
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-red-500">
          Open up App.js to start working on your app!
        </Text>
        <Text className='text-green-700 font-bold text-lg'>
          Hii, Welcome Yugal
        </Text>
        <Text className='text-cyan-500 font-semibold text-lg'>
          Let's start building
        </Text>
        <StatusBar style="auto" />
      </View>
    </SafeAreaView>
  );
}
