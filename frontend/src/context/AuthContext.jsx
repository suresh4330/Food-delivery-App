import { createContext, useState, useContext } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    // No asynchronous session verification is performed on application start.
    const [loading] = useState(false);

    const login = async (email, password) => {
        const { data } = await API.post('/auth/login', { email, password });
        setUser(data);
        setToken(data.token);
        localStorage.setItem('token', data.token);
        return data;
    };

    const register = async (userData) => {
        const { data } = await API.post('/auth/register', userData);
        setUser(data);
        setToken(data.token);
        localStorage.setItem('token', data.token);
        return data;
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
