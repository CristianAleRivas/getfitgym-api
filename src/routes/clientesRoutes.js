const express = require('express');
const controller = require('../controllers/clientesController');
const auth = require('../middlewares/auth');
const authorizeRoles = require('../middlewares/authorizeRoles');

const router = express.Router();

/**
 * @swagger
 * /api/clientes:
 *   get:
 *     tags: [Clientes]
 *     summary: Listar y buscar clientes (q por nombre, correo, teléfono o id)
 *   post:
 *     tags: [Clientes]
 *     summary: Registrar nuevo cliente
 */
router.get('/', auth, authorizeRoles('Administrador', 'Recepcionista'), controller.list);
router.post('/', auth, authorizeRoles('Administrador', 'Recepcionista'), controller.create);

/**
 * @swagger
 * /api/clientes/{id}:
 *   get:
 *     tags: [Clientes]
 *     summary: Obtener cliente por id
 *   put:
 *     tags: [Clientes]
 *     summary: Actualizar cliente
 */
router.get('/:id', auth, authorizeRoles('Administrador', 'Recepcionista'), controller.getById);
router.put('/:id', auth, authorizeRoles('Administrador', 'Recepcionista'), controller.update);

/**
 * @swagger
 * /api/clientes/{id}/perfil:
 *   get:
 *     tags: [Clientes]
 *     summary: Perfil completo del cliente (datos, membresías, pagos y asistencias)
 */
router.get('/:id/perfil', auth, authorizeRoles('Administrador'), controller.getProfile);

/**
 * @swagger
 * /api/clientes/{id}/estado-membresia:
 *   get:
 *     tags: [Clientes]
 *     summary: Ver estado actual de membresía de un cliente
 */
router.get('/:id/estado-membresia', auth, authorizeRoles('Administrador', 'Recepcionista'), controller.getEstadoMembresiaActual);

module.exports = router;