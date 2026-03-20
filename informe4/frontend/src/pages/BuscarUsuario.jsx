import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const BuscarUsuario = () => {
    const [registro, setRegistro] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await API.get(`/usuarios/buscar?registro=${registro}`);
            if (response.data) {
                navigate(`/perfil/${response.data.id_usuario}`);
            }
        } catch (error) {
            if (error.response?.status === 404) {
                setError('Usuario no encontrado');
            } else {
                setError('Error al buscar usuario');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="row justify-content-center">
            <div className="col-md-6">
                <div className="card">
                    <div className="card-header">
                        <h4 className="mb-0">Buscar Usuario</h4>
                    </div>
                    <div className="card-body">
                        {error && (
                            <div className="alert alert-danger">{error}</div>
                        )}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="registro" className="form-label">
                                    Número de Registro Académico
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="registro"
                                    value={registro}
                                    onChange={(e) => setRegistro(e.target.value)}
                                    placeholder="Ej: 2024005541"
                                    required
                                />
                            </div>
                            <button 
                                type="submit" 
                                className="btn btn-primary w-100"
                                disabled={loading}
                            >
                                {loading ? 'Buscando...' : 'Buscar Usuario'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BuscarUsuario;