import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import API from '../services/api';
import ComentariosModal from './ComentariosModal';

const PublicacionCard = ({ publicacion, onEliminar }) => {
    const { user } = useAuth();
    const [showComentarios, setShowComentarios] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [eliminando, setEliminando] = useState(false);

    // Verificar si el usuario actual es el autor de la publicación
    const esAutor = user && user.id_usuario === publicacion.usuario_id_usuario;

    const handleEliminar = async () => {
        setEliminando(true);
        try {
            await API.delete(`/publicaciones/${publicacion.id_publicacion}`, {
                data: { usuario_id: user.id_usuario }
            });
            setShowConfirm(false);
            if (onEliminar) {
                onEliminar(publicacion.id_publicacion); // Notificar al padre
            }
        } catch (error) {
            console.error('Error eliminando publicación:', error);
            alert(error.response?.data?.error || 'Error al eliminar la publicación');
        } finally {
            setEliminando(false);
        }
    };

    return (
        <>
            <div className="card mb-3">
                <div className="card-header">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <strong>{publicacion.nombres} {publicacion.apellidos}</strong>
                            <span className="text-muted ms-2">
                                ({publicacion.registro_academico})
                            </span>
                        </div>
                        <div>
                            <small className="text-muted me-3">
                                {new Date(publicacion.fecha_publicacion).toLocaleDateString()}
                            </small>
                            {esAutor && (
                                <button 
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => setShowConfirm(true)}
                                    title="Eliminar publicación"
                                >
                                    🗑️
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                <div className="card-body">
                    <p className="card-text">{publicacion.mensaje}</p>
                    {(publicacion.curso_nombre || publicacion.catedratico_nombre) && (
                        <div className="mt-2">
                            {publicacion.curso_nombre && (
                                <span className="badge bg-primary me-2">
                                    Curso: {publicacion.curso_nombre}
                                </span>
                            )}
                            {publicacion.catedratico_nombre && (
                                <span className="badge bg-success">
                                    Catedrático: {publicacion.catedratico_nombre} {publicacion.catedratico_apellido}
                                </span>
                            )}
                        </div>
                    )}
                </div>
                <div className="card-footer">
                    <button 
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => setShowComentarios(true)}
                    >
                        Ver comentarios
                    </button>
                </div>
            </div>

            {/* Modal de comentarios */}
            <ComentariosModal 
                publicacionId={publicacion.id_publicacion}
                show={showComentarios}
                onClose={() => setShowComentarios(false)}
            />

            {/* Modal de confirmación para eliminar */}
            {showConfirm && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirmar Eliminación</h5>
                                <button type="button" className="btn-close" onClick={() => setShowConfirm(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p>¿Estás seguro que deseas eliminar esta publicación?</p>
                                <p className="text-danger">Esta acción no se puede deshacer y eliminará todos los comentarios asociados.</p>
                            </div>
                            <div className="modal-footer">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary" 
                                    onClick={() => setShowConfirm(false)}
                                    disabled={eliminando}
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-danger" 
                                    onClick={handleEliminar}
                                    disabled={eliminando}
                                >
                                    {eliminando ? 'Eliminando...' : 'Eliminar'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PublicacionCard;