import React, { useState, useEffect } from 'react';
import API from '../services/api';

const AgregarCursoModal = ({ usuarioId, show, onClose, onCursoAgregado }) => {
    const [cursos, setCursos] = useState([]);
    const [formData, setFormData] = useState({
        curso_id_curso: '',
        nota: '',
        fecha_aprobacion: new Date().toISOString().split('T')[0]
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (show) {
            cargarCursos();
        }
    }, [show]);

    const cargarCursos = async () => {
        try {
            const response = await API.get('/cursos');
            setCursos(response.data);
        } catch (error) {
            console.error('Error cargando cursos:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await API.post('/cursos/aprobados', {
                ...formData,
                usuario_id_usuario: usuarioId
            });
            onCursoAgregado();
            onClose();
        } catch (error) {
            setError('Error al agregar curso');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!show) return null;

    return (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Agregar Curso Aprobado</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            {error && (
                                <div className="alert alert-danger">{error}</div>
                            )}
                            <div className="mb-3">
                                <label className="form-label">Curso</label>
                                <select
                                    className="form-select"
                                    name="curso_id_curso"
                                    value={formData.curso_id_curso}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Seleccione un curso</option>
                                    {cursos.map(curso => (
                                        <option key={curso.id_curso} value={curso.id_curso}>
                                            {curso.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Nota</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="nota"
                                    value={formData.nota}
                                    onChange={handleChange}
                                    min="0"
                                    max="100"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Fecha de Aprobación</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    name="fecha_aprobacion"
                                    value={formData.fecha_aprobacion}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>
                                Cancelar
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Guardando...' : 'Guardar'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AgregarCursoModal;