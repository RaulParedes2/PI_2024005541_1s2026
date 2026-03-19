const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.post('/registro', usuarioController.registrar);
router.post('/login', usuarioController.login);
router.get('/buscar', usuarioController.buscarPorRegistro);
router.get('/:id', usuarioController.verPerfil);

module.exports = router;