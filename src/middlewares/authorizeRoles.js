function authorizeRoles(...rolesPermitidos) {
  return (req, res, next) => {
    const userRole = req.user?.rol;

    if (!userRole || !rolesPermitidos.includes(userRole)) {
      return res.status(403).json({
        ok: false,
        message: 'No tienes permisos para esta acción'
      });
    }

    return next();
  };
}


module.exports = authorizeRoles;
