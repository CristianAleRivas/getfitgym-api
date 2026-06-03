const { Usuario, Role } = require('../models');
const asyncHandler = require('../utils/asyncHandler');

const list = asyncHandler(async (req, res) => {
  const data = await Usuario.findAll({ include: [{ model: Role, attributes: ['id', 'nombre'] }] });
  res.json({ ok: true, data });
});

const create = asyncHandler(async (req, res) => {
  const data = await Usuario.create(req.body);
  res.status(201).json({ ok: true, data });
});

const update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await Usuario.findByPk(id);

  if (!user) {
    return res.status(404).json({ ok: false, message: 'Usuario no encontrado' });
  }

  await user.update(req.body);
  return res.json({ ok: true, data: user });
});

const remove = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await Usuario.findByPk(id);

  if (!user) {
    return res.status(404).json({ ok: false, message: 'Usuario no encontrado' });
  }

  await user.destroy();
  return res.json({ ok: true, message: 'Usuario eliminado' });
});

module.exports = { list, create, update, remove };
