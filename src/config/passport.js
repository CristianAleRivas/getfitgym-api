const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { Usuario, Role } = require('../models');

function configurePassport() {
  const hasGoogleConfig = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET;

  if (!hasGoogleConfig) {
    return;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const correo = profile.emails?.[0]?.value;

          if (!correo) {
            return done(null, false, { message: 'No se pudo obtener correo de Google' });
          }

          const usuario = await Usuario.findOne({
            where: { correo, activo: true },
            include: [{ model: Role, attributes: ['nombre'] }]
          });

          if (!usuario) {
            return done(null, false, { message: 'Correo no autorizado en la base de datos' });
          }

          if (!usuario.foto_url && profile.photos?.[0]?.value) {
            await usuario.update({ foto_url: profile.photos[0].value });
          }

          return done(null, usuario);
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );
}

module.exports = configurePassport;

