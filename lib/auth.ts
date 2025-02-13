import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { TokenCache } from '@clerk/clerk-expo/dist/cache';
import { fetchAPI } from './fetch';
import * as Linking from "expo-linking";

const createTokenCache = (): TokenCache => {
    return {
        getToken: async (key: string) => {
            try {
                const item = await SecureStore.getItemAsync(key);

                if (item) {
                    console.log(`${key} was used 🔐 \n`);
                } else {
                    console.log('No values stored under key: ' + key);
                }

                return item;
            } catch (error) {
                console.error('secure store get item error: ', error);
                await SecureStore.deleteItemAsync(key);
                return null;
            }
        },
        saveToken: (key: string, token: string) => {
            return SecureStore.setItemAsync(key, token);
        },
    }
}

// SecureStore is not supported on the web
export const tokenCache = Platform.OS !== 'web' ? createTokenCache() : undefined ;

export const googleOAuth = async (startOAuthFlow: any) => {
    try {
        const { createdSessionId, setActive, signUp } = await startOAuthFlow({
            redirectUrl: Linking.createURL("/(root)/(tabs)/home"),
        });
  
        //if successful signIn or SignUp
        if (createdSessionId) {
            if (setActive) {
                await setActive({ session: createdSessionId });
    
                //if signUp
                if (signUp.createdUserId) {
                    // store the user info in DB
                    await fetchAPI("/(api)/user", {
                        method: "POST",
                        body: JSON.stringify({
                            name: `${signUp.firstName} ${signUp.lastName}`,
                            email: signUp.emailAddress,
                            clerkId: signUp.createdUserId,
                        }),
                    });
                }
    
                return {
                    success: true,
                    code: "success",
                    message: "You have successfully signed in with Google",
                };
            }
        }
  
        return {
            success: false,
            message: "An error occurred while signing in with Google",
        };
    } catch (err: any) {
        console.error(err);
        return {
            success: false,
            code: err.code,
            message: err?.errors[0]?.longMessage,
        };
    }
};