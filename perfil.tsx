import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  User,
  ShieldCheck,
  Phone,
  AlertTriangle,
  LogOut,
  Car,
  Bike,
  UserCheck,
  Star,
  Settings,
  ChevronRight,
  HeartHandshake,
} from 'lucide-react-native';
import { WheelsULogo } from '../../src/components/brand/WheelsULogo';
import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';
import { Badge } from '../../src/components/ui/Badge';
import { COLORS, FONTS, RADIUS, SPACING, TOUCH_TARGET } from '../../src/constants/theme';
import { useAuthStore } from '../../src/stores/useAuthStore';
import { useTripsStore } from '../../src/stores/useTripsStore';
import { UserRole } from '../../src/types';

export default function PerfilScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const updateRole = useAuthStore((s) => s.updateRole);
  const updateTrustedContact = useAuthStore((s) => s.updateTrustedContact);
  const logout = useAuthStore((s) => s.logout);
  const triggerSOS = useTripsStore((s) => s.triggerSOS);

  const [contactName, setContactName] = useState(user?.contacto_confianza?.nombre || 'Mamá / Acudiente');
  const [contactPhone, setContactPhone] = useState(user?.contacto_confianza?.telefono || '+57 310 000 0000');
  const [notifyOnStart, setNotifyOnStart] = useState(user?.contacto_confianza?.notificar_inicio_viaje ?? true);
  const [isEditingContact, setIsEditingContact] = useState(false);

  const handleSaveContact = () => {
    if (!contactName.trim() || !contactPhone.trim()) {
      Alert.alert('Error', 'Completa los datos del contacto de confianza.');
      return;
    }
    updateTrustedContact({
      id: user?.contacto_confianza?.id || 'tc-1',
      user_id: user?.id || 'usr-current',
      nombre: contactName,
      telefono: contactPhone,
      relacion: 'Familiar',
      notificar_inicio_viaje: notifyOnStart,
    });
    setIsEditingContact(false);
    Alert.alert('Éxito', 'Contacto de confianza actualizado correctamente.');
  };

  const handleTestSOS = () => {
    Alert.alert(
      '🚨 Prueba de Botón de Ayuda / SOS',
      `Se enviará tu ubicación en tiempo real a tu contacto de confianza: ${contactName} (${contactPhone}). ¿Deseas disparar la alerta de prueba?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Enviar SOS de Prueba',
          style: 'destructive',
          onPress: () => {
            const res = triggerSOS(user?.nombre || '[TU NOMBRE]', contactPhone);
            Alert.alert('SOS Enviado', res.alertText);
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Estás seguro de que deseas salir de tu cuenta institucional?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar sesión',
        style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/');
        },
      },
    ]);
  };

  const rolesList: { role: UserRole; label: string; icon: any }[] = [
    { role: 'pasajero', label: 'Pasajero', icon: UserCheck },
    { role: 'conductor', label: 'Conductor', icon: Car },
    { role: 'bicicleta', label: 'Bicicleta', icon: Bike },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Cabecera */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mi Perfil</Text>
          <WheelsULogo size={32} />
        </View>

        {/* Tarjeta de Estudiante */}
        <Card variant="navy" style={styles.profileCard}>
          <View style={styles.profileTop}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.nombre.slice(0, 2).toUpperCase() || 'TU'}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.studentName}>{user?.nombre || '[TU NOMBRE]'}</Text>
                <ShieldCheck size={18} color={COLORS.primary} style={{ marginLeft: 6 }} />
              </View>
              <Text style={styles.studentProgram}>
                {user?.carrera || 'Ingeniería'} • Semestre {user?.semestre || 6}
              </Text>
              <Text style={styles.studentEmail}>
                {user?.correo_institucional || 'estudiante@uni.edu.co'}
              </Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>⭐ {user?.calificacion_promedio || 4.9}</Text>
              <Text style={styles.statLabel}>Calificación</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{user?.total_viajes || 18}</Text>
              <Text style={styles.statLabel}>Viajes hechos</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>100%</Text>
              <Text style={styles.statLabel}>Puntualidad</Text>
            </View>
          </View>
        </Card>

        {/* Selector de Rol */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Modo de desplazamiento actual</Text>
          <View style={styles.rolesContainer}>
            {rolesList.map((item) => {
              const isCurrent = (user?.rol || 'pasajero') === item.role;
              const IconComp = item.icon;
              return (
                <TouchableOpacity
                  key={item.role}
                  onPress={() => updateRole(item.role)}
                  style={[styles.roleCard, isCurrent && styles.roleCardActive]}
                  activeOpacity={0.8}
                >
                  <IconComp
                    size={22}
                    color={isCurrent ? COLORS.navy : COLORS.support}
                  />
                  <Text
                    style={[styles.roleText, isCurrent && styles.roleTextActive]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Contacto de Confianza & Botón de Ayuda SOS */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Contacto de Confianza (SOS)</Text>
            <TouchableOpacity onPress={() => setIsEditingContact(!isEditingContact)}>
              <Text style={styles.editActionText}>
                {isEditingContact ? 'Cancelar' : 'Editar'}
              </Text>
            </TouchableOpacity>
          </View>

          <Card style={styles.contactCard}>
            {isEditingContact ? (
              <View style={styles.editForm}>
                <Text style={styles.fieldLabel}>Nombre del contacto:</Text>
                <TextInput
                  style={styles.textInput}
                  value={contactName}
                  onChangeText={setContactName}
                  placeholder="Ej: Mamá, Papá, Hermano"
                />

                <Text style={styles.fieldLabel}>Teléfono móvil con WhatsApp:</Text>
                <TextInput
                  style={styles.textInput}
                  value={contactPhone}
                  onChangeText={setContactPhone}
                  keyboardType="phone-pad"
                  placeholder="+57 300 000 0000"
                />

                <Button
                  title="Guardar Contacto"
                  variant="primary"
                  size="sm"
                  onPress={handleSaveContact}
                  style={{ marginTop: 12 }}
                />
              </View>
            ) : (
              <View>
                <View style={styles.contactRow}>
                  <View style={styles.contactIcon}>
                    <HeartHandshake size={20} color={COLORS.navy} />
                  </View>
                  <View style={styles.contactDetails}>
                    <Text style={styles.contactName}>{contactName}</Text>
                    <Text style={styles.contactPhone}>{contactPhone}</Text>
                  </View>
                </View>

                <View style={styles.switchRow}>
                  <Text style={styles.switchLabel}>
                    Notificar automáticamente al iniciar cada viaje
                  </Text>
                  <Switch
                    value={notifyOnStart}
                    onValueChange={setNotifyOnStart}
                    trackColor={{ false: '#CBD5E1', true: COLORS.primary }}
                    thumbColor={notifyOnStart ? COLORS.navy : '#F8FAFC'}
                  />
                </View>
              </View>
            )}

            {/* Botón de Ayuda / SOS */}
            <TouchableOpacity
              onPress={handleTestSOS}
              style={styles.sosButton}
              activeOpacity={0.85}
            >
              <AlertTriangle size={18} color="#FFFFFF" />
              <Text style={styles.sosButtonText}>
                Probar Botón de Ayuda / SOS
              </Text>
            </TouchableOpacity>
          </Card>
        </View>

        {/* Seguridad y Reportes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seguridad y Comunidad</Text>
          <Card style={styles.securityCard}>
            <TouchableOpacity
              style={styles.securityRow}
              onPress={() => Alert.alert('Reportar', 'Formulario para reportar incidentes o conductores/pasajeros que no cumplan las normas de la universidad.')}
            >
              <Text style={styles.securityText}>Reportar una anomalía o usuario</Text>
              <ChevronRight size={16} color={COLORS.support} />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity
              style={styles.securityRow}
              onPress={() => Alert.alert('Términos y No Lucro', 'Wheels U opera estrictamente bajo el esquema de aportes no lucrativos entre miembros de la misma comunidad educativa.')}
            >
              <Text style={styles.securityText}>Términos y directriz de no lucro</Text>
              <ChevronRight size={16} color={COLORS.support} />
            </TouchableOpacity>
          </Card>
        </View>

        {/* Cerrar Sesión */}
        <Button
          title="Cerrar sesión institucional"
          variant="outline"
          icon={<LogOut size={16} color={COLORS.navy} />}
          onPress={handleLogout}
          style={styles.logoutBtn}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  headerTitle: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.hero - 4,
    fontWeight: '700',
    color: COLORS.navy,
  },
  profileCard: {
    padding: SPACING.lg,
    borderRadius: RADIUS.card,
    marginBottom: SPACING.xl,
  },
  profileTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.navy,
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  studentName: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  studentProgram: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.xs,
    color: '#A3B8D8',
    marginTop: 2,
  },
  studentEmail: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.xs,
    color: COLORS.primary,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statLabel: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.xs,
    color: '#A3B8D8',
    marginTop: 2,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.navy,
    marginBottom: SPACING.sm,
  },
  editActionText: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.xs,
    fontWeight: '700',
    color: COLORS.navy,
  },
  rolesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  roleCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#DFE5F0',
    borderRadius: RADIUS.md,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: TOUCH_TARGET.minHeight,
  },
  roleCardActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.navy,
  },
  roleText: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.xs,
    fontWeight: '600',
    color: COLORS.support,
    marginTop: 4,
  },
  roleTextActive: {
    color: COLORS.navy,
    fontWeight: '700',
  },
  contactCard: {
    padding: SPACING.md,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EBF1FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  contactDetails: {
    flex: 1,
  },
  contactName: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
    color: COLORS.navy,
  },
  contactPhone: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.xs,
    color: COLORS.support,
    marginTop: 2,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F3F8',
  },
  switchLabel: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.xs,
    color: COLORS.navy,
    flex: 1,
    marginRight: 8,
  },
  sosButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.danger,
    paddingVertical: 12,
    borderRadius: RADIUS.lg,
    marginTop: 10,
    minHeight: 44,
  },
  sosButtonText: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.xs + 1,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 6,
  },
  editForm: {
    paddingVertical: 4,
  },
  fieldLabel: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.xs,
    color: COLORS.support,
    fontWeight: '600',
    marginTop: 6,
  },
  textInput: {
    fontFamily: FONTS.family,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: RADIUS.md,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: FONTS.sizes.sm,
    marginTop: 4,
    minHeight: 44,
  },
  securityCard: {
    padding: 0,
    overflow: 'hidden',
  },
  securityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
  },
  securityText: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.xs + 1,
    fontWeight: '600',
    color: COLORS.navy,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F3F8',
  },
  logoutBtn: {
    marginTop: SPACING.md,
    marginBottom: SPACING.xl,
    borderColor: '#CBD5E1',
  },
});
