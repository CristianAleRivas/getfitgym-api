const { sequelize, Venta, DetalleVenta, Producto, Usuario } = require('../models');
const asyncHandler = require('../utils/asyncHandler');

const list = asyncHandler(async (req, res) => {
  const data = await Venta.findAll({
    include: [
      { model: Usuario, attributes: ['id', 'nombres', 'apellidos'] },
      {
        model: DetalleVenta,
        include: [{ model: Producto, attributes: ['id', 'nombre'] }]
      }
    ],
    order: [['fecha_venta', 'DESC']]
  });

  res.json({ ok: true, data });
});

const create = asyncHandler(async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      await t.rollback();
      return res.status(400).json({ ok: false, message: 'La venta debe incluir al menos un item' });
    }

    let total = 0;
    const detallePayload = [];

    for (const item of items) {
      const producto = await Producto.findByPk(item.producto_id, { transaction: t, lock: t.LOCK.UPDATE });

      if (!producto) {
        await t.rollback();
        return res.status(404).json({ ok: false, message: `Producto ${item.producto_id} no encontrado` });
      }

      const cantidad = Number(item.cantidad || 0);
      if (cantidad <= 0) {
        await t.rollback();
        return res.status(400).json({ ok: false, message: 'Cantidad inválida en detalle' });
      }

      if (producto.stock < cantidad) {
        await t.rollback();
        return res.status(400).json({ ok: false, message: `Stock insuficiente para ${producto.nombre}` });
      }

      const precioUnitario = Number(item.precio_unitario || producto.precio);
      const subtotal = precioUnitario * cantidad;
      total += subtotal;

      producto.stock -= cantidad;
      await producto.save({ transaction: t });

      detallePayload.push({
        producto_id: producto.id,
        cantidad,
        precio_unitario: precioUnitario,
        subtotal
      });
    }

    const venta = await Venta.create({
      usuario_id: req.user?.id || null,
      fecha_venta: new Date(),
      total
    }, { transaction: t });

    for (const detalle of detallePayload) {
      await DetalleVenta.create({
        venta_id: venta.id,
        ...detalle
      }, { transaction: t });
    }

    await t.commit();
    return res.status(201).json({ ok: true, data: { ...venta.toJSON(), items: detallePayload } });
  } catch (error) {
    await t.rollback();
    throw error;
  }
});

module.exports = { list, create };
