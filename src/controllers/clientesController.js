const crypto = require('crypto');
const { Op } = require('sequelize');
const {
  Cliente,
  MembresiaCliente,
  PlanMembresia,
  Estado,
  Pago,
  Asistencia
} = require('../models');
const asyncHandler = require('../utils/asyncHandler');

const list = asyncHandler(async (req, res) => {
  const { q } = req.query;
  const where = {};

  if (q) {
    where[Op.or] = [
      { nombres: { [Op.iLike]: `%${q}%` } },
      { apellidos: { [Op.iLike]: `%${q}%` } },
      { correo: { [Op.iLike]: `%${q}%` } },
      { telefono: { [Op.iLike]: `%${q}%` } }
    ];

    if (!Number.isNaN(Number(q))) {
      where[Op.or].push({ id: Number(q) });
    }
  }

  const data = await Cliente.findAll({
    where,
    order: [['id', 'DESC']]
  });

  res.json({ ok: true, data });
});

const create = asyncHandler(async (req, res) => {
  const payload = {
    ...req.body,
    fecha_ingreso: req.body.fecha_ingreso || new Date().toISOString().slice(0, 10),
    qr_codigo: req.body.qr_codigo || crypto.randomUUID()
  };

  const data = await Cliente.create(payload);
  res.status(201).json({ ok: true, data });
});

const update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const cliente = await Cliente.findByPk(id);

  if (!cliente) {
    return res.status(404).json({ ok: false, message: 'Cliente no encontrado' });
  }

  await cliente.update(req.body);
  return res.json({ ok: true, data: cliente });
});

const getById = asyncHandler(async (req, res) => {
  const data = await Cliente.findByPk(req.params.id);

  if (!data) {
    return res.status(404).json({ ok: false, message: 'Cliente no encontrado' });
  }

  return res.json({ ok: true, data });
});

const getProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const data = await Cliente.findByPk(id, {
    include: [
      {
        model: MembresiaCliente,
        include: [
          { model: PlanMembresia, attributes: ['id', 'nombre', 'duracion_dias', 'precio', 'beneficios'] },
          { model: Estado, attributes: ['id', 'estado'] }
        ],
        order: [['fecha_inicio', 'DESC']]
      },
      {
        model: Pago,
        order: [['fecha_pago', 'DESC']]
      },
      {
        model: Asistencia,
        order: [['fecha_hora', 'DESC']]
      }
    ]
  });

  if (!data) {
    return res.status(404).json({ ok: false, message: 'Cliente no encontrado' });
  }

  return res.json({ ok: true, data });
});

const getEstadoMembresiaActual = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const membresia = await MembresiaCliente.findOne({
    where: { cliente_id: id },
    include: [
      { model: PlanMembresia, attributes: ['id', 'nombre', 'duracion_dias', 'precio'] },
      { model: Estado, attributes: ['id', 'estado'] }
    ],
    order: [['fecha_fin', 'DESC']]
  });

  if (!membresia) {
    return res.status(404).json({ ok: false, message: 'El cliente no tiene membresías registradas' });
  }

  return res.json({ ok: true, data: membresia });
});

module.exports = {
  list,
  create,
  update,
  getById,
  getProfile,
  getEstadoMembresiaActual
};