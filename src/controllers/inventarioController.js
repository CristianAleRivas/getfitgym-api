const { sequelize, MovimientoInventario, Producto } = require('../models');
const asyncHandler = require('../utils/asyncHandler');

const listMovimientos = asyncHandler(async (req, res) => {
  const data = await MovimientoInventario.findAll({
    include: [{ model: Producto, attributes: ['id', 'nombre', 'stock'] }],
    order: [['fecha', 'DESC']]
  });
  res.json({ ok: true, data });
});

const registrarMovimiento = asyncHandler(async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { producto_id, tipo, cantidad, observacion } = req.body;

    const producto = await Producto.findByPk(producto_id, { transaction: t, lock: t.LOCK.UPDATE });

    if (!producto) {
      await t.rollback();
      return res.status(404).json({ ok: false, message: 'Producto no encontrado' });
    }

    const qty = Number(cantidad);
    if (qty <= 0) {
      await t.rollback();
      return res.status(400).json({ ok: false, message: 'Cantidad inválida' });
    }

    if (tipo === 'entrada') {
      producto.stock += qty;
    } else if (tipo === 'salida') {
      if (producto.stock < qty) {
        await t.rollback();
        return res.status(400).json({ ok: false, message: 'Stock insuficiente' });
      }
      producto.stock -= qty;
    } else {
      await t.rollback();
      return res.status(400).json({ ok: false, message: "Tipo debe ser 'entrada' o 'salida'" });
    }

    await producto.save({ transaction: t });

    const movimiento = await MovimientoInventario.create({
      producto_id,
      tipo,
      cantidad: qty,
      fecha: new Date(),
      observacion
    }, { transaction: t });

    await t.commit();

    return res.status(201).json({
      ok: true,
      data: movimiento,
      producto: {
        id: producto.id,
        nombre: producto.nombre,
        stock: producto.stock
      }
    });
  } catch (error) {
    await t.rollback();
    throw error;
  }
});

module.exports = { listMovimientos, registrarMovimiento };
