import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import API from '../services/api';
import AgregarCursoModal from '../components/AgregarCursoModal';
import EditarCursoModal from '../components/EditarCursoModal';

const Perfil = () => {
    const { id } = useParams();
    const { user: currentUser } = useAuth();
    const [perfil, setPerfil] = useState(null);
    const [cursosAprobados, setCursosAprobados] = useState([]);
    const [totalCreditos, setTotalCreditos] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [showAgregarCurso, setShowAgregarCurso] = useState(false);
    const [showEditarCurso, setShowEditarCurso] = useState(false);
    const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
    const [showEliminarCurso, setShowEliminarCurso] = useState(false);
    const [cursoAEliminar, setCursoAEliminar] = useState(null);

    const [formData, setFormData] = useState({
        nombres: '',
        apellidos: '',
        correo: ''
    });

    // Determinar si es mi perfil
    const esMiPerfil = currentUser && currentUser.id_usuario === parseInt(id);

    useEffect(() => {
        cargarDatosPerfil();
    }, [id]);

    const cargarDatosPerfil = async () => {
        setLoading(true);
        try {
            const perfilRes = await API.get(`/usuarios/${id}`);
            setPerfil(perfilRes.data);
            setFormData({
                nombres: perfilRes.data.nombres,
                apellidos: perfilRes.data.apellidos,
                correo: perfilRes.data.correo
            });

            const cursosRes = await API.get(`/cursos/aprobados/${id}`);
            setCursosAprobados(cursosRes.data);

            const creditosRes = await API.get(`/cursos/creditos/${id}`);
            setTotalCreditos(creditosRes.data.total_creditos);

        } catch (error) {
            setError('Error al cargar el perfil');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.put(`/usuarios/${id}`, formData);
            setEditMode(false);
            cargarDatosPerfil();
        } catch (error) {
            setError('Error al actualizar el perfil');
            console.error(error);
        }
    };

    const handleEliminarCurso = async () => {
        try {
            await API.delete(`/cursos/aprobados/${cursoAEliminar.id_curso_aprobado}`);
            setShowEliminarCurso(false);
            cargarDatosPerfil();
        } catch (error) {
            console.error('Error eliminando curso:', error);
            alert('Error al eliminar el curso');
        }
    };

    if (loading) {
        return (
            <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger">{error}</div>
        );
    }

    if (!perfil) {
        return (
            <div className="alert alert-warning">Perfil no encontrado</div>
        );
    }

    return (
        <div className="row">
            {/* Columna izquierda - Información Personal y Estadísticas */}
            <div className="col-md-4">
                {/* Tarjeta de Información Personal */}
                <div className="card">
                    <div className="card-header">
                        <h5 className="mb-0">Información Personal</h5>
                    </div>
                    <div className="card-body">
                        {editMode ? (
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Nombres</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="nombres"
                                        value={formData.nombres}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Apellidos</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="apellidos"
                                        value={formData.apellidos}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Correo</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="correo"
                                        value={formData.correo}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary me-2">
                                    Guardar
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-secondary"
                                    onClick={() => setEditMode(false)}
                                >
                                    Cancelar
                                </button>
                            </form>
                        ) : (
                            <>
                                <p><strong>Registro:</strong> {perfil.registro_academico}</p>
                                <p><strong>Nombre:</strong> {perfil.nombres} {perfil.apellidos}</p>
                                <p><strong>Correo:</strong> {perfil.correo}</p>
                                {esMiPerfil && (
                                    <button 
                                        className="btn btn-primary"
                                        onClick={() => setEditMode(true)}
                                    >
                                        Editar Perfil
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Tarjeta de Estadísticas */}
                <div className="card mt-3">
                    <div className="card-header">
                        <h5 className="mb-0">Estadísticas</h5>
                    </div>
                    <div className="card-body">
                        <p><strong>Cursos Aprobados:</strong> {cursosAprobados.length}</p>
                        <p><strong>Total de Créditos:</strong> {totalCreditos}</p>
                    </div>
                </div>
            </div>

            {/* Columna derecha - Cursos Aprobados */}
            <div className="col-md-8">
                <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Cursos Aprobados</h5>
                        {esMiPerfil && (
                            <button 
                                className="btn btn-sm btn-success"
                                onClick={() => setShowAgregarCurso(true)}
                            >
                                Agregar Curso
                            </button>
                        )}
                    </div>
                    <div className="card-body">
                        {cursosAprobados.length === 0 ? (
                            <p className="text-muted">No hay cursos aprobados para mostrar</p>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Curso</th>
                                            <th>Créditos</th>
                                            <th>Nota</th>
                                            <th>Semestre</th>
                                            <th>Fecha Aprobación</th>
                                            {esMiPerfil && <th>Acciones</th>}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cursosAprobados.map(curso => (
                                            <tr key={curso.id_curso_aprobado}>
                                                <td>{curso.nombre}</td>
                                                <td>{curso.creditos}</td>
                                                <td>{curso.nota}</td>
                                                <td>{curso.semestre}</td>
                                                <td>{new Date(curso.fecha_aprobacion).toLocaleDateString()}</td>
                                                {esMiPerfil && (
                                                    <td>
                                                        <button 
                                                            className="btn btn-sm btn-warning me-2"
                                                            onClick={() => {
                                                                setCursoSeleccionado(curso);
                                                                setShowEditarCurso(true);
                                                            }}
                                                        >
                                                            Editar
                                                        </button>
                                                        <button 
                                                            className="btn btn-sm btn-danger"
                                                            onClick={() => {
                                                                setCursoAEliminar(curso);
                                                                setShowEliminarCurso(true);
                                                            }}
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modales */}
            <AgregarCursoModal
                usuarioId={id}
                show={showAgregarCurso}
                onClose={() => setShowAgregarCurso(false)}
                onCursoAgregado={cargarDatosPerfil}
            />

            <EditarCursoModal
                curso={cursoSeleccionado}
                show={showEditarCurso}
                onClose={() => {
                    setShowEditarCurso(false);
                    setCursoSeleccionado(null);
                }}
                onCursoActualizado={cargarDatosPerfil}
            />

            {/* Modal de confirmación para eliminar */}
            {showEliminarCurso && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirmar Eliminación</h5>
                                <button type="button" className="btn-close" onClick={() => setShowEliminarCurso(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p>¿Estás seguro que deseas eliminar el curso <strong>{cursoAEliminar?.nombre}</strong>?</p>
                                <p className="text-danger">Esta acción no se puede deshacer.</p>
                            </div>
                            <div className="modal-footer">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary" 
                                    onClick={() => setShowEliminarCurso(false)}
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-danger" 
                                    onClick={handleEliminarCurso}
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Perfil;