const { Producto, Categoria } = require('../models');
const asyncHandler = require('../utils/asyncHandler');

const list = asyncHandler(async (req, res) => {
  const data = await Producto.findAll({
    include: [{ model: Categoria, attributes: ['id', 'nombre'] }],
    order: [['id', 'DESC']]
  });
  res.json({ ok: true, data });
});

const create = asyncHandler(async (req, res) => {
  const data = await Producto.create(req.body);
  res.status(201).json({ ok: true, data });
});

const update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const item = await Producto.findByPk(id);

  if (!item) {
    return res.status(404).json({ ok: false, message: 'Producto no encontrado' });
  }

  await item.update(req.body);
  return res.json({ ok: true, data: item });
});

module.exports = { list, create, update };
