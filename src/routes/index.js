const express = require('express');

const authRoutes = require('./authRoutes');
const usuariosRoutes = require('./usuariosRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/usuarios', usuariosRoutes);

module.exports = router;
