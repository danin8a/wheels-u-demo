# 🚗 Wheels U — Carpooling Universitario Seguro y Solidario

Aplicación móvil construida con **React Native + Expo**, **TypeScript**, **Expo Router** y preparada para **Supabase** (PostgreSQL, Realtime y Row Level Security).

Diseñada especialmente para conectar a estudiantes universitarios de la misma institución que se desplazan al campus, permitiendo encontrar o publicar viajes compartidos y dividiendo de manera justa y transparente los gastos de gasolina y peajes (sin lucro comercial).

---

## 🎨 Identidad Visual y Sistema de Diseño

* **Paleta Oficial**:
  * **Amarillo Principal**: `#FFC93C` (Energía, optimismo y acento)
  * **Azul Marino Primario**: `#0E2A5E` (Confianza institucional y contraste)
  * **Fondo Suave**: `#F3F5FA` (Lectura descansada y moderna)
  * **Blanco Puro**: `#FFFFFF` (Superficie de tarjetas elevadas)
  * **Azul de Apoyo**: `#4A5B80` (Subtítulos, íconos y metadata)
* **Tipografía**: `Space Grotesk` (Regular, Medium, SemiBold, Bold) con fallback nativo del sistema.
* **Logotipo Oficial**: Pin de geolocalización azul marino con una "U" geométrica en amarillo, destello circular blanco en la esquina superior derecha y un aro elíptico en la base. Implementado en componente vectorial nativo SVG (`src/components/brand/WheelsULogo.tsx`).
* **Ergonomía y Accesibilidad**:
  * Botones con altura táctil mínima de **48 px** (superando el estándar WCAG de 44 px).
  * Textos con tamaño mínimo de **12 px**.
  * Contrastes certificados conformes a WCAG AA / AAA.

---

## 📱 Pantallas y Flujos Construidos

1. **Bienvenida & Onboarding (`app/index.tsx`)**:
   - Cabecera con imagotipo Wheels U y pin característico.
   - Acceso con correo institucional o modo demostración instantáneo.
   - Píldora visible de aviso de economía colaborativa sin lucro.
2. **Autenticación Universitaria (`app/(auth)/login.tsx` y `verificar-codigo.tsx`)**:
   - Selector de universidad (`[TU UNIVERSIDAD]`, Nacional, Andes, Javeriana).
   - Validación regex de dominios institucionales (`@*.edu*`, `@uni.edu.co`).
   - Envío y comprobación de código OTP de 6 dígitos.
3. **Buscar Viaje & Dashboard (`app/(tabs)/index.tsx`)**:
   - Tarjeta de búsqueda de alto contraste con campos *"Desde: [TU BARRIO]"* y *"Hacia: [TU UNIVERSIDAD]"* con botón intercambiador.
   - Píldoras de filtro rápido: `Todos`, `Hoy`, `Mañana`, `Regreso`, `Moto`.
   - Tarjetas de viaje con conductor verificado, carrera, semestre, hora, cupos libres y aporte solidario.
   - Botón *"Pedir cupo"* con reserva instantánea y modal de confirmación.
4. **Detalle del Viaje (`app/viaje/[id].tsx`)**:
   - Ficha completa del conductor con avatar, verificación y etiquetas de convivencia (*Música suave*, *Puntual*, *Sin fumar*).
   - Cronograma e itinerario visual de paradas intermedias con horarios estimados.
   - Lista de pasajeros confirmados y datos de vehículo/placa `[PLACA]`.
   - Botón directo para chatear con el conductor.
5. **Ofrecer un Viaje (`app/viaje/nuevo.tsx`)**:
   - Asistente para publicar ruta con origen, destino y paradas intermedias.
   - Selector de días de repetición semanal (L a V).
   - Configuración de cupos, vehículo y cálculo de aporte sugerido.
   - **Aviso legal obligatorio**: Cartel visible que aclara que el aporte cubre exclusivamente gastos operativos de combustible y peajes.
6. **Mis Viajes & Agenda Semanal (`app/(tabs)/mis-viajes.tsx`)**:
   - Selector interactivo de días de la semana (L 9, M 10, X 11, J 12, V 13).
   - Bloques de horario para trayectos matutinos de ida, huecos de mediodía, regreso por la tarde y grupos nocturnos seguros.
   - Botón destacado: *"Repetir estos viajes cada semana"*.
