const assert = require('assert');

// 1. Simulación de lógica de validación de dominios universitarios
function validateUniversityEmail(email, authorizedDomain) {
  if (!email || typeof email !== 'string') return false;
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail.includes('@')) return false;

  const domain = cleanEmail.split('@')[1];
  if (!domain) return false;

  // Debe coincidir con el dominio configurado o tener sufijo educativo
  return domain === authorizedDomain || domain.endsWith('.edu') || domain.endsWith('.edu.co');
}

// 2. Simulación de lógica de gestión de cupos y solicitudes concurrentes
function requestSeatLogic(trip, passengerId, existingRequests) {
  if (!trip) {
    return { success: false, message: 'Viaje no encontrado.' };
  }

  // Regla de sobrecupo
  if (trip.cupos_disponibles <= 0) {
    return { success: false, message: 'No quedan cupos disponibles en este viaje.' };
  }

  // Regla de solicitud duplicada
  const hasExisting = existingRequests.some(
    (r) => r.trip_id === trip.id && r.pasajero_id === passengerId && r.estado !== 'cancelada'
  );
  if (hasExisting) {
    return { success: false, message: 'Ya has enviado una solicitud para este viaje.' };
  }

  // Transacción atómica
  const updatedTrip = {
    ...trip,
    cupos_disponibles: trip.cupos_disponibles - 1,
  };

  const newRequest = {
    id: `req-${Date.now()}`,
    trip_id: trip.id,
    pasajero_id: passengerId,
    estado: 'aceptada',
  };

  return {
    success: true,
    trip: updatedTrip,
    request: newRequest,
    message: 'Cupo reservado con éxito.',
  };
}

function cancelRequestLogic(trip, request) {
  if (!trip || !request) return null;

  return {
    trip: {
      ...trip,
      cupos_disponibles: Math.min(trip.cupos, trip.cupos_disponibles + 1),
    },
    request: {
      ...request,
      estado: 'cancelada',
    },
  };
}

// 3. Simulación de validación de aporte no lucrativo
function validateAporteNonProfit(aportePorPersona, maxPermitido = 15000) {
  if (typeof aportePorPersona !== 'number') return false;
  return aportePorPersona >= 0 && aportePorPersona <= maxPermitido;
}

// 4. Suite de pruebas
console.log('🚗 Iniciando Suite de Pruebas Unitarias de Wheels U...\n');

let passedTests = 0;

// Test 1: Validación estricta de correo institucional
console.log('Test 1: Rechazo de correos personales y aceptación de dominios .edu');
assert.strictEqual(validateUniversityEmail('usuario@gmail.com', 'uni.edu.co'), false, 'Debe rechazar gmail.com');
assert.strictEqual(validateUniversityEmail('estudiante@hotmail.com', 'uni.edu.co'), false, 'Debe rechazar hotmail.com');
assert.strictEqual(validateUniversityEmail('carlos@uni.edu.co', 'uni.edu.co'), true, 'Debe aceptar dominio exacto de la universidad');
assert.strictEqual(validateUniversityEmail('sofia@unal.edu.co', 'unal.edu.co'), true, 'Debe aceptar @unal.edu.co');
assert.strictEqual(validateUniversityEmail('juan@mit.edu', 'mit.edu'), true, 'Debe aceptar .edu');
passedTests++;
console.log('✓ Test 1 superado con éxito.\n');

// Test 2: Reserva de cupo disminuye disponibilidad
console.log('Test 2: Descuento atómico de cupos al reservar');
const initialTrip = {
  id: 'trip-test',
  cupos: 3,
  cupos_disponibles: 2,
};
const res1 = requestSeatLogic(initialTrip, 'user-1', []);
assert.strictEqual(res1.success, true);
assert.strictEqual(res1.trip.cupos_disponibles, 1);
assert.strictEqual(res1.request.estado, 'aceptada');
passedTests++;
console.log('✓ Test 2 superado con éxito.\n');

// Test 3: Rechazo de solicitud duplicada
console.log('Test 3: Prevención de solicitudes dobles del mismo estudiante');
const res2 = requestSeatLogic(res1.trip, 'user-1', [res1.request]);
assert.strictEqual(res2.success, false);
assert.strictEqual(res2.message.includes('Ya has enviado una solicitud'), true);
passedTests++;
console.log('✓ Test 3 superado con éxito.\n');

// Test 4: Prevención estricta de sobrecupo (viaje lleno)
console.log('Test 4: Control de capacidad máxima (no sobrecupo)');
const fullTrip = { id: 'trip-full', cupos: 2, cupos_disponibles: 0 };
const resFull = requestSeatLogic(fullTrip, 'user-2', []);
assert.strictEqual(resFull.success, false);
assert.strictEqual(resFull.message.includes('No quedan cupos disponibles'), true);
passedTests++;
console.log('✓ Test 4 superado con éxito.\n');

// Test 5: Cancelación de solicitud devuelve el cupo
console.log('Test 5: Cancelación restituye el cupo disponible sin exceder el límite original');
const cancelResult = cancelRequestLogic(res1.trip, res1.request);
assert.strictEqual(cancelResult.trip.cupos_disponibles, 2);
assert.strictEqual(cancelResult.request.estado, 'cancelada');
passedTests++;
console.log('✓ Test 5 superado con éxito.\n');

// Test 6: Aporte solidario dentro de límites de no lucro
console.log('Test 6: Validación de aporte para cubrir gastos de combustible y peajes');
assert.strictEqual(validateAporteNonProfit(5000), true);
assert.strictEqual(validateAporteNonProfit(0), true); // Viaje solidario gratis
assert.strictEqual(validateAporteNonProfit(60000), false); // Tarifa excesiva comercial
passedTests++;
console.log('✓ Test 6 superado con éxito.\n');

console.log(`========================================`);
console.log(`🎉 TODAS LAS PRUEBAS UNITARIAS (${passedTests}/6) PASARON SATISFACTORIAMENTE`);
console.log(`========================================`);
