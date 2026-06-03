const express = require('express');
const controller = require('../controllers/usuariosController');
const auth = require('../middlewares/auth');
const authorizeRoles = require('../middlewares/authorizeRoles');

const router = express.Router();

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     tags: [Usuarios]
 *     summary: Listar usuarios del sistema
 *   post:
 *     tags: [Usuarios]
 *     summary: Registrar nuevo usuario del sistema
 */
router.get('/', auth, authorizeRoles('Administrador'), controller.list);
router.post('/', auth, authorizeRoles('Administrador'), controller.create);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   put:
 *     tags: [Usuarios]
 *     summary: Actualizar usuario
 *   delete:
 *     tags: [Usuarios]
 *     summary: Eliminar usuario
 */
router.put('/:id', auth, authorizeRoles('Administrador'), controller.update);
router.delete('/:id', auth, authorizeRoles('Administrador'), controller.remove);

module.exports = router;
