import { create } from 'zustand';
import { CommunityGroup, Badge, Review } from '../types';
import { GROUPS_SEED, BADGES_SEED } from '../services/seedData';

interface CommunityState {
  groups: CommunityGroup[];
  badges: Badge[];
  reviews: Review[];
  streakWeeks: number;

  // Acciones
  toggleJoinGroup: (groupId: string) => void;
  addReview: (review: Omit<Review, 'id' | 'creado_en'>) => void;
  incrementStreak: () => void;
}

const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    trip_id: 'trip-1',
    autor_id: 'p-1',
    autor_nombre: 'Camilo V.',
    destinatario_id: 'usr-andres',
    puntuacion: 5,
    etiquetas: ['Puntual', 'Música suave', 'Excelente conductor'],
    comentario: 'Súper puntual y buena conversación en la ruta al campus.',
    creado_en: 'Ayer',
  },
  {
    id: 'rev-2',
    trip_id: 'trip-2',
    autor_id: 'p-2',
    autor_nombre: 'Sofía R.',
    destinatario_id: 'usr-daniela',
    puntuacion: 5,
    etiquetas: ['Charladora', 'Ruta segura'],
    comentario: 'Maneja muy bien y el ambiente fue muy agradable.',
    creado_en: 'Hace 3 días',
  },
];

export const useCommunityStore = create<CommunityState>((set, get) => ({
  groups: GROUPS_SEED,
  badges: BADGES_SEED,
  reviews: INITIAL_REVIEWS,
  streakWeeks: 4, // 4 semanas consecutivas compartiendo viaje

  toggleJoinGroup: (groupId: string) => {
    const updated = get().groups.map((grp) => {
      if (grp.id === groupId) {
        const isMember = Boolean(grp.es_miembro);
        return {
          ...grp,
          es_miembro: !isMember,
          miembros_count: isMember ? grp.miembros_count - 1 : grp.miembros_count + 1,
        };
      }
      return grp;
    });
    set({ groups: updated });
  },

  addReview: (reviewData) => {
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      creado_en: 'Hoy',
    };
    set({ reviews: [newReview, ...get().reviews] });
  },

  incrementStreak: () => {
    set((state) => ({ streakWeeks: state.streakWeeks + 1 }));
  },
}));
