
import React from 'react';
import axios from 'axios';
import { API_URL } from '@/constants/Api';
import { Buffer } from 'buffer';

const AuthContext = React.createContext<{
    signIn: (user: string, pass: string) => Promise<boolean>;
    signOut: () => void;
    session?: string | null;
    isLoading: boolean;
    username?: string | null;
    role?: string | null;
}>({
    signIn: async () => false,
    signOut: () => null,
    session: null,
    isLoading: false,
});

export function useSession() {
    const value = React.useContext(AuthContext);
    if (process.env.NODE_ENV !== 'production') {
        if (!value) {
            throw new Error('useSession must be wrapped in a <SessionProvider />');
        }
    }
    return value;
}

export function SessionProvider(props: React.PropsWithChildren) {
    const [session, setSession] = React.useState<string | null>(null);
    const [username, setUsername] = React.useState<string | null>(null);
    const [role, setRole] = React.useState<string | null>(null);

    const signIn = async (user: string, pass: string) => {
        // Basic Auth Token Generation
        const token = typeof window !== 'undefined' ? window.btoa(`${user}:${pass}`) : Buffer.from(`${user}:${pass}`).toString('base64');

        // Set axios default
        axios.defaults.baseURL = API_URL;
        axios.defaults.headers.common['Authorization'] = `Basic ${token}`;

        // Check if valid by making a request
        try {
            // Check Profile to get Role
            const response = await axios.get('/mobile/katilimci/profil');

            if (response.data.rol) {
                setRole(response.data.rol);
            }

            setSession(token);
            setUsername(user);
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    };

    const signOut = () => {
        setSession(null);
        setUsername(null);
        setRole(null);
        delete axios.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider
            value={{
                signIn,
                signOut,
                session,
                isLoading: false,
                username,
                role
            }}>
            {props.children}
        </AuthContext.Provider>
    );
}
