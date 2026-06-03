const { Empleado } = require('../models');
const asyncHandler = require('../utils/asyncHandler');

const list = asyncHandler(async (req, res) => {
  const data = await Empleado.findAll({ order: [['id', 'DESC']] });
  res.json({ ok: true, data });
});

const create = asyncHandler(async (req, res) => {
  const data = await Empleado.create(req.body);
  res.status(201).json({ ok: true, data });
});

const update = asyncHandler(async (req, res) => {
  const item = await Empleado.findByPk(req.params.id);

  if (!item) {
    return res.status(404).json({ ok: false, message: 'Empleado no encontrado' });
  }

  await item.update(req.body);
  return res.json({ ok: true, data: item });
});

const remove = asyncHandler(async (req, res) => {
  const item = await Empleado.findByPk(req.params.id);

  if (!item) {
    return res.status(404).json({ ok: false, message: 'Empleado no encontrado' });
  }

  await item.destroy();
  return res.json({ ok: true, message: 'Empleado eliminado' });
});

module.exports = { list, create, update, remove };
