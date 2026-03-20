const express = require('express');
const router = express.Router();
const comentarioController = require('../controllers/comentarioController');

// Rutas públicas
router.get('/publicacion/:publicacionId', comentarioController.obtenerPorPublicacion);
router.get('/:id', comentarioController.obtenerPorId);

// Rutas que requieren usuario autenticado
router.post('/', comentarioController.crear);
router.put('/:id', comentarioController.actualizar);
router.delete('/:id', comentarioController.eliminar);

module.exports = router;