const { Op } = require('sequelize');
const { Pago, Cliente, MembresiaCliente } = require('../models');
const asyncHandler = require('../utils/asyncHandler');

const list = asyncHandler(async (req, res) => {
  const { desde, hasta, cliente_id, membresia_cliente_id } = req.query;
  const where = {};

  if (cliente_id) where.cliente_id = cliente_id;
  if (membresia_cliente_id) where.membresia_cliente_id = membresia_cliente_id;

  if (desde || hasta) {
    where.fecha_pago = {};
    if (desde) where.fecha_pago[Op.gte] = new Date(desde);
    if (hasta) where.fecha_pago[Op.lte] = new Date(hasta);
  }

  const data = await Pago.findAll({
    where,
    include: [
      { model: Cliente, attributes: ['id', 'nombres', 'apellidos', 'correo'] },
      { model: MembresiaCliente, attributes: ['id', 'fecha_inicio', 'fecha_fin'] }
    ],
    order: [['fecha_pago', 'DESC']]
  });

  res.json({ ok: true, data });
});

const create = asyncHandler(async (req, res) => {
  const { metodo_pago, concepto, observacion } = req.body;

  let observacionFinal = observacion || null;
  if (metodo_pago || concepto) {
    observacionFinal = JSON.stringify({
      metodo_pago: metodo_pago || null,
      concepto: concepto || null,
      observacion: observacion || null
    });
  }

  const payload = {
    ...req.body,
    fecha_pago: req.body.fecha_pago || new Date(),
    observacion: observacionFinal
  };

  const data = await Pago.create(payload);
  res.status(201).json({ ok: true, data });
});

module.exports = { list, create };
