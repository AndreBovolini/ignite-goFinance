import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as Google from 'expo-google-app-auth'
import * as AppleAuthentication from 'expo-apple-authentication'

interface AuthProviderProps {
    children: ReactNode
}

interface User {
    id: string;
    name: string;
    email: string;
    photo?: string;
}

interface IAuthContextData {
    user: User;
    signInWithGoogle(): Promise<void>;
    signInWithApple(): Promise<void>;
    signOut(): Promise<void>;
    isLoading: boolean;
}

export const AuthContext = createContext({} as IAuthContextData);

function AuthProvider({ children } : AuthProviderProps) {
    const [user, setUser] = useState<User>({} as User)
    const [isLoading, setIsLoading] = useState(true)

    const userStorageKey = '@gofinances:user'

    async function signInWithGoogle() {
        try{
            const result = await Google.logInAsync({
                iosClientId: '299065608472-5fma9en8reoj174eh4f7r5e0cth05pan.apps.googleusercontent.com',
                androidClientId: '299065608472-680bk0f4a14b8ab9ohp4vb4p7u5u4b02.apps.googleusercontent.com',
                scopes: ['profile', 'email']
            })


            if(result.type === 'success') {
                const userLogged = {
                    id: String(result.user.id),
                    email: result.user.email!,
                    name: result.user.name!,
                    photo: result.user.photoUrl!
                };

                setUser(userLogged);
                await AsyncStorage.setItem(userStorageKey, JSON.stringify(userLogged));
            }
        } catch (error) {
            throw new Error(error);
        }
    }

    async function signInWithApple() {
        try {
            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ]
            });

            if(credential) {
                const name = credential.fullName!.givenName!;
                const userLogged = {
                    id: String(credential.user),
                    email: credential.email!,
                    name: credential.fullName!.givenName!,
                    photo: `https://ui-avatar.com/api/?name=${name}&length=1`
                };

                setUser(userLogged);
                await AsyncStorage.setItem(userStorageKey, JSON.stringify(userLogged));
            }
        } catch (error) {
            throw new Error(error)
        }
    }

    async function signOut(){
        setUser({} as User);
        await AsyncStorage.removeItem(userStorageKey)
    }

    useEffect(() => {
        async function loadUserStorageData() {
            const userStorage = await AsyncStorage.getItem(userStorageKey);

            if (userStorage) {
                const userLogged = JSON.parse(userStorage) as User;
                setUser(userLogged)
            }
            setIsLoading(false);

        }

        loadUserStorageData()
    },[])

    return (
        <AuthContext.Provider value={{
            user,
            signInWithGoogle,
            signInWithApple,
            signOut,
            isLoading,
        }}>
          {children}
        </AuthContext.Provider>
    )
}

function useAuth() {
    const context = useContext(AuthContext)

    return context
}

export {AuthProvider, useAuth}

