const db = require('../config/database');

// Registrar usuario
exports.registrar = async (req, res) => {
    try {
        const { registro_academico, nombres, apellidos, correo, password } = req.body;
        
        const [result] = await db.execute(
            'INSERT INTO USUARIO (registro_academico, nombres, apellidos, correo, password, fecha_registro) VALUES (?, ?, ?, ?, ?, CURDATE())',
            [registro_academico, nombres, apellidos, correo, password]
        );
        
        res.status(201).json({ 
            message: 'Usuario registrado exitosamente',
            id: result.insertId 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const { correo, password } = req.body;
        
        const [rows] = await db.execute(
            'SELECT id_usuario, nombres, apellidos, correo FROM USUARIO WHERE correo = ? AND password = ?',
            [correo, password]
        );
        
        if (rows.length > 0) {
            res.json({ 
                message: 'Login exitoso',
                usuario: rows[0]
            });
        } else {
            res.status(401).json({ error: 'Credenciales incorrectas' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Ver perfil
exports.verPerfil = async (req, res) => {
    try {
        const { id } = req.params;
        
        const [rows] = await db.execute(
            'SELECT id_usuario, registro_academico, nombres, apellidos, correo FROM USUARIO WHERE id_usuario = ?',
            [id]
        );
        
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Buscar por registro académico
exports.buscarPorRegistro = async (req, res) => {
    try {
        const { registro } = req.query;
        
        const [rows] = await db.execute(
            'SELECT id_usuario, registro_academico, nombres, apellidos FROM USUARIO WHERE registro_academico = ?',
            [registro]
        );
        
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};