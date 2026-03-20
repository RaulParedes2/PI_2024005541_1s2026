const db = require('../config/database');

// Crear un comentario
exports.crear = async (req, res) => {
    try {
        const { publicacion_id_publicacion, mensaje, usuario_id_usuario } = req.body;
        
        const [result] = await db.execute(
            'INSERT INTO comentario (publicacion_id_publicacion, mensaje, usuario_id_usuario, fecha) VALUES (?, ?, ?, CURDATE())',
            [publicacion_id_publicacion, mensaje, usuario_id_usuario]
        );
        
        res.status(201).json({ 
            message: 'Comentario creado exitosamente',
            id: result.insertId 
        });
    } catch (error) {
        console.error('Error creando comentario:', error);
        res.status(500).json({ error: error.message });
    }
};

// Obtener comentarios de una publicación
exports.obtenerPorPublicacion = async (req, res) => {
    try {
        const { publicacionId } = req.params;
        
        const [rows] = await db.execute(
            `SELECT c.*, u.nombres, u.apellidos 
             FROM comentario c
             JOIN usuario u ON c.usuario_id_usuario = u.id_usuario
             WHERE c.publicacion_id_publicacion = ?
             ORDER BY c.fecha DESC`,
            [publicacionId]
        );
        
        res.json(rows);
    } catch (error) {
        console.error('Error obteniendo comentarios:', error);
        res.status(500).json({ error: error.message });
    }
};

// Obtener un comentario por ID
exports.obtenerPorId = async (req, res) => {
    try {
        const { id } = req.params;
        
        const [rows] = await db.execute(
            `SELECT c.*, u.nombres, u.apellidos 
             FROM comentario c
             JOIN usuario u ON c.usuario_id_usuario = u.id_usuario
             WHERE c.id_comentario = ?`,
            [id]
        );
        
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ error: 'Comentario no encontrado' });
        }
    } catch (error) {
        console.error('Error obteniendo comentario:', error);
        res.status(500).json({ error: error.message });
    }
};

// Actualizar comentario
exports.actualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const { mensaje } = req.body;
        
        const [result] = await db.execute(
            'UPDATE comentario SET mensaje = ? WHERE id_comentario = ?',
            [mensaje, id]
        );
        
        if (result.affectedRows > 0) {
            res.json({ message: 'Comentario actualizado exitosamente' });
        } else {
            res.status(404).json({ error: 'Comentario no encontrado' });
        }
    } catch (error) {
        console.error('Error actualizando comentario:', error);
        res.status(500).json({ error: error.message });
    }
};

// Eliminar comentario
exports.eliminar = async (req, res) => {
    try {
        const { id } = req.params;
        
        const [result] = await db.execute(
            'DELETE FROM comentario WHERE id_comentario = ?',
            [id]
        );
        
        if (result.affectedRows > 0) {
            res.json({ message: 'Comentario eliminado exitosamente' });
        } else {
            res.status(404).json({ error: 'Comentario no encontrado' });
        }
    } catch (error) {
        console.error('Error eliminando comentario:', error);
        res.status(500).json({ error: error.message });
    }
};