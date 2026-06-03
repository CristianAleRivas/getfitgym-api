const express = require('express');
const { googleAuth, googleCallback, me, logout } = require('../controllers/authController');
const auth = require('../middlewares/auth');

const router = express.Router();

/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     tags: [Auth]
 *     summary: Iniciar autenticación con Google
 *     security: []
 *     responses:
 *       302:
 *         description: Redirige a Google
 */
router.get('/google', googleAuth);

/**
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     tags: [Auth]
 *     summary: Callback de Google para generar JWT si el correo está autorizado en DB
 *     security: []
 *     responses:
 *       200:
 *         description: Login exitoso
 *       401:
 *         description: Correo no autorizado
 */
router.get('/google/callback', googleCallback);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Obtener usuario autenticado desde JWT (cookie o Bearer)
 */
router.get('/me', auth, me);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Cerrar sesión y limpiar cookie de autenticación
 */
router.post('/logout', logout);

module.exports = router;
