import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ChevronLeft,
  Car,
  Clock,
  Users,
  MapPin,
  Calendar,
  AlertCircle,
  Plus,
  Trash2,
  DollarSign,
  ShieldAlert,
} from 'lucide-react-native';
import { WheelsULogo } from '../../src/components/brand/WheelsULogo';
import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';
import { COLORS, FONTS, RADIUS, SPACING } from '../../src/constants/theme';
import { useTripsStore } from '../../src/stores/useTripsStore';
import { useAuthStore } from '../../src/stores/useAuthStore';
import { VehicleType } from '../../src/types';

const WEEKDAYS = [
  { day: 1, label: 'L' },
  { day: 2, label: 'M' },
  { day: 3, label: 'X' },
  { day: 4, label: 'J' },
  { day: 5, label: 'V' },
];

export default function NuevoViajeScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const createTrip = useTripsStore((s) => s.createTrip);

  const [origen, setOrigen] = useState('[TU BARRIO]');
  const [destino, setDestino] = useState('[TU UNIVERSIDAD]');
  const [hora, setHora] = useState('06:45');
  const [cupos, setCupos] = useState('3');
  const [aporte, setAporte] = useState('5000');
  const [vehiculo, setVehiculo] = useState<VehicleType>('Automóvil');
  const [placa, setPlaca] = useState('[PLACA]');
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [paradaExtra, setParadaExtra] = useState('Estación Central de Transmilenio');

  const toggleDay = (day: number) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day].sort());
    }
  };

  const handleSubmit = () => {
    if (!origen.trim() || !destino.trim() || !hora.trim()) {
      Alert.alert('Campos incompletos', 'Por favor llena el origen, destino y hora de salida.');
      return;
    }

    const paradasList = [
      { nombre: origen, hora_estimada: hora },
      ...(paradaExtra.trim() ? [{ nombre: paradaExtra, hora_estimada: '07:05' }] : []),
      { nombre: destino, hora_estimada: '07:30' },
    ];

    const newTrip = createTrip(
      {
        origen,
        destino,
        hora_salida: hora,
        cupos: parseInt(cupos, 10) || 3,
        aporte: parseInt(aporte, 10) || 5000,
        vehiculo,
        placa,
        recurrente: selectedDays.length > 0,
        dias_semana: selectedDays,
        paradas: paradasList,
      },
      user?.nombre || '[TU NOMBRE]'
    );

    Alert.alert(
      '¡Viaje Publicado con Éxito!',
      `Tu ruta ${origen} → ${destino} a las ${hora} ya está visible para los estudiantes de tu universidad.`,
      [
        {
          text: 'Ver en Mis Viajes',
          onPress: () => router.replace('/(tabs)/mis-viajes'),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Cabecera */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ChevronLeft size={24} color={COLORS.navy} />
            <Text style={styles.backText}>Cancelar</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Ofrecer un viaje</Text>
          <WheelsULogo size={32} />
        </View>

        {/* Banner Regulatorio de No Lucro */}
        <Card variant="yellow" style={styles.warningCard}>
          <View style={styles.warningRow}>
            <ShieldAlert size={22} color={COLORS.navy} style={{ marginRight: 8 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.warningTitle}>Aviso de no lucro universitario</Text>
              <Text style={styles.warningBody}>
                El aporte económico solicitado cubre exclusivamente una porción de gasolina y peajes. Wheels U prohíbe el uso de la plataforma con fines comerciales o de lucro.
              </Text>
            </View>
          </View>
        </Card>

        {/* Sección 1: Ruta y Horarios */}
        <Text style={styles.sectionTitle}>1. Ruta y horarios</Text>
        <Card style={styles.formCard}>
          <Text style={styles.inputLabel}>Punto de origen:</Text>
          <View style={styles.inputRow}>
            <MapPin size={18} color={COLORS.navy} style={{ marginRight: 8 }} />
            <TextInput
              style={styles.textInput}
              value={origen}
              onChangeText={setOrigen}
              placeholder="Ej: [TU BARRIO o dirección]"
            />
          </View>

          <Text style={styles.inputLabel}>Destino:</Text>
          <View style={styles.inputRow}>
            <MapPin size={18} color={COLORS.primary} style={{ marginRight: 8 }} />
            <TextInput
              style={styles.textInput}
              value={destino}
              onChangeText={setDestino}
              placeholder="Ej: [TU UNIVERSIDAD]"
            />
          </View>

          <Text style={styles.inputLabel}>Parada intermedia opcional:</Text>
          <View style={styles.inputRow}>
            <Plus size={18} color={COLORS.support} style={{ marginRight: 8 }} />
            <TextInput
              style={styles.textInput}
              value={paradaExtra}
              onChangeText={setParadaExtra}
              placeholder="Punto de encuentro secundario"
            />
          </View>

          <Text style={styles.inputLabel}>Hora de salida programada:</Text>
          <View style={styles.inputRow}>
            <Clock size={18} color={COLORS.navy} style={{ marginRight: 8 }} />
            <TextInput
              style={styles.textInput}
              value={hora}
              onChangeText={setHora}
              placeholder="06:30"
            />
          </View>
        </Card>

        {/* Sección 2: Días de Repetición Semanal */}
        <Text style={styles.sectionTitle}>2. Días de repetición semanal</Text>
        <Card style={styles.formCard}>
          <Text style={styles.fieldHint}>
            Selecciona qué días realizas este trayecto rutinario:
          </Text>
          <View style={styles.daysRow}>
            {WEEKDAYS.map((d) => {
              const active = selectedDays.includes(d.day);
              return (
                <TouchableOpacity
                  key={d.day}
                  onPress={() => toggleDay(d.day)}
                  style={[styles.dayPill, active && styles.dayPillActive]}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.dayText, active && styles.dayTextActive]}>
                    {d.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Card>

        {/* Sección 3: Cupos, Aporte y Vehículo */}
        <Text style={styles.sectionTitle}>3. Cupos, aporte y vehículo</Text>
        <Card style={styles.formCard}>
          <View style={styles.twoCols}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.inputLabel}>Cupos libres:</Text>
              <TextInput
                style={styles.textInput}
                value={cupos}
                onChangeText={setCupos}
                keyboardType="number-pad"
                placeholder="3"
              />
            </View>

            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.inputLabel}>Aporte x persona:</Text>
              <TextInput
                style={styles.textInput}
                value={aporte}
                onChangeText={setAporte}
                keyboardType="number-pad"
                placeholder="$ 5.000"
              />
            </View>
          </View>

          <Text style={styles.inputLabel}>Tipo de vehículo:</Text>
          <View style={styles.vehicleTypeRow}>
            {(['Automóvil', 'Moto', 'Camioneta'] as VehicleType[]).map((v) => {
              const isSelected = vehiculo === v;
              return (
                <TouchableOpacity
                  key={v}
                  onPress={() => setVehiculo(v)}
                  style={[styles.vTypeBtn, isSelected && styles.vTypeBtnActive]}
                >
                  <Text
                    style={[styles.vTypeText, isSelected && styles.vTypeTextActive]}
                  >
                    {v}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.inputLabel}>Placa del vehículo:</Text>
          <TextInput
            style={styles.textInput}
            value={placa}
            onChangeText={setPlaca}
            placeholder="[PLACA]"
            autoCapitalize="characters"
          />
        </Card>

        {/* Botón de Publicación */}
        <Button
          title="Publicar Viaje Compartido"
          variant="primary"
          size="lg"
          onPress={handleSubmit}
          style={styles.submitButton}
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
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.sm,
    color: COLORS.navy,
    fontWeight: '600',
    marginLeft: 2,
  },
  headerTitle: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.navy,
  },
  warningCard: {
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  warningRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  warningTitle: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.xs + 1,
    fontWeight: '700',
    color: COLORS.navy,
  },
  warningBody: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.xs,
    color: COLORS.navy,
    marginTop: 2,
    lineHeight: 16,
  },
  sectionTitle: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.navy,
    marginBottom: 8,
    marginTop: 4,
  },
  formCard: {
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  inputLabel: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.xs + 1,
    fontWeight: '600',
    color: COLORS.navy,
    marginTop: 8,
    marginBottom: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: RADIUS.md,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
    minHeight: 44,
  },
  textInput: {
    flex: 1,
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.sm,
    color: COLORS.navy,
    paddingVertical: 8,
    minHeight: 44,
  },
  fieldHint: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.xs,
    color: COLORS.support,
    marginBottom: 10,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayPill: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  dayPillActive: {
    backgroundColor: COLORS.navy,
    borderColor: COLORS.navy,
  },
  dayText: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
    color: COLORS.support,
  },
  dayTextActive: {
    color: '#FFFFFF',
  },
  twoCols: {
    flexDirection: 'row',
  },
  vehicleTypeRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 4,
  },
  vTypeBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  vTypeBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.navy,
  },
  vTypeText: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.xs,
    fontWeight: '600',
    color: COLORS.support,
  },
  vTypeTextActive: {
    color: COLORS.navy,
    fontWeight: '700',
  },
  submitButton: {
    marginTop: SPACING.md,
    marginBottom: SPACING.xl,
    shadowColor: COLORS.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
});
