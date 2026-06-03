function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || 'Error interno del servidor';

  if (process.env.NODE_ENV !== 'production') {
    return res.status(status).json({
      ok: false,
      message,
      stack: err.stack
    });
  }

  return res.status(status).json({
    ok: false,
    message
  });
}


module.exports = errorHandler;
