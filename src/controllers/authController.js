const passport = require('passport');
const { createToken } = require('../services/tokenService');

function getCookieName() {
  return process.env.JWT_COOKIE_NAME || 'getfit_token';
}

function getCookieOptions() {
  const sameSite = process.env.JWT_COOKIE_SAMESITE || 'lax';

  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite,
    maxAge: Number(process.env.JWT_COOKIE_MAX_AGE_MS || 24 * 60 * 60 * 1000)
  };
}

function wantsHtml(req) {
  const accept = req.headers.accept || '';
  return accept.includes('text/html');
}

function withErrorQuery(baseUrl, message) {
  const separator = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${separator}error=${encodeURIComponent(message)}`;
}

function googleAuth(req, res, next) {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.status(500).json({
      ok: false,
      message: 'Configura GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET para habilitar el login con Google'
    });
  }

  return passport.authenticate('google', { scope: ['profile', 'email'], session: false })(req, res, next);
}

function googleCallback(req, res, next) {
  return passport.authenticate('google', { session: false }, (error, user, info) => {
    const successRedirect = process.env.FRONTEND_LOGIN_SUCCESS_URL || process.env.FRONTEND_URL;
    const errorRedirect = process.env.FRONTEND_LOGIN_ERROR_URL || process.env.FRONTEND_URL;

    if (error) {
      if (errorRedirect && wantsHtml(req)) {
        return res.redirect(withErrorQuery(errorRedirect, error.message || 'Error de autenticacion'));
      }

      return next(error);
    }

    if (!user) {
      const message = info?.message || 'No autorizado';

      if (errorRedirect && wantsHtml(req)) {
        return res.redirect(withErrorQuery(errorRedirect, message));
      }

      return res.status(401).json({
        ok: false,
        message
      });
    }

    const token = createToken({
      id: user.id,
      correo: user.correo,
      rol: user.Role?.nombre || null,
      nombres: user.nombres,
      apellidos: user.apellidos
    });

    res.cookie(getCookieName(), token, getCookieOptions());

    if (successRedirect && wantsHtml(req)) {
      return res.redirect(successRedirect);
    }

    return res.json({
      ok: true,
      token,
      usuario: {
        id: user.id,
        nombres: user.nombres,
        apellidos: user.apellidos,
        correo: user.correo,
        rol: user.Role?.nombre || null,
        foto_url: user.foto_url || null
      }
    });
  })(req, res, next);
}

function me(req, res) {
  return res.json({
    ok: true,
    data: {
      id: req.user?.id || null,
      correo: req.user?.correo || null,
      rol: req.user?.rol || null,
      nombres: req.user?.nombres || null,
      apellidos: req.user?.apellidos || null
    }
  });
}

function logout(req, res) {
  res.clearCookie(getCookieName(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.JWT_COOKIE_SAMESITE || 'lax'
  });

  return res.json({ ok: true, message: 'Sesion cerrada' });
}

module.exports = {
  googleAuth,
  googleCallback,
  me,
  logout
};
