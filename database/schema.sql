-- Ejecutar en PostgreSQL

CREATE TABLE IF NOT EXISTS roles (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS permisos (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(255)
);

INSERT INTO permisos (nombre, descripcion) VALUES
('gestionar_usuarios', 'Permite crear, editar, eliminar y administrar usuarios del sistema'),
('ver_usuarios', 'Permite listar y consultar los usuarios del sistema'),
('gestionar_roles', 'Permite crear, editar y eliminar roles del sistema'),
('gestionar_permisos', 'Permite crear, editar y eliminar permisos del sistema'),
('registrar_clientes', 'Permite registrar nuevos clientes con sus datos personales'),
('editar_clientes', 'Permite modificar la informacion de clientes registrados'),
('ver_clientes', 'Permite listar y consultar clientes registrados'),
('buscar_clientes', 'Permite buscar clientes por nombre, correo o identificador'),
('ver_perfil_cliente', 'Permite ver el perfil completo del cliente'),
('ver_historial_cliente', 'Permite consultar el historial de pagos y asistencia del cliente'),
('registrar_planes_membresia', 'Permite registrar nuevos planes de membresia'),
('editar_planes_membresia', 'Permite modificar planes de membresia existentes'),
('ver_planes_membresia', 'Permite consultar los planes de membresia disponibles'),
('registrar_membresias', 'Permite registrar la membresia de un cliente'),
('editar_membresias', 'Permite actualizar la membresia de un cliente'),
('ver_estado_membresia', 'Permite consultar el estado actual de la membresia de un cliente'),
('registrar_pagos', 'Permite registrar pagos de membresias realizados por clientes'),
('ver_pagos', 'Permite consultar el historial de pagos registrados'),
('generar_reporte_pagos', 'Permite generar reportes de pagos por cliente, fecha o plan'),
('registrar_asistencia', 'Permite registrar la asistencia de un cliente'),
('ver_asistencias', 'Permite consultar el historial de asistencias'),
('generar_reporte_asistencia', 'Permite generar reportes de asistencia por rango de fechas'),
('registrar_productos', 'Permite registrar nuevos productos del inventario'),
('editar_productos', 'Permite modificar productos existentes'),
('ver_productos', 'Permite consultar el catalogo de productos'),
('gestionar_inventario', 'Permite controlar existencias, entradas y salidas de inventario'),
('registrar_movimiento_inventario', 'Permite registrar entradas o salidas de inventario'),
('registrar_ventas', 'Permite registrar ventas de productos'),
('ver_ventas', 'Permite consultar ventas registradas'),
('generar_reporte_ventas', 'Permite generar reportes de ventas realizadas'),
('generar_reportes', 'Permite generar reportes generales del sistema'),
('ver_ingresos_mensuales', 'Permite consultar ingresos mensuales por membresias y productos'),
('gestionar_empleados', 'Permite registrar, actualizar, consultar y eliminar empleados'),
('ver_empleados', 'Permite consultar el listado de empleados')
ON CONFLICT (nombre) DO NOTHING;

CREATE TABLE IF NOT EXISTS rol_permiso (
    rol_id BIGINT NOT NULL,
    permiso_id BIGINT NOT NULL,
    PRIMARY KEY (rol_id, permiso_id),
    FOREIGN KEY (rol_id) REFERENCES roles(id),
    FOREIGN KEY (permiso_id) REFERENCES permisos(id)
);

CREATE TABLE IF NOT EXISTS usuarios (
    id BIGSERIAL PRIMARY KEY,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    foto_url TEXT,
    rol_id BIGINT NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rol_id) REFERENCES roles(id)
);

