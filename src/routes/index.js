const express = require('express');

const authRoutes = require('./authRoutes');
const usuariosRoutes = require('./usuariosRoutes');
const clientesRoutes = require('./clientesRoutes');
const membresiasRoutes = require('./membresiasRoutes');
const empleadosRoutes = require('./empleadosRoutes');
const productosRoutes = require('./productosRoutes'); 
const asistenciasRoutes = require('./asistenciasRoutes'); 
const inventarioRoutes = require('./inventarioRoutes');
const reportesRoutes = require('./reportesRoutes'); 
const catalogosRoutes = require('./catalogosRoutes'); 
const pagosRoutes = require('./pagosRoutes');
const ventasRoutes = require('./ventasRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/usuarios', usuariosRoutes);
router.use('/clientes', clientesRoutes);
router.use('/membresias', membresiasRoutes);
router.use('/empleados', empleadosRoutes);
router.use('/productos', productosRoutes);
router.use('/asistencias', asistenciasRoutes); 
router.use('/inventario', inventarioRoutes);
router.use('/reportes', reportesRoutes); 
router.use('/catalogos', catalogosRoutes); 
router.use('/ventas', ventasRoutes);
router.use('/pagos', pagosRoutes);

module.exports = router;
