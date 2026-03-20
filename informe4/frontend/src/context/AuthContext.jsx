
import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/auth';

// Crear el contexto
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Cargar usuario del localStorage al iniciar
        const loadUser = () => {
            const storedUser = authService.getCurrentUser();
            if (storedUser) {
                setUser(storedUser);
            }
            setLoading(false);
        };

        loadUser();
    }, []);

    const login = async (credentials) => {
        const response = await authService.login(credentials);
        if (response.usuario) {
            setUser(response.usuario);
        }
        return response;
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const value = {
        user,
        login,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// Exportar el contexto para que el hook pueda usarlo
export { AuthContext };