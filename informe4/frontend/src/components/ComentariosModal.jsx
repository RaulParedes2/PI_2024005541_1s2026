
/* eslint-disable react/prop-types */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import API from '../services/api';

const ComentariosModal = ({ publicacionId, show, onClose }) => {
    const { user } = useAuth();
    const [comentarios, setComentarios] = useState([]);
    const [nuevoComentario, setNuevoComentario] = useState('');
    const [loading, setLoading] = useState(false);
    const [enviando, setEnviando] = useState(false);
    const [editandoId, setEditandoId] = useState(null);
    const [editandoMensaje, setEditandoMensaje] = useState('');

    useEffect(() => {
        if (show && publicacionId) {
            cargarComentarios();
        }
    }, [show, publicacionId]);

    const cargarComentarios = async () => {
        setLoading(true);
        try {
            const response = await API.get(`/comentarios/publicacion/${publicacionId}`);
            setComentarios(response.data || []);
        } catch (error) {
            console.error('Error cargando comentarios:', error);
            setComentarios([]);
        } finally {
            setLoading(false);
        }
    };

    const enviarComentario = async (e) => {
        e.preventDefault();
        if (!nuevoComentario.trim()) return;

        setEnviando(true);
        try {
            await API.post('/comentarios', {
                publicacion_id_publicacion: publicacionId,
                usuario_id_usuario: user.id_usuario,
                mensaje: nuevoComentario
            });
            setNuevoComentario('');
            cargarComentarios();
        } catch (error) {
            console.error('Error enviando comentario:', error);
        } finally {
            setEnviando(false);
        }
    };

    const handleEditar = (comentario) => {
        setEditandoId(comentario.id_comentario);
        setEditandoMensaje(comentario.mensaje);
    };

    const handleGuardarEdicion = async (comentarioId) => {
        try {
            await API.put(`/comentarios/${comentarioId}`, {
                mensaje: editandoMensaje
            });
            setEditandoId(null);
            cargarComentarios();
        } catch (error) {
            console.error('Error editando comentario:', error);
        }
    };

    const handleEliminar = async (comentarioId) => {
        if (window.confirm('¿Estás seguro de eliminar este comentario?')) {
            try {
                await API.delete(`/comentarios/${comentarioId}`);
                cargarComentarios();
            } catch (error) {
                console.error('Error eliminando comentario:', error);
            }
        }
    };

    if (!show) return null;

    return (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Comentarios</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {loading ? (
                            <div className="text-center">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Cargando...</span>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="mb-4" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                    {comentarios.length === 0 ? (
                                        <p className="text-muted text-center">No hay comentarios aún</p>
                                    ) : (
                                        comentarios.map((comentario) => (
                                            <div key={comentario.id_comentario} className="card mb-2">
                                                <div className="card-body">
                                                    <div className="d-flex justify-content-between">
                                                        <h6 className="card-subtitle mb-2 text-primary">
                                                            {comentario.nombres} {comentario.apellidos}
                                                        </h6>
                                                        <small className="text-muted">
                                                            {new Date(comentario.fecha).toLocaleDateString()}
                                                        </small>
                                                    </div>
                                                    
                                                    {editandoId === comentario.id_comentario ? (
                                                        <div className="mt-2">
                                                            <textarea
                                                                className="form-control mb-2"
                                                                value={editandoMensaje}
                                                                onChange={(e) => setEditandoMensaje(e.target.value)}
                                                                rows="2"
                                                            />
                                                            <button 
                                                                className="btn btn-sm btn-success me-2"
                                                                onClick={() => handleGuardarEdicion(comentario.id_comentario)}
                                                            >
                                                                Guardar
                                                            </button>
                                                            <button 
                                                                className="btn btn-sm btn-secondary"
                                                                onClick={() => setEditandoId(null)}
                                                            >
                                                                Cancelar
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <p className="card-text">{comentario.mensaje}</p>
                                                            {user && user.id_usuario === comentario.usuario_id_usuario && (
                                                                <div className="mt-2">
                                                                    <button 
                                                                        className="btn btn-sm btn-outline-warning me-2"
                                                                        onClick={() => handleEditar(comentario)}
                                                                    >
                                                                        Editar
                                                                    </button>
                                                                    <button 
                                                                        className="btn btn-sm btn-outline-danger"
                                                                        onClick={() => handleEliminar(comentario.id_comentario)}
                                                                    >
                                                                        Eliminar
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <form onSubmit={enviarComentario}>
                                    <div className="input-group">
                                        <textarea
                                            className="form-control"
                                            placeholder="Escribe un comentario..."
                                            value={nuevoComentario}
                                            onChange={(e) => setNuevoComentario(e.target.value)}
                                            rows="2"
                                            required
                                        />
                                        <button 
                                            type="submit" 
                                            className="btn btn-primary"
                                            disabled={enviando || !nuevoComentario.trim()}
                                        >
                                            {enviando ? 'Enviando...' : 'Comentar'}
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComentariosModal;