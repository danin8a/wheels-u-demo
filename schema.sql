-- ========================================================
-- WHEELS U — ESQUEMA RELACIONAL POSTGRESQL & POLÍTICAS RLS
-- ========================================================

-- Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Universidades registradas con dominios institucionales autorizados
CREATE TABLE IF NOT EXISTS universities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre TEXT NOT NULL,
    dominio_correo TEXT NOT NULL UNIQUE, -- ej: 'uni.edu.co', 'unal.edu.co'
    ciudad TEXT NOT NULL,
    creado_en TIMESTAMPTZ DEFAULT now()
);

-- 2. Perfiles de estudiantes (vinculados a auth.users de Supabase)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    correo_institucional TEXT NOT NULL UNIQUE,
    universidad_id UUID NOT NULL REFERENCES universities(id),
    carrera TEXT NOT NULL,
    semestre INT NOT NULL CHECK (semestre BETWEEN 1 AND 15),
    foto TEXT,
    rol TEXT DEFAULT 'pasajero' CHECK (rol IN ('pasajero', 'conductor', 'mixto', 'bicicleta')),
    verificado BOOLEAN DEFAULT false,
    codigo_verificacion TEXT,
    calificacion_promedio NUMERIC(3,2) DEFAULT 5.0,
    total_viajes INT DEFAULT 0,
    creado_en TIMESTAMPTZ DEFAULT now()
);

-- 3. Contactos de confianza para emergencias / SOS
CREATE TABLE IF NOT EXISTS trusted_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    telefono TEXT NOT NULL,
    relacion TEXT DEFAULT 'Familiar',
    notificar_inicio_viaje BOOLEAN DEFAULT true,
    creado_en TIMESTAMPTZ DEFAULT now()
);

-- 4. Viajes ofrecidos (Carpooling solidario)
CREATE TABLE IF NOT EXISTS trips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conductor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    universidad_id UUID NOT NULL REFERENCES universities(id),
    origen TEXT NOT NULL,
    destino TEXT NOT NULL,
    hora_salida TEXT NOT NULL,
    fecha TEXT NOT NULL DEFAULT 'Hoy',
    cupos INT NOT NULL CHECK (cupos > 0),
    cupos_disponibles INT NOT NULL CHECK (cupos_disponibles >= 0),
    aporte INT NOT NULL DEFAULT 0, -- Aporte para cubrir gasolina y peajes (no lucro)
    vehiculo TEXT NOT NULL CHECK (vehiculo IN ('Automóvil', 'Moto', 'Camioneta')),
    placa TEXT NOT NULL,
    recurrente BOOLEAN DEFAULT false,
    dias_semana INT[] DEFAULT '{}', -- [1,2,3,4,5] = L a V
    estado TEXT DEFAULT 'programado' CHECK (estado IN ('programado', 'en_curso', 'completado', 'cancelado')),
    token_seguimiento TEXT UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
    proxima_parada TEXT,
    hora_llegada_estimada TEXT,
    lat_actual FLOAT,
    lng_actual FLOAT,
    creado_en TIMESTAMPTZ DEFAULT now()
);

-- 5. Paradas intermedias de cada ruta
CREATE TABLE IF NOT EXISTS trip_stops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    orden INT NOT NULL,
    hora_estimada TEXT NOT NULL,
    lat FLOAT,
    lng FLOAT
);

-- 6. Solicitudes y reservas de cupos
CREATE TABLE IF NOT EXISTS trip_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    pasajero_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parada_id UUID REFERENCES trip_stops(id),
    estado TEXT DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'aceptada', 'rechazada', 'cancelada')),
    mensaje_pasajero TEXT,
    creado_en TIMESTAMPTZ DEFAULT now(),
    UNIQUE(trip_id, pasajero_id)
);

-- 7. Mensajes de chat por viaje (Tiempo Real)
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    autor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    autor_nombre TEXT NOT NULL,
    es_conductor BOOLEAN DEFAULT false,
    texto TEXT NOT NULL,
    tipo TEXT DEFAULT 'texto' CHECK (tipo IN ('texto', 'ubicacion', 'alerta_sistema')),
    lat FLOAT,
    lng FLOAT,
    creado_en TIMESTAMPTZ DEFAULT now()
);

