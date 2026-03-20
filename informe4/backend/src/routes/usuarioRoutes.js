const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// Rutas de usuarios
router.post('/registro', usuarioController.registrar);
router.post('/login', usuarioController.login);
router.get('/buscar', usuarioController.buscarPorRegistro);
router.post('/olvide-password', usuarioController.olvidePassword);
router.get('/:id', usuarioController.verPerfil);
router.put('/:id', usuarioController.actualizarPerfil); // Ahora sí funciona

module.exports = router;