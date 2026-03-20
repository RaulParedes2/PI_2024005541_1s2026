import API from './api';

export const authService = {
    // Registrar usuario
    async register(userData) {
        const response = await API.post('/usuarios/registro', userData);
        return response.data;
    },

    // Login
    async login(credentials) {
        const response = await API.post('/usuarios/login', credentials);
        if (response.data.usuario) {
            localStorage.setItem('user', JSON.stringify(response.data.usuario));
        }
        return response.data;
    },

    // Logout
    logout() {
        localStorage.removeItem('user');
    },

    // Obtener usuario actual
    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    }
};