CREATE TABLE IF NOT EXISTS clientes (
    id BIGSERIAL PRIMARY KEY,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    correo VARCHAR(150),
    fecha_ingreso DATE NOT NULL,
    qr_codigo UUID NOT NULL UNIQUE,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS planes_membresia (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    duracion_dias INTEGER NOT NULL,
    precio NUMERIC(10,2) NOT NULL,
    beneficios TEXT,
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS estados (
    id BIGSERIAL PRIMARY KEY,
    estado VARCHAR(20) NOT NULL,
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS membresias_cliente (
    id BIGSERIAL PRIMARY KEY,
    cliente_id BIGINT NOT NULL,
    plan_id BIGINT NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    estado_id BIGINT NOT NULL,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (plan_id) REFERENCES planes_membresia(id),
    FOREIGN KEY (estado_id) REFERENCES estados(id)
);

CREATE TABLE IF NOT EXISTS pagos (
    id BIGSERIAL PRIMARY KEY,
    cliente_id BIGINT NOT NULL,
    membresia_cliente_id BIGINT NOT NULL,
    monto NUMERIC(10,2) NOT NULL,
    fecha_pago TIMESTAMP NOT NULL,
    observacion TEXT,
    FOREIGN KEY(cliente_id) REFERENCES clientes(id),
    FOREIGN KEY(membresia_cliente_id) REFERENCES membresias_cliente(id)
);

CREATE TABLE IF NOT EXISTS asistencias (
    id BIGSERIAL PRIMARY KEY,
    cliente_id BIGINT NOT NULL,
    fecha_hora TIMESTAMP NOT NULL,
    tipo_registro VARCHAR(20),
    FOREIGN KEY(cliente_id) REFERENCES clientes(id)
);

CREATE TABLE IF NOT EXISTS categorias (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT
);

CREATE TABLE IF NOT EXISTS productos (
    id BIGSERIAL PRIMARY KEY,
    categoria_id BIGINT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio NUMERIC(10,2) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY(categoria_id) REFERENCES categorias(id)
);

CREATE TABLE IF NOT EXISTS movimientos_inventario (
    id BIGSERIAL PRIMARY KEY,
    producto_id BIGINT NOT NULL,
    tipo VARCHAR(20) NOT NULL,
    cantidad INTEGER NOT NULL,
    fecha TIMESTAMP NOT NULL,
    observacion TEXT,
    FOREIGN KEY(producto_id) REFERENCES productos(id)
);

CREATE TABLE IF NOT EXISTS ventas (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT,
    fecha_venta TIMESTAMP NOT NULL,
    total NUMERIC(10,2) NOT NULL,
    FOREIGN KEY(usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS detalle_venta (
    id BIGSERIAL PRIMARY KEY,
    venta_id BIGINT NOT NULL,
    producto_id BIGINT NOT NULL,
    cantidad INTEGER NOT NULL,
    precio_unitario NUMERIC(10,2) NOT NULL,
    subtotal NUMERIC(10,2) NOT NULL,
    FOREIGN KEY(venta_id) REFERENCES ventas(id),
    FOREIGN KEY(producto_id) REFERENCES productos(id)
);

-- Tabla agregada para requerimiento de gestion de personal
CREATE TABLE IF NOT EXISTS empleados (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    cargo VARCHAR(100) NOT NULL,
    horario VARCHAR(100),
    contacto VARCHAR(120),
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO roles (nombre, descripcion)
VALUES ('Administrador', 'Acceso total'), ('Recepcionista', 'Operacion diaria')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO estados (estado)
VALUES ('activa'), ('inactiva')
ON CONFLICT DO NOTHING;

INSERT INTO rol_permiso (rol_id, permiso_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permisos p
WHERE r.nombre = 'Administrador'
ON CONFLICT DO NOTHING;

INSERT INTO rol_permiso (rol_id, permiso_id)
SELECT r.id, p.id
FROM roles r
JOIN permisos p ON p.nombre IN (
    'ver_usuarios',
    'registrar_clientes',
    'editar_clientes',
    'ver_clientes',
    'buscar_clientes',
    'ver_perfil_cliente',
    'ver_historial_cliente',
    'registrar_planes_membresia',
    'editar_planes_membresia',
    'ver_planes_membresia',
    'registrar_membresias',
    'editar_membresias',
    'ver_estado_membresia',
    'registrar_pagos',
    'ver_pagos',
    'registrar_asistencia',
    'ver_asistencias',
    'registrar_productos',
    'editar_productos',
    'ver_productos',
    'gestionar_inventario',
    'registrar_movimiento_inventario',
    'registrar_ventas',
    'ver_ventas',
    'generar_reporte_ventas',
    'generar_reporte_asistencia',
    'ver_ingresos_mensuales'
)
WHERE r.nombre = 'Recepcionista'
ON CONFLICT DO NOTHING;


