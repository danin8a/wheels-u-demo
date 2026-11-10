import { create } from 'zustand';
import { Trip, TripRequest, TripStop, VehicleType } from '../types';
import { TRIPS_SEED } from '../services/seedData';

export type FilterType = 'Todos' | 'Hoy' | 'Mañana' | 'Regreso' | 'Moto';

interface CreateTripInput {
  origen: string;
  destino: string;
  hora_salida: string;
  fecha?: string;
  cupos: number;
  aporte: number;
  vehiculo: VehicleType;
  placa: string;
  recurrente: boolean;
  dias_semana: number[];
  paradas: { nombre: string; hora_estimada: string }[];
}

interface TripsState {
  trips: Trip[];
  filteredTrips: Trip[];
  activeFilter: FilterType;
  searchOrigen: string;
  searchDestino: string;
  activeTrip: Trip | null;
  requests: TripRequest[];
  weeklyTrips: Trip[];
  sosTriggered: boolean;
  sosAlertMessage: string | null;

  // Acciones
  setSearchOrigen: (origen: string) => void;
  setSearchDestino: (destino: string) => void;
  setActiveFilter: (filter: FilterType) => void;
  filterTrips: () => void;
  getTripById: (id: string) => Trip | undefined;
  requestSeat: (tripId: string, pasajeroId: string, pasajeroNombre: string, mensaje?: string) => { success: boolean; message: string };
  cancelRequest: (requestId: string) => void;
  createTrip: (input: CreateTripInput, conductorNombre: string) => Trip;
  setActiveLiveTrip: (trip: Trip | null) => void;
  triggerSOS: (userNombre: string, contactoTelefono: string, lat?: number, lng?: number) => { success: boolean; alertText: string };
  clearSOS: () => void;
  toggleWeeklyRecurrence: (tripId: string) => void;
}

