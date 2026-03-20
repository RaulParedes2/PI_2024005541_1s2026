import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext'; 
import { useAuth } from './hooks/useAuth'; // 
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Home from './pages/Home';
import Perfil from './pages/Perfil';
import CrearPublicacion from './pages/CrearPublicacion';
import BuscarUsuario from './pages/BuscarUsuario';
import OlvidePassword from './pages/OlvidePassword';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Componente para rutas privadas
const PrivateRoute = ({ children }) => {
    const { user } = useAuth(); // AHORA USA EL HOOK CORRECTO
    return user ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <Navbar />
                    <div className="container mt-4">
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/registro" element={<Registro />} />
                            <Route path="/olvide-password" element={<OlvidePassword />} />
                            <Route path="/" element={
                                <PrivateRoute>
                                    <Home />
                                </PrivateRoute>
                            } />
                            <Route path="/perfil/:id?" element={
                                <PrivateRoute>
                                    <Perfil />
                                </PrivateRoute>
                            } />
                            <Route path="/crear-publicacion" element={
                                <PrivateRoute>
                                    <CrearPublicacion />
                                </PrivateRoute>
                            } />
                            <Route path="/buscar" element={
                                <PrivateRoute>
                                    <BuscarUsuario />
                                </PrivateRoute>
                            } />
                        </Routes>
                    </div>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;