import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

const OlvidePassword = () => {
    const [formData, setFormData] = useState({
        registro_academico: '',
        correo: ''
    });
    const [step, setStep] = useState(1); // 1: verificar, 2: nueva contraseña
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(''); // Cambiado de 'error' a 'errorMessage'
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleVerificar = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
        // Verificar si el usuario existe
        const response = await API.get(`/usuarios/buscar?registro=${formData.registro_academico}`);
        console.log('Usuario encontrado:', response.data); // Para depurar
        setStep(2);
    } catch (error) {
        console.error('Error completo:', error); //  Esto te mostrará el error exacto
        console.error('Response:', error.response); //  Esto es crucial
        
        if (error.response?.status === 404) {
            setErrorMessage('Registro académico o correo incorrectos');
        } else {
            setErrorMessage(error.response?.data?.error || 'Error al verificar usuario');
        }
    } finally {
        setLoading(false);
    }
};

    const handleResetPassword = async (e) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
            setErrorMessage('Las contraseñas no coinciden'); // Usando errorMessage
            return;
        }

        setLoading(true);
        setErrorMessage(''); // Usando errorMessage

        try {
            await API.post('/usuarios/olvide-password', {
                registro_academico: formData.registro_academico,
                correo: formData.correo,
                new_password: newPassword
            });
            setSuccess('Contraseña actualizada exitosamente');
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
        } catch (error) {
            console.error('Error detallado:', error);
            setErrorMessage('Error al actualizar contraseña'); // Usando errorMessage
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="row justify-content-center">
            <div className="col-md-6">
                <div className="card">
                    <div className="card-header">
                        <h4 className="mb-0">Recuperar Contraseña</h4>
                    </div>
                    <div className="card-body">
                        {errorMessage && ( // Cambiado de 'error' a 'errorMessage'
                            <div className="alert alert-danger">{errorMessage}</div>
                        )}
                        {success && (
                            <div className="alert alert-success">{success}</div>
                        )}

                        {step === 1 ? (
                            <form onSubmit={handleVerificar}>
                                <div className="mb-3">
                                    <label htmlFor="registro_academico" className="form-label">
                                        Registro Académico
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="registro_academico"
                                        name="registro_academico"
                                        value={formData.registro_academico}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="correo" className="form-label">
                                        Correo Electrónico
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="correo"
                                        name="correo"
                                        value={formData.correo}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <button 
                                    type="submit" 
                                    className="btn btn-primary w-100"
                                    disabled={loading}
                                >
                                    {loading ? 'Verificando...' : 'Verificar Datos'}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleResetPassword}>
                                <div className="mb-3">
                                    <label htmlFor="newPassword" className="form-label">
                                        Nueva Contraseña
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="newPassword"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        minLength="6"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="confirmPassword" className="form-label">
                                        Confirmar Contraseña
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        minLength="6"
                                    />
                                </div>
                                <button 
                                    type="submit" 
                                    className="btn btn-primary w-100"
                                    disabled={loading}
                                >
                                    {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
                                </button>
                            </form>
                        )}

                        <div className="mt-3 text-center">
                            <Link to="/login">Volver al inicio de sesión</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OlvidePassword;