export const useTripsStore = create<TripsState>((set, get) => ({
  trips: TRIPS_SEED,
  filteredTrips: TRIPS_SEED,
  activeFilter: 'Todos',
  searchOrigen: '',
  searchDestino: '',
  activeTrip: TRIPS_SEED[0], // Andrés P. listo para ver en curso
  requests: [],
  weeklyTrips: TRIPS_SEED.filter((t) => t.recurrente),
  sosTriggered: false,
  sosAlertMessage: null,

  setSearchOrigen: (origen: string) => {
    set({ searchOrigen: origen });
    get().filterTrips();
  },

  setSearchDestino: (destino: string) => {
    set({ searchDestino: destino });
    get().filterTrips();
  },

  setActiveFilter: (filter: FilterType) => {
    set({ activeFilter: filter });
    get().filterTrips();
  },

  filterTrips: () => {
    const { trips, activeFilter, searchOrigen, searchDestino } = get();

    let result = [...trips];

    // Filtros por texto
    if (searchOrigen.trim()) {
      const q = searchOrigen.toLowerCase().trim();
      result = result.filter((t) => t.origen.toLowerCase().includes(q) || t.paradas.some((p) => p.nombre.toLowerCase().includes(q)));
    }

    if (searchDestino.trim()) {
      const q = searchDestino.toLowerCase().trim();
      result = result.filter((t) => t.destino.toLowerCase().includes(q) || t.paradas.some((p) => p.nombre.toLowerCase().includes(q)));
    }

    // Filtro por píldoras
    if (activeFilter === 'Hoy') {
      result = result.filter((t) => t.fecha === 'Hoy');
    } else if (activeFilter === 'Mañana') {
      result = result.filter((t) => t.fecha === 'Mañana');
    } else if (activeFilter === 'Regreso') {
      // Regreso suele salir de la universidad hacia el barrio o ser en la tarde
      result = result.filter((t) => t.origen.includes('[TU UNIVERSIDAD]') || t.hora_salida >= '13:00');
    } else if (activeFilter === 'Moto') {
      result = result.filter((t) => t.vehiculo === 'Moto');
    }

    set({ filteredTrips: result });
  },

  getTripById: (id: string) => {
    return get().trips.find((t) => t.id === id);
  },

  requestSeat: (tripId: string, pasajeroId: string, pasajeroNombre: string, mensaje?: string) => {
    const { trips, requests } = get();
    const tripIndex = trips.findIndex((t) => t.id === tripId);

    if (tripIndex === -1) {
      return { success: false, message: 'Viaje no encontrado.' };
    }

    const trip = trips[tripIndex];

    // Regla de negocio: No sobrecupo
    if (trip.cupos_disponibles <= 0) {
      return { success: false, message: 'No quedan cupos disponibles en este viaje.' };
    }

    // Verificar si ya tiene solicitud
    const existingReq = requests.find((r) => r.trip_id === tripId && r.pasajero_id === pasajeroId);
    if (existingReq) {
      return { success: false, message: 'Ya has enviado una solicitud para este viaje.' };
    }

    // Crear solicitud aceptada (o pendiente)
    const newRequest: TripRequest = {
      id: `req-${Date.now()}`,
      trip_id: tripId,
      pasajero_id: pasajeroId,
      pasajero: {
        nombre: pasajeroNombre,
        carrera: 'Estudiante U',
        semestre: 5,
      },
      estado: 'aceptada',
      mensaje_pasajero: mensaje || 'Hola, me gustaría compartir este viaje.',
      creado_en: new Date().toISOString(),
    };

    const updatedTrip: Trip = {
      ...trip,
      cupos_disponibles: trip.cupos_disponibles - 1,
      pasajeros_confirmados: [
        ...trip.pasajeros_confirmados,
        { id: pasajeroId, nombre: pasajeroNombre, carrera: 'Estudiante U' },
      ],
    };

    const updatedTrips = [...trips];
    updatedTrips[tripIndex] = updatedTrip;

    set({
      trips: updatedTrips,
      requests: [...requests, newRequest],
    });

    get().filterTrips();

    return {
      success: true,
      message: `¡Cupo confirmado con ${trip.conductor.nombre}! Te espera a las ${trip.hora_salida}.`,
    };
  },

  cancelRequest: (requestId: string) => {
    const { requests, trips } = get();
    const req = requests.find((r) => r.id === requestId);
    if (!req) return;

    const updatedRequests = requests.map((r) =>
      r.id === requestId ? { ...r, estado: 'cancelada' as const } : r
    );

    const tripIndex = trips.findIndex((t) => t.id === req.trip_id);
    if (tripIndex !== -1) {
      const trip = trips[tripIndex];
      const updatedTrip: Trip = {
        ...trip,
        cupos_disponibles: Math.min(trip.cupos, trip.cupos_disponibles + 1),
        pasajeros_confirmados: trip.pasajeros_confirmados.filter((p) => p.id !== req.pasajero_id),
      };
      const updatedTrips = [...trips];
      updatedTrips[tripIndex] = updatedTrip;
      set({ trips: updatedTrips });
    }

    set({ requests: updatedRequests });
    get().filterTrips();
  },

  createTrip: (input: CreateTripInput, conductorNombre: string) => {
    const newTripId = `trip-${Date.now()}`;
    const stops: TripStop[] = input.paradas.map((p, idx) => ({
      id: `stop-${newTripId}-${idx + 1}`,
      trip_id: newTripId,
      nombre: p.nombre,
      orden: idx + 1,
      hora_estimada: p.hora_estimada,
      lat: 4.65 + idx * 0.015,
      lng: -74.08 + idx * 0.01,
    }));

    const newTrip: Trip = {
      id: newTripId,
      conductor_id: 'usr-current',
      conductor: {
        nombre: conductorNombre,
        carrera: 'Ingeniería',
        semestre: 6,
        verificado: true,
        calificacion: 5.0,
        etiquetas: ['Puntual', 'Ruta segura'],
      },
      universidad_id: 'u-1',
      origen: input.origen,
      destino: input.destino,
      hora_salida: input.hora_salida,
      fecha: input.fecha || 'Hoy',
      cupos: input.cupos,
      cupos_disponibles: input.cupos,
      aporte: input.aporte,
      vehiculo: input.vehiculo,
      placa: input.placa || '[PLACA]',
      recurrente: input.recurrente,
      dias_semana: input.dias_semana,
      estado: 'programado',
      token_seguimiento: `track_${Date.now()}`,
      proxima_parada: stops[0]?.nombre || input.origen,
      hora_llegada_estimada: '08:00',
      paradas: stops,
      pasajeros_confirmados: [],
    };

    const updated = [newTrip, ...get().trips];
    set({
      trips: updated,
      weeklyTrips: input.recurrente ? [newTrip, ...get().weeklyTrips] : get().weeklyTrips,
    });
    get().filterTrips();
    return newTrip;
  },

  setActiveLiveTrip: (trip: Trip | null) => {
    set({ activeTrip: trip });
  },

  triggerSOS: (userNombre: string, contactoTelefono: string, lat = 4.653, lng = -74.083) => {
    const timeStr = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
    const mapsLink = `https://maps.google.com/?q=${lat},${lng}`;
    const alertText = `🚨 ALERTA SOS WHEELS U: El estudiante ${userNombre} ha activado el botón de ayuda a las ${timeStr}. Ubicación actual en vivo: ${mapsLink}`;

    set({
      sosTriggered: true,
      sosAlertMessage: alertText,
    });

    return {
      success: true,
      alertText,
    };
  },

  clearSOS: () => {
    set({ sosTriggered: false, sosAlertMessage: null });
  },

  toggleWeeklyRecurrence: (tripId: string) => {
    const { trips } = get();
    const updated = trips.map((t) =>
      t.id === tripId ? { ...t, recurrente: !t.recurrente } : t
    );
    set({
      trips: updated,
      weeklyTrips: updated.filter((t) => t.recurrente),
    });
  },
}));
