const db = require('../config/database');

// Listar todos los catedráticos
exports.listarTodos = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM catedratico ORDER BY nombre');
        res.json(rows);
    } catch (error) {
        console.error('Error listando catedráticos:', error);
        res.status(500).json({ error: error.message });
    }
};

// Obtener catedrático por ID
exports.obtenerPorId = async (req, res) => {
    try {
        const { id } = req.params;
        
        const [rows] = await db.execute(
            'SELECT * FROM catedratico WHERE id_catedratico = ?',
            [id]
        );
        
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ error: 'Catedrático no encontrado' });
        }
    } catch (error) {
        console.error('Error obteniendo catedrático:', error);
        res.status(500).json({ error: error.message });
    }
};

// Crear catedrático (solo admin)
exports.crear = async (req, res) => {
    try {
        const { nombre, apellido, departamento } = req.body;
        
        const [result] = await db.execute(
            'INSERT INTO catedratico (nombre, apellido, departamento) VALUES (?, ?, ?)',
            [nombre, apellido, departamento]
        );
        
        res.status(201).json({ 
            message: 'Catedrático creado exitosamente',
            id: result.insertId 
        });
    } catch (error) {
        console.error('Error creando catedrático:', error);
        res.status(500).json({ error: error.message });
    }
};

// Buscar catedráticos por nombre
exports.buscar = async (req, res) => {
    try {
        const { q } = req.query;
        
        const [rows] = await db.execute(
            `SELECT * FROM catedratico 
             WHERE nombre LIKE ? OR apellido LIKE ? 
             ORDER BY nombre`,
            [`%${q}%`, `%${q}%`]
        );
        
        res.json(rows);
    } catch (error) {
        console.error('Error buscando catedráticos:', error);
        res.status(500).json({ error: error.message });
    }
};