7. **Cabina en Vivo / Viaje en Curso (`app/viaje-en-curso/[id].tsx`)**:
   - Mapa con trayecto estilizado, paradas intermedias circulares amarillas y destino azul marino.
   - Próxima parada y telemetría de hora estimada de llegada (ETA).
   - **Botón "Compartir mi viaje"**: Genera un enlace temporal cifrado para que acudientes o amigos monitoreen la ruta en tiempo real.
   - **Botón de Ayuda / SOS**: Dispara notificación inmediata con coordenadas geográficas al contacto de confianza.
8. **Chat Grupal en Tiempo Real (`app/chat/[id].tsx`)**:
   - Canal de mensajería instantánea para conductor y pasajeros.
   - Barra de respuestas rápidas de 1 toque (*"Ya voy en camino 🏃"*, *"Llego en 5 min ⏰"*, *"Estoy en la parada 📍"*).
   - Botón para enviar pin de ubicación GPS en tiempo real.
9. **Comunidad, Insignias y Rachas (`app/(tabs)/comunidad.tsx`)**:
   - Contador de racha de semanas consecutivas compartiendo viaje (con indicador de ahorro de CO₂).
   - Grupos de ruta comunitaria (ej. `[BARRIO NORTE] → [CAMPUS]`).
   - Sistema de insignias universitarias (*Primer viaje*, *Puntual*, *Guía de la U*, *Eco Wheels*).
   - Tablero de reseñas y calificaciones entre compañeros.
10. **Perfil y Seguridad (`app/(tabs)/perfil.tsx`)**:
    - Ficha del estudiante con carrera, semestre y correo institucional.
    - Selector dinámico de modo de desplazamiento: *Pasajero*, *Conductor*, *Bicicleta*.
    - Gestión de contacto de confianza (nombre, teléfono y switch de auto-notificación).
    - Botón de prueba de SOS y enlace a términos de no lucro.

---

## 🗄️ Modelo de Base de Datos (PostgreSQL en Supabase)

El esquema relacional completo con Row Level Security (RLS) se encuentra detallado en el archivo:
`supabase/schema.sql`.

Incluye:
* `universities` con restricción única de dominios educativos autorizados.
* `users` asociado a `auth.users` con verificación institucional.
* `trusted_contacts` para el módulo de SOS y seguridad familiar.
* `trips` y `trip_stops` con control estricto de cupos y token de monitoreo en vivo.
* `trip_requests` con estado (`pendiente`, `aceptada`, `rechazada`, `cancelada`).
* `messages` con soporte para mensajes de texto y coordenadas GPS.
* `reviews`, `groups`, `group_members`, `badges` y `user_badges`.
* **Políticas RLS**: Aislamiento por universidad y restricción de modificación a propietarios.

---

## 🚀 Instrucciones para Ejecutar el Proyecto

### 1. Prerrequisitos
* Node.js v18+ o v20+ LTS
* npm o yarn

### 2. Instalación de Dependencias
```bash
cd scratch/wheels-u
npm install
```

### 3. Ejecución en Modo Web (Previsualización inmediata)
```bash
npm run web
# O iniciar Expo:
npx expo start
```
Abre `http://localhost:8081` en tu navegador.

### 4. Ejecución en Dispositivos Móviles (iOS / Android)
Descarga la app **Expo Go** en tu teléfono y escanea el código QR que genera la terminal tras ejecutar:
```bash
npx expo start
```

### 5. Ejecutar la Suite de Pruebas Unitarias
El proyecto cuenta con pruebas automáticas que validan la lógica crítica de negocio (control de sobrecupo, validación de correos institucionales, restitución de asientos al cancelar y límites de no lucro):
```bash
node test/wheels-u.test.js
```

---

## 🔒 Reglas de Negocio y Seguridad Implementadas

1. **Solo estudiantes verificados**: No es posible reservar ni ofrecer viajes sin un correo institucional `@*.edu*` válido y código de 6 dígitos.
2. **Capacidad y prevención de sobrecupo**: Las transacciones de solicitud descuentan cupos atómicamente y rechazan solicitudes una vez que `cupos_disponibles === 0`.
3. **No duplicidad**: Un pasajero no puede enviar múltiples solicitudes concurrentes al mismo viaje.
4. **Filosofía de no lucro**: Todos los flujos de publicación y búsqueda reiteran de forma explícita que las tarifas corresponden exclusivamente a división equitativa de gastos de combustible y peajes.
5. **Seguridad SOS y Enlaces Temporales**: Los enlaces de seguimiento expiran al concluir el viaje y no exponen datos privados sensibles del estudiante ni del conductor.
