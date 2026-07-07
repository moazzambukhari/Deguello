import React, { createContext, useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth';

import { subscribeToUser } from '../firebase/users';
import type { UserDocument } from '../firebase/types';

type AuthContextType = {
    userToken: string | null;
    userProfile: UserDocument | null;
    isLoading: boolean;
    signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
    userToken: null,
    userProfile: null,
    isLoading: true,
    signOut: async () => { },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userToken, setUserToken] = useState<string | null>(null);
    const [userProfile, setUserProfile] = useState<UserDocument | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let profileUnsubscribe: (() => void) | undefined;

        const authUnsubscribe = auth().onAuthStateChanged((user) => {
            profileUnsubscribe?.();

            if (user) {
                setUserToken(user.uid);
                profileUnsubscribe = subscribeToUser(user.uid, setUserProfile);
            } else {
                setUserToken(null);
                setUserProfile(null);
            }

            setIsLoading(false);
        });

        return () => {
            authUnsubscribe();
            profileUnsubscribe?.();
        };
    }, []);

    const signOut = async () => {
        const { signOut: firebaseSignOut } = await import('../firebase/auth');
        await firebaseSignOut();
    };

    return (
        <AuthContext.Provider
            value={{
                userToken,
                userProfile,
                isLoading,
                signOut,
            }}>
            {children}
        </AuthContext.Provider>
    );
};
