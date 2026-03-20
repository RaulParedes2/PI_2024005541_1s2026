const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ message: 'API funcionando correctamente' });
});

// Importar rutas
const usuarioRoutes = require('./src/routes/usuarioRoutes');
const cursoRoutes = require('./src/routes/cursoRoutes');
const publicacionRoutes = require('./src/routes/publicacionRoutes');
const comentarioRoutes = require('./src/routes/comentarioRoutes');
const catedraticoRoutes = require('./src/routes/catedraticoRoutes');

// Usar rutas
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/cursos', cursoRoutes);
app.use('/api/publicaciones', publicacionRoutes);
app.use('/api/comentarios', comentarioRoutes);
app.use('/api/catedraticos', catedraticoRoutes);
const PORT = process.env.PORT || 3000;

// Limpiar y reinsertar cursos
/*
app.get('/reset-cursos', async (req, res) => {
    try {
        const db = require('./src/config/database');
        
        console.log('Reseteando cursos...');
        
        // Limpiar tabla
        await db.execute('DELETE FROM curso');
        
        // Resetear auto-increment
        await db.execute('ALTER TABLE curso AUTO_INCREMENT = 1');
        
        // Insertar cursos nuevamente
        await db.execute(`
            INSERT INTO curso (nombre, creditos, semestre) VALUES 
            ('Introducción a la Programación', 4, 1),
            ('Estructuras de Datos', 4, 3),
            ('Bases de Datos 1', 4, 4),
            ('Redes de Computadoras', 4, 5),
            ('Ingeniería de Software', 4, 6)
        `);
        
        // Verificar
        const [cursos] = await db.execute('SELECT * FROM curso');
        res.json({ 
            message: 'Cursos reseteados correctamente',
            total: cursos.length,
            cursos: cursos 
        });
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});*/
// ENDPOINT TEMPORAL PARA PROBAR ACTUALIZACIÓN
app.post('/api/test-update-password', async (req, res) => {
    try {
        const db = require('./src/config/database');
        const { registro_academico, correo, new_password } = req.body;
        
        console.log('Test - Datos:', { registro_academico, correo, new_password });
        
        // Actualizar directamente
        const [result] = await db.execute(
            'UPDATE usuario SET password = ? WHERE registro_academico = ? AND correo = ?',
            [new_password, registro_academico, correo]
        );
        
        console.log('Test - Resultado:', result);
        
        res.json({
            message: 'Test completado',
            affectedRows: result.affectedRows,
            data: { registro_academico, correo, new_password }
        });
    } catch (error) {
        console.error('Test - Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});