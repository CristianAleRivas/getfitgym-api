const express = require('express');
const controller = require('../controllers/catalogosController');
const auth = require('../middlewares/auth');

const router = express.Router();

/**
 * @swagger
 * /api/catalogos:
 *   get:
 *     tags: [Catalogos]
 *     summary: Obtener catálogos base (roles, permisos, estados, categorías, métodos de pago)
 */
router.get('/', auth, controller.getAll);

module.exports = router;
