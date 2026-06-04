const express = require('express');
const controller = require('../controllers/reportesController');
const auth = require('../middlewares/auth');
const authorizeRoles = require('../middlewares/authorizeRoles');

const router = express.Router();

/**
 * @swagger
 * /api/reportes/pagos:
 *   get:
 *     tags: [Reportes]
 *     summary: Reporte de pagos (filtros por fecha, membresía, cliente)
 */
router.get('/pagos', auth, authorizeRoles('Administrador'), controller.pagos);

/**
 * @swagger
 * /api/reportes/ventas:
 *   get:
 *     tags: [Reportes]
 *     summary: Reporte de ventas realizadas
 */
router.get('/ventas', auth, authorizeRoles('Administrador'), controller.ventas);

/**
 * @swagger
 * /api/reportes/asistencias:
 *   get:
 *     tags: [Reportes]
 *     summary: Reporte de asistencia por rango de fechas
 */
router.get('/asistencias', auth, authorizeRoles('Administrador'), controller.asistencias);

/**
 * @swagger
 * /api/reportes/ingresos-mensuales:
 *   get:
 *     tags: [Reportes]
 *     summary: Ingresos mensuales por membresías y productos
 */
router.get('/ingresos-mensuales', auth, authorizeRoles('Administrador'), controller.ingresosMensuales);

/**
 * @swagger
 * /api/reportes/productos-mas-vendidos:
 *   get:
 *     tags: [Reportes]
 *     summary: Top 3 productos más vendidos del mes actual
 */
router.get('/productos-mas-vendidos', auth, authorizeRoles('Administrador'), controller.topProductosMasVendidos);

module.exports = router;
