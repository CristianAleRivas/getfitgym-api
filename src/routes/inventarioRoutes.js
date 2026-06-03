const express = require('express');
const controller = require('../controllers/inventarioController');
const auth = require('../middlewares/auth');
const authorizeRoles = require('../middlewares/authorizeRoles');

const router = express.Router();

/**
 * @swagger
 * /api/inventario/movimientos:
 *   get:
 *     tags: [Inventario]
 *     summary: Listar movimientos de inventario
 *   post:
 *     tags: [Inventario]
 *     summary: Registrar entrada/salida de inventario
 */
router.get('/movimientos', auth, authorizeRoles('Administrador', 'Recepcionista'), controller.listMovimientos);
router.post('/movimientos', auth, authorizeRoles('Administrador', 'Recepcionista'), controller.registrarMovimiento);

module.exports = router;
