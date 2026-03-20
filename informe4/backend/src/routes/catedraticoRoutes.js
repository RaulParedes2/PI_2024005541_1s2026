const express = require('express');
const router = express.Router();
const catedraticoController = require('../controllers/catedraticoController');

// Rutas públicas
router.get('/', catedraticoController.listarTodos);
router.get('/buscar', catedraticoController.buscar);
router.get('/:id', catedraticoController.obtenerPorId);

// Rutas protegidas (solo admin)
router.post('/', catedraticoController.crear);

module.exports = router;