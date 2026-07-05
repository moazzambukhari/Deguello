import React, { createContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signIn as signInAction, signOut as signOutAction } from '../store/authSlice';
import type { RootState } from '../store/store';

type AuthContextType = {
    signIn: () => void;
    signOut: () => void;
    isLoading: boolean;
    userToken: string | null;
};

export const AuthContext = createContext<AuthContextType>({
    signIn: () => { },
    signOut: () => { },
    isLoading: true,
    userToken: null,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const dispatch = useDispatch();
    const { userToken, isLoading } = useSelector((state: RootState) => state.auth);

    const handleSignIn = () => {
        dispatch(signInAction());
    };

    const handleSignOut = () => {
        dispatch(signOutAction());
    };

    return (
        <AuthContext.Provider value={{ signIn: handleSignIn, signOut: handleSignOut, isLoading, userToken }}>
            {children}
        </AuthContext.Provider>
    );
};
