const express = require('express');
const router = express.Router();
const cursoController = require('../controllers/cursoController');

// Verificar que el controlador tiene las funciones necesarias
console.log('Controlador cargado:', Object.keys(cursoController));

// Rutas - asegúrate que cada una tiene su función
router.get('/', cursoController.listarTodos);
router.get('/aprobados/:usuarioId', cursoController.cursosAprobadosPorUsuario);

module.exports = router;