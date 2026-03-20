const db = require('../config/database');

// Obtener todos los cursos
exports.listarTodos = async (req, res) => {
    try {
        console.log('Ejecutando listarTodos...');
        const [rows] = await db.execute('SELECT * FROM curso ORDER BY id_curso');
        console.log('Cursos encontrados:', rows.length);
        console.log('Primer curso:', rows[0]);
        console.log('Último curso:', rows[rows.length-1]);
        res.json(rows);
    } catch (error) {
        console.error('Error en listarTodos:', error);
        res.status(500).json({ error: error.message });
    }
};

// Obtener cursos aprobados por usuario
exports.cursosAprobadosPorUsuario = async (req, res) => {
    try {
        console.log('Ejecutando cursosAprobadosPorUsuario...');
        const { usuarioId } = req.params;
        console.log('Usuario ID:', usuarioId);
        
        const [rows] = await db.execute(
            `SELECT c.*, ca.nota, ca.fecha_aprobacion 
             FROM curso_aprobado ca 
             JOIN curso c ON ca.curso_id_curso = c.id_curso 
             WHERE ca.usuario_id_usuario = ?`,
            [usuarioId]
        );
        
        console.log('Cursos aprobados encontrados:', rows.length);
        res.json(rows);
    } catch (error) {
        console.error('Error en cursosAprobadosPorUsuario:', error);
        res.status(500).json({ error: error.message });
    }
};
// Agregar curso aprobado
exports.agregarCursoAprobado = async (req, res) => {
    try {
        const { usuario_id_usuario, curso_id_curso, nota, fecha_aprobacion } = req.body;
        
        // Verificar si ya existe
        const [existente] = await db.execute(
            'SELECT * FROM curso_aprobado WHERE usuario_id_usuario = ? AND curso_id_curso = ?',
            [usuario_id_usuario, curso_id_curso]
        );
        
        if (existente.length > 0) {
            return res.status(400).json({ error: 'El curso ya está registrado como aprobado' });
        }
        
        const [result] = await db.execute(
            'INSERT INTO curso_aprobado (usuario_id_usuario, curso_id_curso, nota, fecha_aprobacion) VALUES (?, ?, ?, ?)',
            [usuario_id_usuario, curso_id_curso, nota, fecha_aprobacion || new Date()]
        );
        
        res.status(201).json({ 
            message: 'Curso aprobado registrado exitosamente',
            id: result.insertId 
        });
    } catch (error) {
        console.error('Error registrando curso aprobado:', error);
        res.status(500).json({ error: error.message });
    }
};

// Eliminar curso aprobado
exports.eliminarCursoAprobado = async (req, res) => {
    try {
        const { id } = req.params;
        
        const [result] = await db.execute(
            'DELETE FROM curso_aprobado WHERE id_curso_aprobado = ?',
            [id]
        );
        
        if (result.affectedRows > 0) {
            res.json({ message: 'Curso aprobado eliminado exitosamente' });
        } else {
            res.status(404).json({ error: 'Registro no encontrado' });
        }
    } catch (error) {
        console.error('Error eliminando curso aprobado:', error);
        res.status(500).json({ error: error.message });
    }
};

// Actualizar nota de curso aprobado
exports.actualizarNota = async (req, res) => {
    try {
        const { id } = req.params;
        const { nota } = req.body;
        
        const [result] = await db.execute(
            'UPDATE curso_aprobado SET nota = ? WHERE id_curso_aprobado = ?',
            [nota, id]
        );
        
        if (result.affectedRows > 0) {
            res.json({ message: 'Nota actualizada exitosamente' });
        } else {
            res.status(404).json({ error: 'Registro no encontrado' });
        }
    } catch (error) {
        console.error('Error actualizando nota:', error);
        res.status(500).json({ error: error.message });
    }
};

// Obtener total de créditos de un usuario
exports.totalCreditos = async (req, res) => {
    try {
        const { usuarioId } = req.params;
        
        const [rows] = await db.execute(
            `SELECT SUM(c.creditos) as total_creditos
             FROM curso_aprobado ca
             JOIN curso c ON ca.curso_id_curso = c.id_curso
             WHERE ca.usuario_id_usuario = ?`,
            [usuarioId]
        );
        
        res.json({ 
            usuario_id: usuarioId,
            total_creditos: rows[0].total_creditos || 0 
        });
    } catch (error) {
        console.error('Error calculando créditos:', error);
        res.status(500).json({ error: error.message });
    }
};