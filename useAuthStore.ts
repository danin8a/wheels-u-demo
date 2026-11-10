import { create } from 'zustand';
import { User, University, TrustedContact, UserRole } from '../types';
import { CURRENT_USER_SEED, UNIVERSIDADES_CONFIG } from '../services/seedData';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  universities: University[];
  selectedUniversity: University | null;
  pendingEmail: string;
  verificationCodeSent: boolean;
  error: string | null;
  isLoading: boolean;

  // Acciones
  selectUniversity: (uni: University) => void;
  sendVerificationEmail: (email: string) => Promise<{ success: boolean; message: string }>;
  verifyCode: (code: string) => Promise<boolean>;
  logout: () => void;
  updateRole: (role: UserRole) => void;
  updateTrustedContact: (contact: TrustedContact) => void;
  validateUniversityEmail: (email: string) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: CURRENT_USER_SEED, // Sesión inicial lista para probar
  isAuthenticated: true,
  universities: UNIVERSIDADES_CONFIG,
  selectedUniversity: UNIVERSIDADES_CONFIG[0],
  pendingEmail: '',
  verificationCodeSent: false,
  error: null,
  isLoading: false,

  selectUniversity: (uni) => set({ selectedUniversity: uni }),

  validateUniversityEmail: (email: string) => {
    const { selectedUniversity } = get();
    if (!selectedUniversity) return false;
    const cleanEmail = email.trim().toLowerCase();
    // Validar que el dominio corresponda a una universidad autorizada
    return cleanEmail.endsWith(`@${selectedUniversity.dominio_correo}`) ||
           cleanEmail.endsWith('.edu') ||
           cleanEmail.endsWith('.edu.co');
  },

  sendVerificationEmail: async (email: string) => {
    set({ isLoading: true, error: null });
    const cleanEmail = email.trim().toLowerCase();

    // Simulación de retraso de red
    await new Promise((r) => setTimeout(r, 600));

    const isValid = get().validateUniversityEmail(cleanEmail);
    if (!isValid) {
      const { selectedUniversity } = get();
      const domainHint = selectedUniversity ? `@${selectedUniversity.dominio_correo}` : '@universidad.edu.co';
      set({
        isLoading: false,
        error: `Debes usar tu correo institucional válido (${domainHint}).`,
      });
      return { success: false, message: 'Correo institucional inválido' };
    }

    set({
      isLoading: false,
      pendingEmail: cleanEmail,
      verificationCodeSent: true,
      error: null,
    });
    return { success: true, message: 'Código de 6 dígitos enviado a tu correo institucional.' };
  },

  verifyCode: async (code: string) => {
    set({ isLoading: true, error: null });
    await new Promise((r) => setTimeout(r, 500));

    // Código de prueba válido: '123456' o cualquier código de 6 dígitos para testing ágil
    if (code.length === 6) {
      const updatedUser: User = {
        ...CURRENT_USER_SEED,
        correo_institucional: get().pendingEmail || CURRENT_USER_SEED.correo_institucional,
        verificado: true,
      };

      set({
        user: updatedUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return true;
    } else {
      set({
        isLoading: false,
        error: 'El código debe tener 6 dígitos.',
      });
      return false;
    }
  },

  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
      verificationCodeSent: false,
      pendingEmail: '',
    });
  },

  updateRole: (role: UserRole) => {
    const currentUser = get().user;
    if (currentUser) {
      set({ user: { ...currentUser, rol: role } });
    }
  },

  updateTrustedContact: (contact: TrustedContact) => {
    const currentUser = get().user;
    if (currentUser) {
      set({ user: { ...currentUser, contacto_confianza: contact } });
    }
  },
}));
