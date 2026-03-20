const express = require('express');
const router = express.Router();
const cursoController = require('../controllers/cursoController');

/*// Verificar que el controlador tiene las funciones necesarias
console.log('Controlador cargado:', Object.keys(cursoController));

// Rutas - asegúrate que cada una tiene su función
router.get('/', cursoController.listarTodos);
router.get('/aprobados/:usuarioId', cursoController.cursosAprobadosPorUsuario);

module.exports = router;*/

// Rutas de cursos
router.get('/', cursoController.listarTodos);
router.get('/aprobados/:usuarioId', cursoController.cursosAprobadosPorUsuario);
router.get('/creditos/:usuarioId', cursoController.totalCreditos);

// Rutas para gestionar cursos aprobados (requieren autenticación)
router.post('/aprobados', cursoController.agregarCursoAprobado);
router.put('/aprobados/:id', cursoController.actualizarNota);
router.delete('/aprobados/:id', cursoController.eliminarCursoAprobado);

module.exports = router;