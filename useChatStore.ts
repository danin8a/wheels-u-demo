import { create } from 'zustand';
import { Message, MessageType } from '../types';

interface ChatState {
  messagesByTrip: Record<string, Message[]>;
  unreadCount: Record<string, number>;
  latestNotification: { title: string; body: string } | null;

  // Acciones
  sendMessage: (tripId: string, autorId: string, autorNombre: string, esConductor: boolean, texto: string, tipo?: MessageType, lat?: number, lng?: number) => void;
  sendQuickReply: (tripId: string, autorId: string, autorNombre: string, esConductor: boolean, quickText: string) => void;
  sendLocation: (tripId: string, autorId: string, autorNombre: string, esConductor: boolean, lat: number, lng: number) => void;
  clearNotification: () => void;
}

const INITIAL_MESSAGES: Record<string, Message[]> = {
  'trip-1': [
    {
      id: 'm-1',
      trip_id: 'trip-1',
      autor_id: 'usr-andres',
      autor_nombre: 'Andrés P. (Conductor)',
      es_conductor: true,
      texto: '¡Hola a todos! Mañana salgo puntual 6:30 desde la estación principal.',
      tipo: 'texto',
      creado_en: '06:10',
    },
    {
      id: 'm-2',
      trip_id: 'trip-1',
      autor_id: 'p-1',
      autor_nombre: 'Camilo V.',
      es_conductor: false,
      texto: '¡Listo Andrés! Ya estoy cerca del punto de encuentro.',
      tipo: 'texto',
      creado_en: '06:18',
    },
  ],
};

export const useChatStore = create<ChatState>((set, get) => ({
  messagesByTrip: INITIAL_MESSAGES,
  unreadCount: {},
  latestNotification: null,

  sendMessage: (tripId, autorId, autorNombre, esConductor, texto, tipo = 'texto', lat, lng) => {
    const timeStr = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      trip_id: tripId,
      autor_id: autorId,
      autor_nombre: autorNombre,
      es_conductor: esConductor,
      texto,
      tipo,
      lat,
      lng,
      creado_en: timeStr,
    };

    const currentMessages = get().messagesByTrip[tripId] || [];
    set({
      messagesByTrip: {
        ...get().messagesByTrip,
        [tripId]: [...currentMessages, newMessage],
      },
      latestNotification: {
        title: `Nuevo mensaje en viaje`,
        body: `${autorNombre}: ${texto}`,
      },
    });
  },

  sendQuickReply: (tripId, autorId, autorNombre, esConductor, quickText) => {
    get().sendMessage(tripId, autorId, autorNombre, esConductor, quickText, 'texto');
  },

  sendLocation: (tripId, autorId, autorNombre, esConductor, lat, lng) => {
    get().sendMessage(
      tripId,
      autorId,
      autorNombre,
      esConductor,
      `📍 Ubicación compartida en vivo (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
      'ubicacion',
      lat,
      lng
    );
  },

  clearNotification: () => set({ latestNotification: null }),
}));
