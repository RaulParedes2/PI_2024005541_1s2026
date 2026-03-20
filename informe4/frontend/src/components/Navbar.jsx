import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
//import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
         <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow">
            <div className="container">
                {/* Título principal - Sistema de Reseñas */}
                <Link className="navbar-brand fw-bold fs-4" to="/">
                    Sistema de Reseñas
                </Link>
                
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                
                <div className="collapse navbar-collapse" id="navbarNav">
                    {/* Opciones de navegación principales - SOLO para usuarios logueados */}
                    {user && (
                        <ul className="navbar-nav me-auto">
                            <li className="nav-item">
                                <Link 
                                    className="nav-link px-3 mx-1 rounded-3" 
                                    to="/"
                                    style={{ transition: 'all 0.3s' }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                >
                                    Inicio
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link 
                                    className="nav-link px-3 mx-1 rounded-3" 
                                    to="/crear-publicacion"
                                    style={{ transition: 'all 0.3s' }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                >
                                    Crear Publicación
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link 
                                    className="nav-link px-3 mx-1 rounded-3" 
                                    to="/buscar"
                                    style={{ transition: 'all 0.3s' }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                >
                                    Buscar Usuario
                                </Link>
                            </li>
                        </ul>
                    )}
                    
                    {/* Sección de usuario - derecha */}
                    <ul className="navbar-nav">
                        {user ? (
                            <>
                                {/* Badge del usuario - INTEGRADO con enlace al perfil */}
                                <li className="nav-item">
                                    <Link 
                                        className="nav-link" 
                                        to={`/perfil/${user.id_usuario}`}
                                    >
                                        <span className="badge bg-light text-dark rounded-pill px-4 py-2 fs-6">
                                            👤 {user.nombres} {user.apellidos}
                                        </span>
                                    </Link>
                                </li>
                                
                                {/* Botón de cerrar sesión */}
                                <li className="nav-item ms-2">
                                    <button 
                                        className="btn btn-outline-light btn-sm rounded-pill px-4 py-2" 
                                        onClick={handleLogout}
                                    >
                                        Salir
                                    </button>
                                </li>
                            </>
                        ) : (
                            /* Opciones para usuarios no logueados */
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link px-3" to="/login">
                                        Login
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link px-3" to="/registro">
                                        Registro
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;