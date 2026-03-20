import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import API from '../services/api';

const CrearPublicacion = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [cursos, setCursos] = useState([]);
    const [catedraticos, setCatedraticos] = useState([]);
    const [formData, setFormData] = useState({
        tipo: 'curso', // 'curso' o 'catedratico'
        curso_id: '',
        catedratico_id: '',
        mensaje: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            const [cursosRes, catedraticosRes] = await Promise.all([
                API.get('/cursos'),
                API.get('/catedraticos')
            ]);
            setCursos(cursosRes.data);
            setCatedraticos(catedraticosRes.data);
        } catch (error) {
            console.error('Error cargando datos:', error);
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
            const publicacionData = {
                usuario_id_usuario: user.id_usuario,
                mensaje: formData.mensaje
            };

            if (formData.tipo === 'curso') {
                publicacionData.curso_id_curso = formData.curso_id;
                publicacionData.catedratico_id_catedratico = null;
            } else {
                publicacionData.catedratico_id_catedratico = formData.catedratico_id;
                publicacionData.curso_id_curso = null;
            }

            await API.post('/publicaciones', publicacionData);
            navigate('/');
        } catch (error) {
            setError('Error al crear la publicación');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="row justify-content-center">
            <div className="col-md-8">
                <div className="card">
                    <div className="card-header">
                        <h4 className="mb-0">Crear Nueva Publicación</h4>
                    </div>
                    <div className="card-body">
                        {error && (
                            <div className="alert alert-danger">{error}</div>
                        )}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Tipo de Publicación</label>
                                <div>
                                    <div className="form-check form-check-inline">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="tipo"
                                            id="tipoCurso"
                                            value="curso"
                                            checked={formData.tipo === 'curso'}
                                            onChange={handleChange}
                                        />
                                        <label className="form-check-label" htmlFor="tipoCurso">
                                            Sobre un Curso
                                        </label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="tipo"
                                            id="tipoCatedratico"
                                            value="catedratico"
                                            checked={formData.tipo === 'catedratico'}
                                            onChange={handleChange}
                                        />
                                        <label className="form-check-label" htmlFor="tipoCatedratico">
                                            Sobre un Catedrático
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {formData.tipo === 'curso' ? (
                                <div className="mb-3">
                                    <label htmlFor="curso_id" className="form-label">Seleccionar Curso</label>
                                    <select
                                        className="form-select"
                                        id="curso_id"
                                        name="curso_id"
                                        value={formData.curso_id}
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
                            ) : (
                                <div className="mb-3">
                                    <label htmlFor="catedratico_id" className="form-label">Seleccionar Catedrático</label>
                                    <select
                                        className="form-select"
                                        id="catedratico_id"
                                        name="catedratico_id"
                                        value={formData.catedratico_id}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Seleccione un catedrático</option>
                                        {catedraticos.map(cat => (
                                            <option key={cat.id_catedratico} value={cat.id_catedratico}>
                                                {cat.nombre} {cat.apellido}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="mb-3">
                                <label htmlFor="mensaje" className="form-label">Mensaje</label>
                                <textarea
                                    className="form-control"
                                    id="mensaje"
                                    name="mensaje"
                                    rows="5"
                                    value={formData.mensaje}
                                    onChange={handleChange}
                                    required
                                ></textarea>
                            </div>

                            <button 
                                type="submit" 
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? 'Publicando...' : 'Publicar'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CrearPublicacion;