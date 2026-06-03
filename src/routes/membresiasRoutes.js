const express = require('express');
const controller = require('../controllers/membresiasController');
const auth = require('../middlewares/auth');
const authorizeRoles = require('../middlewares/authorizeRoles');

const router = express.Router();

/**
 * @swagger
 * /api/membresias/planes:
 *   get:
 *     tags: [Membresias]
 *     summary: Listar planes de membresía
 *   post:
 *     tags: [Membresias]
 *     summary: Registrar plan de membresía (vigencia, beneficios, precio)
 */
router.get('/planes', auth, authorizeRoles('Administrador', 'Recepcionista'), controller.listPlanes);
router.post('/planes', auth, authorizeRoles('Administrador'), controller.createPlan);
router.put('/planes/:id', auth, authorizeRoles('Administrador'), controller.updatePlan);

/**
 * @swagger
 * /api/membresias/clientes:
 *   get:
 *     tags: [Membresias]
 *     summary: Listar membresías contratadas
 *   post:
 *     tags: [Membresias]
 *     summary: Registrar inscripción/membresía de cliente
 */
router.get('/clientes', auth, authorizeRoles('Administrador', 'Recepcionista'), controller.listMembresiasCliente);
router.post('/clientes', auth, authorizeRoles('Administrador', 'Recepcionista'), controller.createMembresiaCliente);
router.put('/clientes/:id', auth, authorizeRoles('Administrador', 'Recepcionista'), controller.updateMembresiaCliente);

module.exports = router;