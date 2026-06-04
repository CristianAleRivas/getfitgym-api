const { Role, Permiso, Estado, Categoria } = require('../models');
const asyncHandler = require('../utils/asyncHandler');

const getAll = asyncHandler(async (req, res) => {
  const [roles, permisos, estados, categorias] = await Promise.all([
    Role.findAll({ order: [['id', 'ASC']] }),
    Permiso.findAll({ order: [['id', 'ASC']] }),
    Estado.findAll({ order: [['id', 'ASC']] }),
    Categoria.findAll({ order: [['id', 'ASC']] })
  ]);

  res.json({
    ok: true,
    data: { roles, permisos, estados, categorias }
  });
});

module.exports = { getAll };
