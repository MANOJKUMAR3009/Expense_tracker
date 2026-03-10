import { createContext, useContext, useState, useCallback } from 'react';
import { login as apiLogin, register as apiRegister } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem('savemore_token'));
    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('savemore_user'));
        } catch {
            return null;
        }
    });

    const login = useCallback(async (credentials) => {
        const res = await apiLogin(credentials);
        const { token: jwt, username, email } = res.data;
        localStorage.setItem('savemore_token', jwt);
        localStorage.setItem('savemore_user', JSON.stringify({ username, email }));
        setToken(jwt);
        setUser({ username, email });
        return res.data;
    }, []);

    const register = useCallback(async (credentials) => {
        const res = await apiRegister(credentials);
        const { token: jwt, username, email } = res.data;
        localStorage.setItem('savemore_token', jwt);
        localStorage.setItem('savemore_user', JSON.stringify({ username, email }));
        setToken(jwt);
        setUser({ username, email });
        return res.data;
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('savemore_token');
        localStorage.removeItem('savemore_user');
        setToken(null);
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ token, user, login, register, logout, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
