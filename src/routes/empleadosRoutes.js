const express = require('express');
const controller = require('../controllers/empleadosController');
const auth = require('../middlewares/auth');
const authorizeRoles = require('../middlewares/authorizeRoles');

const router = express.Router();

/**
 * @swagger
 * /api/empleados:
 *   get:
 *     tags: [Empleados]
 *     summary: Listar empleados
 *   post:
 *     tags: [Empleados]
 *     summary: Registrar empleado
 */
router.get('/', auth, authorizeRoles('Administrador'), controller.list);
router.post('/', auth, authorizeRoles('Administrador'), controller.create);
router.put('/:id', auth, authorizeRoles('Administrador'), controller.update);
router.delete('/:id', auth, authorizeRoles('Administrador'), controller.remove);

module.exports = router;
