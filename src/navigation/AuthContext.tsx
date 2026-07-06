import React, { createContext, useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth';

type AuthContextType = {
    userToken: string | null;
    isLoading: boolean;
    signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
    userToken: null,
    isLoading: true,
    signOut: async () => { },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userToken, setUserToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth().onAuthStateChanged(user => {
            if (user) {
                setUserToken(user.uid);
            } else {
                setUserToken(null);
            }

            setIsLoading(false);
        });

        return unsubscribe;
    }, []);

    const signOut = async () => {
        await auth().signOut();
    };

    return (
        <AuthContext.Provider
            value={{
                userToken,
                isLoading,
                signOut,
            }}>
            {children}
        </AuthContext.Provider>
    );
};