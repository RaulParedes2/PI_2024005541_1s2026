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