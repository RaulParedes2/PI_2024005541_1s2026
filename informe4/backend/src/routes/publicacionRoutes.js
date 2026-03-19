const express = require('express');
const router = express.Router();
const publicacionController = require('../controllers/publicacionController');

router.get('/', publicacionController.listarTodas);
router.post('/', publicacionController.crear);
router.get('/:id', publicacionController.obtenerPorId);
router.get('/:id/comentarios', publicacionController.obtenerComentarios);

module.exports = router;