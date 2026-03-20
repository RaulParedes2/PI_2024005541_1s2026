import React, { useState, useEffect } from 'react';
import API from '../services/api';

const EditarCursoModal = ({ curso, show, onClose, onCursoActualizado }) => {
    const [formData, setFormData] = useState({
        nota: '',
        fecha_aprobacion: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (curso) {
            setFormData({
                nota: curso.nota,
                fecha_aprobacion: curso.fecha_aprobacion.split('T')[0]
            });
        }
    }, [curso]);

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
            await API.put(`/cursos/aprobados/${curso.id_curso_aprobado}`, {
                nota: formData.nota
            });
            onCursoActualizado();
            onClose();
        } catch (error) {
            setError('Error al actualizar curso');
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
                        <h5 className="modal-title">Editar Curso Aprobado</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            {error && (
                                <div className="alert alert-danger">{error}</div>
                            )}
                            <div className="mb-3">
                                <label className="form-label">Curso</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={curso?.nombre}
                                    disabled
                                />
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
                                    value={formData.fecha_aprobacion}
                                    disabled
                                />
                                <small className="text-muted">La fecha no se puede modificar</small>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>
                                Cancelar
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Actualizando...' : 'Actualizar'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditarCursoModal;