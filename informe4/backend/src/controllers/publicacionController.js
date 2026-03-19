const db = require('../config/database');

// Obtener todas las publicaciones
exports.listarTodas = async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT p.*, 
                   u.nombres, u.apellidos, u.registro_academico,
                   c.nombre as curso_nombre,
                   cat.nombre as catedratico_nombre, cat.apellido as catedratico_apellido
            FROM PUBLICACION p
            JOIN USUARIO u ON p.usuario_id_usuario = u.id_usuario
            LEFT JOIN CURSO c ON p.curso_id_curso = c.id_curso
            LEFT JOIN CATEDRATICO cat ON p.catedratico_id_catedratico = cat.id_catedratico
            ORDER BY p.fecha_publicacion DESC
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear publicación
exports.crear = async (req, res) => {
    try {
        const { usuario_id_usuario, catedratico_id_catedratico, curso_id_curso, mensaje } = req.body;
        
        const [result] = await db.execute(
            'INSERT INTO PUBLICACION (usuario_id_usuario, catedratico_id_catedratico, curso_id_curso, mensaje, fecha_publicacion) VALUES (?, ?, ?, ?, CURDATE())',
            [usuario_id_usuario, catedratico_id_catedratico || null, curso_id_curso || null, mensaje]
        );
        
        res.status(201).json({ 
            message: 'Publicación creada exitosamente',
            id: result.insertId 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener publicación por ID
exports.obtenerPorId = async (req, res) => {
    try {
        const { id } = req.params;
        
        const [rows] = await db.execute(`
            SELECT p.*, 
                   u.nombres, u.apellidos, u.registro_academico,
                   c.nombre as curso_nombre,
                   cat.nombre as catedratico_nombre, cat.apellido as catedratico_apellido
            FROM PUBLICACION p
            JOIN USUARIO u ON p.usuario_id_usuario = u.id_usuario
            LEFT JOIN CURSO c ON p.curso_id_curso = c.id_curso
            LEFT JOIN CATEDRATICO cat ON p.catedratico_id_catedratico = cat.id_catedratico
            WHERE p.id_publicacion = ?
        `, [id]);
        
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ error: 'Publicación no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener comentarios de una publicación
exports.obtenerComentarios = async (req, res) => {
    try {
        const { id } = req.params;
        
        const [rows] = await db.execute(`
            SELECT c.*, u.nombres, u.apellidos
            FROM COMENTARIO c
            JOIN USUARIO u ON c.usuario_id_usuario = u.id_usuario
            WHERE c.publicacion_id_publicacion = ?
            ORDER BY c.fecha DESC
        `, [id]);
        
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};