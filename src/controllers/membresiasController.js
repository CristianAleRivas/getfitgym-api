const { PlanMembresia, MembresiaCliente, Cliente, Estado } = require('../models');
const asyncHandler = require('../utils/asyncHandler');

const listPlanes = asyncHandler(async (req, res) => {
  const data = await PlanMembresia.findAll({ order: [['id', 'DESC']] });
  res.json({ ok: true, data });
});

const createPlan = asyncHandler(async (req, res) => {
  const data = await PlanMembresia.create(req.body);
  res.status(201).json({ ok: true, data });
});

const updatePlan = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const item = await PlanMembresia.findByPk(id);

  if (!item) {
    return res.status(404).json({ ok: false, message: 'Plan no encontrado' });
  }

  await item.update(req.body);
  return res.json({ ok: true, data: item });
});

const listMembresiasCliente = asyncHandler(async (req, res) => {
  const data = await MembresiaCliente.findAll({
    include: [
      { model: Cliente, attributes: ['id', 'nombres', 'apellidos', 'correo'] },
      { model: PlanMembresia, attributes: ['id', 'nombre', 'precio', 'duracion_dias'] },
      { model: Estado, attributes: ['id', 'estado'] }
    ],
    order: [['id', 'DESC']]
  });

  res.json({ ok: true, data });
});

const createMembresiaCliente = asyncHandler(async (req, res) => {
  const data = await MembresiaCliente.create(req.body);
  res.status(201).json({ ok: true, data });
});

const updateMembresiaCliente = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const item = await MembresiaCliente.findByPk(id);

  if (!item) {
    return res.status(404).json({ ok: false, message: 'Membresía de cliente no encontrada' });
  }

  await item.update(req.body);
  return res.json({ ok: true, data: item });
});

module.exports = {
  listPlanes,
  createPlan,
  updatePlan,
  listMembresiasCliente,
  createMembresiaCliente,
  updateMembresiaCliente
};