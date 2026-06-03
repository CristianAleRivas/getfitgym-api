const express = require('express');

const authRoutes = require('./authRoutes');
const usuariosRoutes = require('./usuariosRoutes');
const clientesRoutes = require('./clientesRoutes');
const membresiasRoutes = require('./membresiasRoutes');
const empleadosRoutes = require('./empleadosRoutes');
const productosRoutes = require('./productosRoutes'); 

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/usuarios', usuariosRoutes);
router.use('/clientes', clientesRoutes);
router.use('/membresias', membresiasRoutes);
router.use('/empleados', empleadosRoutes);
router.use('/productos', productosRoutes);

module.exports = router;
