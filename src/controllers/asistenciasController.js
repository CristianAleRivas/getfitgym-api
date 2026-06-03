const { Op } = require('sequelize');
const { Asistencia, Cliente, MembresiaCliente, Estado } = require('../models');
const asyncHandler = require('../utils/asyncHandler');

const list = asyncHandler(async (req, res) => {
  const { cliente_id, desde, hasta } = req.query;
  const where = {};

  if (cliente_id) where.cliente_id = cliente_id;

  if (desde || hasta) {
    where.fecha_hora = {};
    if (desde) where.fecha_hora[Op.gte] = new Date(desde);
    if (hasta) where.fecha_hora[Op.lte] = new Date(hasta);
  }

  const data = await Asistencia.findAll({
    where,
    include: [{ model: Cliente, attributes: ['id', 'nombres', 'apellidos'] }],
    order: [['fecha_hora', 'DESC']]
  });

  res.json({ ok: true, data });
});

const create = asyncHandler(async (req, res) => {
  const { cliente_id, tipo_registro } = req.body;

  const membresiaActiva = await MembresiaCliente.findOne({
    where: { cliente_id },
    include: [{ model: Estado, where: { estado: { [Op.iLike]: 'activa' } }, attributes: ['estado'] }],
    order: [['fecha_fin', 'DESC']]
  });

  if (!membresiaActiva) {
    return res.status(400).json({
      ok: false,
      message: 'No se puede registrar asistencia: cliente sin membresía activa'
    });
  }

  const now = new Date();
  if (new Date(membresiaActiva.fecha_fin) < now) {
    return res.status(400).json({
      ok: false,
      message: 'No se puede registrar asistencia: membresía vencida'
    });
  }

  const data = await Asistencia.create({
    cliente_id,
    tipo_registro: tipo_registro || 'entrada',
    fecha_hora: now
  });

  res.status(201).json({ ok: true, data });
});

module.exports = { list, create };
