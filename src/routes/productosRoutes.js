const express = require('express');
const controller = require('../controllers/productosController');
const auth = require('../middlewares/auth');
const authorizeRoles = require('../middlewares/authorizeRoles');

const router = express.Router();

/**
 * @swagger
 * /api/productos:
 *   get:
 *     tags: [Productos]
 *     summary: Listar productos
 *   post:
 *     tags: [Productos]
 *     summary: Registrar producto (nombre, precio, descripción)
 */
router.get('/', auth, authorizeRoles('Administrador', 'Recepcionista'), controller.list);
router.post('/', auth, authorizeRoles('Administrador', 'Recepcionista'), controller.create);
router.put('/:id', auth, authorizeRoles('Administrador', 'Recepcionista'), controller.update);

module.exports = router;
