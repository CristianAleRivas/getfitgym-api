const { Op, fn, col, literal } = require('sequelize');
const {
  sequelize,
  Pago,
  MembresiaCliente,
  PlanMembresia,
  Cliente,
  Asistencia,
  Venta,
  DetalleVenta,
  Producto
} = require('../models');
const asyncHandler = require('../utils/asyncHandler');

function rangoFechas(desde, hasta) {
  const where = {};
  if (desde || hasta) {
    if (desde) where[Op.gte] = new Date(desde);
    if (hasta) where[Op.lte] = new Date(hasta);
  }
  return where;
}

function rangoMesActual() {
  const ahora = new Date();
  const inicio = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
  const fin = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0, 23, 59, 59, 999);

  return { inicio, fin, mes: ahora.getMonth() + 1, anio: ahora.getFullYear() };
}

const pagos = asyncHandler(async (req, res) => {
  const { desde, hasta, cliente_id, plan_id } = req.query;
  const wherePago = {};
  const whereMembresia = {};

  if (cliente_id) wherePago.cliente_id = cliente_id;
  if (plan_id) whereMembresia.plan_id = plan_id;

  const rango = rangoFechas(desde, hasta);
  if (Object.keys(rango).length) wherePago.fecha_pago = rango;

  const data = await Pago.findAll({
    where: wherePago,
    include: [
      { model: Cliente, attributes: ['id', 'nombres', 'apellidos', 'correo'] },
      {
        model: MembresiaCliente,
        where: whereMembresia,
        required: !!plan_id,
        include: [{ model: PlanMembresia, attributes: ['id', 'nombre'] }]
      }
    ],
    order: [['fecha_pago', 'DESC']]
  });

  res.json({ ok: true, data });
});

const ventas = asyncHandler(async (req, res) => {
  const { desde, hasta } = req.query;
  const where = {};
  const rango = rangoFechas(desde, hasta);
  if (Object.keys(rango).length) where.fecha_venta = rango;

  const data = await Venta.findAll({
    where,
    include: [
      {
        model: DetalleVenta,
        include: [{ model: Producto, attributes: ['id', 'nombre'] }]
      }
    ],
    order: [['fecha_venta', 'DESC']]
  });

  res.json({ ok: true, data });
});

const asistencias = asyncHandler(async (req, res) => {
  const { desde, hasta, cliente_id } = req.query;
  const where = {};

  const rango = rangoFechas(desde, hasta);
  if (Object.keys(rango).length) where.fecha_hora = rango;
  if (cliente_id) where.cliente_id = cliente_id;

  const data = await Asistencia.findAll({
    where,
    include: [{ model: Cliente, attributes: ['id', 'nombres', 'apellidos'] }],
    order: [['fecha_hora', 'DESC']]
  });

  res.json({ ok: true, data });
});

const ingresosMensuales = asyncHandler(async (req, res) => {
  const ingresosMembresias = await Pago.findAll({
    attributes: [
      [fn('date_trunc', 'month', col('fecha_pago')), 'mes'],
      [fn('sum', col('monto')), 'total']
    ],
    group: [literal("date_trunc('month', \"fecha_pago\")")],
    order: [[literal('mes'), 'ASC']],
    raw: true
  });

  const ingresosVentas = await Venta.findAll({
    attributes: [
      [fn('date_trunc', 'month', col('fecha_venta')), 'mes'],
      [fn('sum', col('total')), 'total']
    ],
    group: [literal("date_trunc('month', \"fecha_venta\")")],
    order: [[literal('mes'), 'ASC']],
    raw: true
  });

  const normalizar = (rows) => rows.map((r) => ({ mes: r.mes, total: Number(r.total) }));

  res.json({
    ok: true,
    data: {
      membresias: normalizar(ingresosMembresias),
      productos: normalizar(ingresosVentas)
    }
  });
});

const topProductosMasVendidos = asyncHandler(async (req, res) => {
  const { inicio, fin, mes, anio } = rangoMesActual();

  const data = await DetalleVenta.findAll({
    attributes: [
      'producto_id',
      [fn('SUM', col('DetalleVenta.cantidad')), 'total_vendidos']
    ],
    include: [
      {
        model: Producto,
        attributes: ['id', 'nombre', 'descripcion', 'precio', 'stock', 'categoria_id', 'activo']
      },
      {
        model: Venta,
        attributes: [],
        required: true,
        where: {
          fecha_venta: {
            [Op.gte]: inicio,
            [Op.lte]: fin
          }
        }
      }
    ],
    group: [
      'DetalleVenta.producto_id',
      'Producto.id'
    ],
    order: [[literal('total_vendidos'), 'DESC']],
    limit: 3,
    raw: false
  });

  const top = data.map((item, index) => ({
    top: index + 1,
    total_vendidos: Number(item.getDataValue('total_vendidos')),
    producto: item.Producto
  }));

  return res.json({
    ok: true,
    data: {
      periodo: { mes, anio },
      top
    }
  });
});

module.exports = {
  pagos,
  ventas,
  asistencias,
  ingresosMensuales,
  topProductosMasVendidos
};
