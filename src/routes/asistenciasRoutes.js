const express = require('express');
const controller = require('../controllers/asistenciasController');
const auth = require('../middlewares/auth');
const authorizeRoles = require('../middlewares/authorizeRoles');

const router = express.Router();

/**
 * @swagger
 * /api/asistencias:
 *   get:
 *     tags: [Asistencias]
 *     summary: "Historial de asistencias (filtros: cliente_id, desde, hasta)"
 *   post:
 *     tags: [Asistencias]
 *     summary: Registrar asistencia (solo clientes con membresía activa)
 */
router.get('/', auth, authorizeRoles('Administrador', 'Recepcionista'), controller.list);
router.post('/', auth, authorizeRoles('Administrador', 'Recepcionista'), controller.create);

module.exports = router;
