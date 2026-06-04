const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Role = sequelize.define('Role', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  descripcion: { type: DataTypes.STRING(255) },
  activo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'roles' });

const Permiso = sequelize.define('Permiso', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  descripcion: { type: DataTypes.STRING(255) }
}, { tableName: 'permisos' });

const RolPermiso = sequelize.define('RolPermiso', {
  rol_id: { type: DataTypes.BIGINT, primaryKey: true },
  permiso_id: { type: DataTypes.BIGINT, primaryKey: true }
}, { tableName: 'rol_permiso' });

const Usuario = sequelize.define('Usuario', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  nombres: { type: DataTypes.STRING(100), allowNull: false },
  apellidos: { type: DataTypes.STRING(100), allowNull: false },
  correo: { type: DataTypes.STRING(150), allowNull: false, unique: true },
  foto_url: { type: DataTypes.TEXT },
  rol_id: { type: DataTypes.BIGINT, allowNull: false },
  activo: { type: DataTypes.BOOLEAN, defaultValue: true },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'usuarios' });

const Cliente = sequelize.define('Cliente', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  nombres: { type: DataTypes.STRING(100), allowNull: false },
  apellidos: { type: DataTypes.STRING(100), allowNull: false },
  telefono: { type: DataTypes.STRING(20) },
  correo: { type: DataTypes.STRING(150) },
  fecha_ingreso: { type: DataTypes.DATEONLY, allowNull: false },
  qr_codigo: { type: DataTypes.UUID, allowNull: false, unique: true },
  activo: { type: DataTypes.BOOLEAN, defaultValue: true },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'clientes' });

const PlanMembresia = sequelize.define('PlanMembresia', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(100), allowNull: false },
  duracion_dias: { type: DataTypes.INTEGER, allowNull: false },
  precio: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  beneficios: { type: DataTypes.TEXT },
  activo: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { tableName: 'planes_membresia' });

const Estado = sequelize.define('Estado', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  estado: { type: DataTypes.STRING(20), allowNull: false },
  activo: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { tableName: 'estados' });

const MembresiaCliente = sequelize.define('MembresiaCliente', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  cliente_id: { type: DataTypes.BIGINT, allowNull: false },
  plan_id: { type: DataTypes.BIGINT, allowNull: false },
  fecha_inicio: { type: DataTypes.DATEONLY, allowNull: false },
  fecha_fin: { type: DataTypes.DATEONLY, allowNull: false },
  estado_id: { type: DataTypes.BIGINT, allowNull: false }
}, { tableName: 'membresias_cliente' });

const Pago = sequelize.define('Pago', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  cliente_id: { type: DataTypes.BIGINT, allowNull: false },
  membresia_cliente_id: { type: DataTypes.BIGINT, allowNull: false },
  monto: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  fecha_pago: { type: DataTypes.DATE, allowNull: false },
  observacion: { type: DataTypes.TEXT }
}, { tableName: 'pagos' });

const Asistencia = sequelize.define('Asistencia', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  cliente_id: { type: DataTypes.BIGINT, allowNull: false },
  fecha_hora: { type: DataTypes.DATE, allowNull: false },
  tipo_registro: { type: DataTypes.STRING(20) }
}, { tableName: 'asistencias' });

const Categoria = sequelize.define('Categoria', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  descripcion: { type: DataTypes.TEXT }
}, { tableName: 'categorias' });

const Producto = sequelize.define('Producto', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  categoria_id: { type: DataTypes.BIGINT, allowNull: false },
  nombre: { type: DataTypes.STRING(100), allowNull: false },
  descripcion: { type: DataTypes.TEXT },
  precio: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  activo: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { tableName: 'productos' });

const MovimientoInventario = sequelize.define('MovimientoInventario', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  producto_id: { type: DataTypes.BIGINT, allowNull: false },
  tipo: { type: DataTypes.STRING(20), allowNull: false },
  cantidad: { type: DataTypes.INTEGER, allowNull: false },
  fecha: { type: DataTypes.DATE, allowNull: false },
  observacion: { type: DataTypes.TEXT }
}, { tableName: 'movimientos_inventario' });

const Venta = sequelize.define('Venta', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  usuario_id: { type: DataTypes.BIGINT },
  fecha_venta: { type: DataTypes.DATE, allowNull: false },
  total: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
}, { tableName: 'ventas' });

const DetalleVenta = sequelize.define('DetalleVenta', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  venta_id: { type: DataTypes.BIGINT, allowNull: false },
  producto_id: { type: DataTypes.BIGINT, allowNull: false },
  cantidad: { type: DataTypes.INTEGER, allowNull: false },
  precio_unitario: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  subtotal: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
}, { tableName: 'detalle_venta' });

const Empleado = sequelize.define('Empleado', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(120), allowNull: false },
  cargo: { type: DataTypes.STRING(100), allowNull: false },
  horario: { type: DataTypes.STRING(100) },
  contacto: { type: DataTypes.STRING(120) },
  activo: { type: DataTypes.BOOLEAN, defaultValue: true },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'empleados' });

Role.belongsToMany(Permiso, { through: RolPermiso, foreignKey: 'rol_id', otherKey: 'permiso_id' });
Permiso.belongsToMany(Role, { through: RolPermiso, foreignKey: 'permiso_id', otherKey: 'rol_id' });

Role.hasMany(Usuario, { foreignKey: 'rol_id' });
Usuario.belongsTo(Role, { foreignKey: 'rol_id' });

Cliente.hasMany(MembresiaCliente, { foreignKey: 'cliente_id' });
MembresiaCliente.belongsTo(Cliente, { foreignKey: 'cliente_id' });

PlanMembresia.hasMany(MembresiaCliente, { foreignKey: 'plan_id' });
MembresiaCliente.belongsTo(PlanMembresia, { foreignKey: 'plan_id' });

Estado.hasMany(MembresiaCliente, { foreignKey: 'estado_id' });
MembresiaCliente.belongsTo(Estado, { foreignKey: 'estado_id' });

Cliente.hasMany(Pago, { foreignKey: 'cliente_id' });
Pago.belongsTo(Cliente, { foreignKey: 'cliente_id' });
MembresiaCliente.hasMany(Pago, { foreignKey: 'membresia_cliente_id' });
Pago.belongsTo(MembresiaCliente, { foreignKey: 'membresia_cliente_id' });

Cliente.hasMany(Asistencia, { foreignKey: 'cliente_id' });
Asistencia.belongsTo(Cliente, { foreignKey: 'cliente_id' });

Categoria.hasMany(Producto, { foreignKey: 'categoria_id' });
Producto.belongsTo(Categoria, { foreignKey: 'categoria_id' });

Producto.hasMany(MovimientoInventario, { foreignKey: 'producto_id' });
MovimientoInventario.belongsTo(Producto, { foreignKey: 'producto_id' });

Usuario.hasMany(Venta, { foreignKey: 'usuario_id' });
Venta.belongsTo(Usuario, { foreignKey: 'usuario_id' });

Venta.hasMany(DetalleVenta, { foreignKey: 'venta_id' });
DetalleVenta.belongsTo(Venta, { foreignKey: 'venta_id' });

Producto.hasMany(DetalleVenta, { foreignKey: 'producto_id' });
DetalleVenta.belongsTo(Producto, { foreignKey: 'producto_id' });

module.exports = {
  sequelize,
  Role,
  Permiso,
  RolPermiso,
  Usuario,
  Cliente,
  PlanMembresia,
  Estado,
  MembresiaCliente,
  Pago,
  Asistencia,
  Categoria,
  Producto,
  MovimientoInventario,
  Venta,
  DetalleVenta,
  Empleado
};

