const db = require('../config/database');

// Registrar usuario
exports.registrar = async (req, res) => {
    try {
        const { registro_academico, nombres, apellidos, correo, password } = req.body;
        
        const [result] = await db.execute(
            'INSERT INTO usuario (registro_academico, nombres, apellidos, correo, password, fecha_registro) VALUES (?, ?, ?, ?, ?, CURDATE())',
            [registro_academico, nombres, apellidos, correo, password]
        );
        
        res.status(201).json({ 
            message: 'Usuario registrado exitosamente',
            id: result.insertId 
        });
    } catch (error) {
        console.error('Error registrando usuario:', error);
        res.status(500).json({ error: error.message });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const { correo, password } = req.body;
        
        const [rows] = await db.execute(
            'SELECT id_usuario, nombres, apellidos, correo FROM usuario WHERE correo = ? AND password = ?',
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
        console.error('Error en login:', error);
        res.status(500).json({ error: error.message });
    }
};

// Ver perfil
exports.verPerfil = async (req, res) => {
    try {
        const { id } = req.params;
        
        const [rows] = await db.execute(
            'SELECT id_usuario, registro_academico, nombres, apellidos, correo FROM usuario WHERE id_usuario = ?',
            [id]
        );
        
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error('Error viendo perfil:', error);
        res.status(500).json({ error: error.message });
    }
};

// Buscar por registro académico
exports.buscarPorRegistro = async (req, res) => {
    try {
        const { registro } = req.query;
        
        console.log('Buscando usuario con registro:', registro);
        
        const [rows] = await db.execute(
            'SELECT id_usuario, registro_academico, nombres, apellidos, correo FROM usuario WHERE registro_academico = ?',
            [registro]
        );
        
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error('Error en buscarPorRegistro:', error);
        res.status(500).json({ error: error.message });
    }
};

// Recuperar contraseña
exports.olvidePassword = async (req, res) => {
    try {
        const { registro_academico, correo, new_password } = req.body;

        console.log(' Datos recibidos:', { registro_academico, correo, new_password });

        // Verificar que el usuario existe con ese registro y correo
        const [rows] = await db.execute(
            'SELECT id_usuario, nombres, correo FROM usuario WHERE registro_academico = ? AND correo = ?',
            [registro_academico, correo]
        );

        console.log('Usuario encontrado:', rows);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Actualizar contraseña
        const [result] = await db.execute(
            'UPDATE usuario SET password = ? WHERE registro_academico = ? AND correo = ?',
            [new_password, registro_academico, correo]
        );

        console.log('Resultado de actualización:', result);

        if (result.affectedRows > 0) {
            res.json({ message: 'Contraseña actualizada exitosamente' });
        } else {
            res.status(500).json({ error: 'No se pudo actualizar la contraseña' });
        }
    } catch (error) {
        console.error('Error en olvidePassword:', error);
        res.status(500).json({ error: error.message });
    }
};
// Actualizar perfil
exports.actualizarPerfil = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombres, apellidos, correo } = req.body;
        
        const [result] = await db.execute(
            'UPDATE usuario SET nombres = ?, apellidos = ?, correo = ? WHERE id_usuario = ?',
            [nombres, apellidos, correo, id]
        );
        
        if (result.affectedRows > 0) {
            res.json({ message: 'Perfil actualizado exitosamente' });
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error('Error actualizando perfil:', error);
        res.status(500).json({ error: error.message });
    }
};