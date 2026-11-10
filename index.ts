export type UserRole = 'pasajero' | 'conductor' | 'mixto' | 'bicicleta';

export interface University {
  id: string;
  nombre: string;
  dominio_correo: string; // Ej: '@uni.edu.co'
  ciudad: string;
}

export interface TrustedContact {
  id: string;
  user_id: string;
  nombre: string;
  telefono: string;
  relacion: string;
  notificar_inicio_viaje: boolean;
}

export interface User {
  id: string;
  nombre: string;
  correo_institucional: string;
  universidad_id: string;
  carrera: string;
  semestre: number;
  foto?: string;
  rol: UserRole;
  verificado: boolean;
  contacto_confianza?: TrustedContact;
  calificacion_promedio?: number;
  total_viajes?: number;
}

export interface TripStop {
  id: string;
  trip_id: string;
  nombre: string;
  orden: number;
  hora_estimada: string;
  lat: number;
  lng: number;
}

export type TripState = 'programado' | 'en_curso' | 'completado' | 'cancelado';
export type VehicleType = 'Automóvil' | 'Moto' | 'Camioneta';

export interface Trip {
  id: string;
  conductor_id: string;
  conductor: {
    nombre: string;
    carrera: string;
    semestre: number;
    foto?: string;
    verificado: boolean;
    calificacion?: number;
    etiquetas?: string[];
  };
  universidad_id: string;
  origen: string;
  destino: string;
  hora_salida: string;
  fecha: string; // ISO o 'Hoy', 'Mañana'
  cupos: number;
  cupos_disponibles: number;
  aporte: number; // Por persona en COP
  vehiculo: VehicleType;
  placa: string;
  recurrente: boolean;
  dias_semana: number[]; // 1=Lun ... 5=Vie
  estado: TripState;
  token_seguimiento?: string;
  lat_actual?: number;
  lng_actual?: number;
  proxima_parada?: string;
  hora_llegada_estimada?: string;
  paradas: TripStop[];
  pasajeros_confirmados: {
    id: string;
    nombre: string;
    carrera: string;
    foto?: string;
  }[];
}

export type RequestStatus = 'pendiente' | 'aceptada' | 'rechazada' | 'cancelada';

export interface TripRequest {
  id: string;
  trip_id: string;
  pasajero_id: string;
  pasajero: {
    nombre: string;
    carrera: string;
    semestre: number;
  };
  parada_id?: string;
  estado: RequestStatus;
  mensaje_pasajero?: string;
  creado_en: string;
}

export type MessageType = 'texto' | 'ubicacion' | 'alerta_sistema';

export interface Message {
  id: string;
  trip_id: string;
  autor_id: string;
  autor_nombre: string;
  es_conductor: boolean;
  texto: string;
  tipo: MessageType;
  lat?: number;
  lng?: number;
  creado_en: string;
}

export interface Review {
  id: string;
  trip_id: string;
  autor_id: string;
  autor_nombre: string;
  destinatario_id: string;
  puntuacion: number;
  etiquetas: string[];
  comentario: string;
  creado_en: string;
}

export interface CommunityGroup {
  id: string;
  universidad_id: string;
  nombre: string;
  descripcion: string;
  ruta: string;
  miembros_count: number;
  icono: string;
  es_miembro?: boolean;
}

export interface Badge {
  id: string;
  nombre: string;
  descripcion: string;
  icono: string;
  desbloqueada: boolean;
  fecha_desbloqueo?: string;
}
