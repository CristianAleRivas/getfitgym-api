const express = require('express');
const controller = require('../controllers/ventasController');
const auth = require('../middlewares/auth');
const authorizeRoles = require('../middlewares/authorizeRoles');

const router = express.Router();

/**
 * @swagger
 * /api/ventas:
 *   get:
 *     tags: [Ventas]
 *     summary: Listar ventas con detalle
 *   post:
 *     tags: [Ventas]
 *     summary: Registrar venta de productos (actualiza stock)
 */
router.get('/', auth, authorizeRoles('Administrador', 'Recepcionista'), controller.list);
router.post('/', auth, authorizeRoles('Administrador', 'Recepcionista'), controller.create);

module.exports = router;
