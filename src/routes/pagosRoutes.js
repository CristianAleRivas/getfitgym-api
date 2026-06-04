const express = require('express');
const controller = require('../controllers/pagosController');
const auth = require('../middlewares/auth');
const authorizeRoles = require('../middlewares/authorizeRoles');

const router = express.Router();

/**
 * @swagger
 * /api/pagos:
 *   get:
 *     tags: [Pagos]
 *     summary: "Listar pagos (filtros: desde, hasta, cliente_id)"
 *   post:
 *     tags: [Pagos]
 *     summary: Registrar pago de membresía
 */
router.get('/', auth, authorizeRoles('Administrador', 'Recepcionista'), controller.list);
router.post('/', auth, authorizeRoles('Administrador', 'Recepcionista'), controller.create);

module.exports = router;