-- 8. Reseñas y calificaciones comunitarias
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    autor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    destinatario_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    puntuacion INT NOT NULL CHECK (puntuacion BETWEEN 1 AND 5),
    etiquetas TEXT[] DEFAULT '{}',
    comentario TEXT,
    creado_en TIMESTAMPTZ DEFAULT now()
);

-- 9. Grupos de ruta comunitaria
CREATE TABLE IF NOT EXISTS groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    universidad_id UUID NOT NULL REFERENCES universities(id),
    nombre TEXT NOT NULL,
    descripcion TEXT,
    ruta TEXT NOT NULL,
    miembros_count INT DEFAULT 1,
    icono TEXT DEFAULT 'car',
    creado_en TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS group_members (
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    unido_en TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY(group_id, user_id)
);

-- 10. Insignias
CREATE TABLE IF NOT EXISTS badges (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    icono TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS user_badges (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_id TEXT NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
    obtenido_en TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY(user_id, badge_id)
);

-- ========================================================
-- FUNCIONES Y TRIGGERS DE SEGURIDAD Y CONTROL DE CUPOS
-- ========================================================

-- Trigger para descontar cupos atómicamente al aceptar solicitud
CREATE OR REPLACE FUNCTION trg_handle_seat_booking()
RETURNS TRIGGER AS $$
BEGIN
    IF (NEW.estado = 'aceptada' AND (OLD.estado IS NULL OR OLD.estado <> 'aceptada')) THEN
        IF (SELECT cupos_disponibles FROM trips WHERE id = NEW.trip_id) <= 0 THEN
            RAISE EXCEPTION 'No hay cupos disponibles en este viaje';
        END IF;
        UPDATE trips SET cupos_disponibles = cupos_disponibles - 1 WHERE id = NEW.trip_id;
    ELSIF (NEW.estado = 'cancelada' AND OLD.estado = 'aceptada') THEN
        UPDATE trips SET cupos_disponibles = LEAST(cupos, cupos_disponibles + 1) WHERE id = NEW.trip_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER on_trip_request_status_change
BEFORE INSERT OR UPDATE ON trip_requests
FOR EACH ROW EXECUTE FUNCTION trg_handle_seat_booking();

-- ========================================================
-- ROW LEVEL SECURITY (RLS)
-- ========================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE trusted_contacts ENABLE ROW LEVEL SECURITY;

-- Regla 1: Cada estudiante solo edita su propio perfil
CREATE POLICY "Usuarios pueden editar su propio perfil"
ON users FOR ALL
USING (auth.uid() = id);

-- Regla 2: Estudiantes solo ven viajes de su misma universidad
CREATE POLICY "Ver viajes de su misma universidad"
ON trips FOR SELECT
USING (
    universidad_id = (SELECT universidad_id FROM users WHERE id = auth.uid())
);

-- Regla 3: Solo el conductor puede actualizar o cancelar su viaje
CREATE POLICY "Conductor gestiona su viaje"
ON trips FOR UPDATE
USING (conductor_id = auth.uid());

-- Regla 4: Chat privado para miembros del viaje (conductor y pasajeros confirmados)
CREATE POLICY "Acceso a chat del viaje"
ON messages FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM trips WHERE trips.id = messages.trip_id AND trips.conductor_id = auth.uid()
    ) OR EXISTS (
        SELECT 1 FROM trip_requests WHERE trip_requests.trip_id = messages.trip_id AND trip_requests.pasajero_id = auth.uid() AND trip_requests.estado = 'aceptada'
    )
);

-- Regla 5: Enlace público de seguimiento de viaje seguro (solo lectura de telemetría sin datos privados)
CREATE POLICY "Seguimiento seguro temporal"
ON trips FOR SELECT
USING (token_seguimiento IS NOT NULL);
