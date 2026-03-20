import React, { useState, useEffect } from 'react';
import API from '../services/api';
import PublicacionCard from '../components/PublicacionCard';

const Home = () => {
    const [publicaciones, setPublicaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filtros, setFiltros] = useState({
        curso: '',
        catedratico: '',
        nombreCurso: '',
        nombreCatedratico: ''
    });
    const [cursos, setCursos] = useState([]);
    const [catedraticos, setCatedraticos] = useState([]);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const [cursosRes, catedraticosRes] = await Promise.all([
                    API.get('/cursos'),
                    API.get('/catedraticos')
                ]);
                setCursos(cursosRes.data || []);
                setCatedraticos(catedraticosRes.data || []);
            } catch (error) {
                console.error('Error cargando datos:', error);
            }
        };
        cargarDatos();
        cargarPublicaciones();
    }, []);

    const cargarPublicaciones = async (filtrosAplicados = filtros) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filtrosAplicados.curso) params.append('curso', filtrosAplicados.curso);
            if (filtrosAplicados.catedratico) params.append('catedratico', filtrosAplicados.catedratico);
            if (filtrosAplicados.nombreCurso) params.append('nombreCurso', filtrosAplicados.nombreCurso);
            if (filtrosAplicados.nombreCatedratico) params.append('nombreCatedratico', filtrosAplicados.nombreCatedratico);

            const response = await API.get(`/publicaciones?${params.toString()}`);
            setPublicaciones(response.data || []);
            setError('');
        } catch (error) {
            console.error('Error cargando publicaciones:', error);
            setError('Error al cargar publicaciones');
        } finally {
            setLoading(false);
        }
    };

    const handleFiltroChange = (e) => {
        setFiltros({
            ...filtros,
            [e.target.name]: e.target.value
        });
    };

    const handleBuscar = (e) => {
        e.preventDefault();
        cargarPublicaciones(filtros);
    };

    const limpiarFiltros = () => {
        const filtrosVacios = {
            curso: '',
            catedratico: '',
            nombreCurso: '',
            nombreCatedratico: ''
        };
        setFiltros(filtrosVacios);
        cargarPublicaciones(filtrosVacios);
    };

    const handleEliminarPublicacion = (publicacionId) => {
        setPublicaciones(prevPublicaciones => 
            prevPublicaciones.filter(p => p.id_publicacion !== publicacionId)
        );
    };

    if (loading && publicaciones.length === 0) {
        return (
            <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Filtros */}
                        <form onSubmit={handleBuscar}>  
                <div className="row g-3">
                    <div className="col-md-3">
                        <label className="form-label fw-semibold">Curso</label>
                        <select 
                            className="form-select" 
                            name="curso" 
                            value={filtros.curso} 
                            onChange={handleFiltroChange}
                        >
                            <option value="">Todos los cursos</option>
                            {cursos.map(curso => (
                                <option key={curso.id_curso} value={curso.id_curso}>
                                    {curso.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="col-md-3">
                        <label className="form-label fw-semibold">Catedrático</label>
                        <select 
                            className="form-select" 
                            name="catedratico" 
                            value={filtros.catedratico} 
                            onChange={handleFiltroChange}
                        >
                            <option value="">Todos los catedráticos</option>
                            {catedraticos.map(cat => (
                                <option key={cat.id_catedratico} value={cat.id_catedratico}>
                                    {cat.nombre} {cat.apellido}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="col-md-2">
                        <label className="form-label fw-semibold">Curso</label>
                        <input
                            type="text"
                            className="form-control"
                            name="nombreCurso"
                            placeholder="Ej: Programación"
                            value={filtros.nombreCurso}
                            onChange={handleFiltroChange}
                        />
                    </div>
                    
                    <div className="col-md-2">
                        <label className="form-label fw-semibold">Catedrático</label>
                        <input
                            type="text"
                            className="form-control"
                            name="nombreCatedratico"
                            placeholder="Ej: Floriza"
                            value={filtros.nombreCatedratico}
                            onChange={handleFiltroChange}
                        />
                    </div>
                    
                    <div className="col-md-2 d-flex align-items-end">
                        <button type="submit" className="btn btn-primary flex-fill me-2">
                            <i className="bi bi-search me-1"></i> Buscar
                        </button>
                        <button 
                            type="button" 
                            className="btn btn-outline-secondary" 
                            onClick={limpiarFiltros}
                            title="Limpiar filtros"
                        >
                            <i className="bi bi-x-circle"></i>
                        </button>
                    </div>
                </div>
            </form>

            {/* Publicaciones */}
            <div className="row">
                <div className="col-12">
                    {error ? (
                        <div className="alert alert-danger">{error}</div>
                    ) : publicaciones.length === 0 ? (
                        <div className="alert alert-info">
                            No hay publicaciones para mostrar
                        </div>
                    ) : (
                        publicaciones.map(publicacion => (
                            <PublicacionCard 
                                key={publicacion.id_publicacion} 
                                publicacion={publicacion}
                                onEliminar={handleEliminarPublicacion}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;