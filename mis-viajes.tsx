import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Calendar,
  Clock,
  Car,
  CheckCircle,
  Repeat,
  AlertCircle,
  ChevronRight,
  Shield,
  MessageCircle,
} from 'lucide-react-native';
import { WheelsULogo } from '../../src/components/brand/WheelsULogo';
import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';
import { Badge } from '../../src/components/ui/Badge';
import { COLORS, FONTS, RADIUS, SPACING } from '../../src/constants/theme';
import { useTripsStore } from '../../src/stores/useTripsStore';

const DAYS_OF_WEEK = [
  { key: 1, label: 'L', date: '9', name: 'Lunes' },
  { key: 2, label: 'M', date: '10', name: 'Martes' },
  { key: 3, label: 'X', date: '11', name: 'Miércoles' },
  { key: 4, label: 'J', date: '12', name: 'Jueves' },
  { key: 5, label: 'V', date: '13', name: 'Viernes' },
];

export default function MisViajesScreen() {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [isWeeklyRepeating, setIsWeeklyRepeating] = useState<boolean>(true);
  const trips = useTripsStore((s) => s.trips);
  const requests = useTripsStore((s) => s.requests);

  const activeTrip = trips[0]; // Viaje principal de Andrés P.

  const handleToggleWeekly = () => {
    setIsWeeklyRepeating(!isWeeklyRepeating);
    Alert.alert(
      'Recurrencia Semanal',
      !isWeeklyRepeating
        ? 'Tus horarios de ida y vuelta se repetirán automáticamente de lunes a viernes.'
        : 'Recurrencia semanal pausada.'
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Cabecera con Logo */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mi semana</Text>
          <WheelsULogo size={32} />
        </View>

        {/* Selector de Días Lunes - Viernes */}
        <View style={styles.daysRow}>
          {DAYS_OF_WEEK.map((d) => {
            const isSelected = selectedDay === d.key;
            return (
              <TouchableOpacity
                key={d.key}
                onPress={() => setSelectedDay(d.key)}
                style={[styles.dayCard, isSelected && styles.dayCardSelected]}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.dayLabel,
                    isSelected && styles.dayLabelSelected,
                  ]}
                >
                  {d.label}
                </Text>
                <Text
                  style={[
                    styles.dayDate,
                    isSelected && styles.dayDateSelected,
                  ]}
                >
                  {d.date}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Itinerario del día */}
        <Text style={styles.daySummaryTitle}>
          Itinerario para el {DAYS_OF_WEEK.find((d) => d.key === selectedDay)?.name}
        </Text>

        {/* Tarjeta 1: Ida en la mañana */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => router.push('/viaje-en-curso/trip-1')}
          style={styles.timelineItem}
        >
          <View style={styles.timeColumn}>
            <Text style={styles.timeText}>06:30</Text>
            <Text style={styles.timePeriod}>Ida</Text>
          </View>
          <Card style={styles.scheduleCard}>
            <View style={styles.cardHeader}>
              <View style={styles.badgeRow}>
                <Badge label="Confirmado" variant="success" />
                <Badge label="Andrés P." variant="navy" style={{ marginLeft: 6 }} />
              </View>
              <Text style={styles.tripStatusActive}>En 35 min</Text>
            </View>

            <Text style={styles.scheduleRoute}>
              [TU BARRIO] → [TU UNIVERSIDAD]
            </Text>

            <View style={styles.cardActionRow}>
              <Text style={styles.cardSubText}>
                Placa [PLACA] • 2 cupos compartidos
              </Text>
              <View style={styles.enterLiveBtn}>
                <Text style={styles.enterLiveBtnText}>Ver en curso</Text>
                <ChevronRight size={14} color={COLORS.navy} />
              </View>
            </View>
          </Card>
        </TouchableOpacity>

        {/* Tarjeta 2: Mediodía / Sin viaje */}
        <View style={styles.timelineItem}>
          <View style={styles.timeColumn}>
            <Text style={styles.timeTextMuted}>12:00</Text>
            <Text style={styles.timePeriod}>Campus</Text>
          </View>
          <Card variant="outline" style={styles.scheduleCardEmpty}>
            <Text style={styles.emptySlotTitle}>Sin viaje programado</Text>
            <Text style={styles.emptySlotSubtitle}>
              ¿Tienes hueco de clases? Puedes buscar un trayecto intermedio.
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)')}
              style={styles.findSlotBtn}
            >
              <Text style={styles.findSlotBtnText}>+ Buscar cupo</Text>
            </TouchableOpacity>
          </Card>
        </View>

        {/* Tarjeta 3: Regreso por la tarde */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => router.push({ pathname: '/viaje/[id]', params: { id: 'trip-4' } })}
          style={styles.timelineItem}
        >
          <View style={styles.timeColumn}>
            <Text style={styles.timeText}>17:30</Text>
            <Text style={styles.timePeriod}>Regreso</Text>
          </View>
          <Card style={styles.scheduleCard}>
            <View style={styles.cardHeader}>
              <Badge label="Programado" variant="yellow" />
              <Badge label="Laura M." variant="support" style={{ marginLeft: 6 }} />
            </View>
            <Text style={styles.scheduleRoute}>
              [TU UNIVERSIDAD] → [TU BARRIO OCCIDENTE]
            </Text>
            <Text style={styles.cardSubText}>
              Punto de encuentro: Parqueadero Bloque F
            </Text>
          </Card>
        </TouchableOpacity>

        {/* Tarjeta 4: Grupo nocturno */}
        <View style={styles.timelineItem}>
          <View style={styles.timeColumn}>
            <Text style={styles.timeTextMuted}>21:00</Text>
            <Text style={styles.timePeriod}>Noche</Text>
          </View>
          <Card style={[styles.scheduleCard, { backgroundColor: '#F8FAFD' }]}>
            <Text style={styles.nightGroupTitle}>🌙 Grupo nocturno seguro</Text>
            <Text style={styles.nightGroupSub}>
              Salida coordinada desde la biblioteca central con 6 estudiantes.
            </Text>
          </Card>
        </View>

        {/* Botón "Repetir estos viajes cada semana" destacado */}
        <View style={styles.repeatSection}>
          <Button
            title={
              isWeeklyRepeating
                ? '✓ Repetir estos viajes cada semana (Activo)'
                : 'Activar repetición semanal de viajes'
            }
            variant={isWeeklyRepeating ? 'yellow' : 'primary'}
            size="lg"
            icon={<Repeat size={18} color={isWeeklyRepeating ? COLORS.navy : '#FFFFFF'} />}
            onPress={handleToggleWeekly}
            style={styles.repeatButton}
          />
          <Text style={styles.repeatHint}>
            No tendrás que volver a pedir cupo cada mañana: tus trayectos quedarán reservados.
          </Text>
        </View>
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
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  dayCard: {
    width: 54,
    height: 72,
    borderRadius: RADIUS.md + 4,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#DFE5F0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0E2A5E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  dayCardSelected: {
    backgroundColor: COLORS.navy,
    borderColor: COLORS.navy,
    transform: [{ scale: 1.05 }],
  },
  dayLabel: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.support,
    marginBottom: 4,
  },
  dayLabelSelected: {
    color: COLORS.primary,
  },
  dayDate: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.navy,
  },
  dayDateSelected: {
    color: '#FFFFFF',
  },
  daySummaryTitle: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.navy,
    marginBottom: SPACING.md,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  timeColumn: {
    width: 60,
    paddingTop: 8,
  },
  timeText: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.navy,
  },
  timeTextMuted: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  timePeriod: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.xs,
    color: COLORS.support,
    marginTop: 2,
  },
  scheduleCard: {
    flex: 1,
    padding: SPACING.md,
  },
  scheduleCardEmpty: {
    flex: 1,
    padding: SPACING.md,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
  },
  tripStatusActive: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.xs,
    color: COLORS.success,
    fontWeight: '700',
  },
  scheduleRoute: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.navy,
    marginBottom: 6,
  },
  cardActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  cardSubText: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.xs,
    color: COLORS.support,
  },
  enterLiveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.pill,
  },
  enterLiveBtnText: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.xs,
    fontWeight: '700',
    color: COLORS.navy,
    marginRight: 2,
  },
  emptySlotTitle: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.navy,
  },
  emptySlotSubtitle: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.xs,
    color: COLORS.support,
    marginTop: 2,
  },
  findSlotBtn: {
    alignSelf: 'flex-start',
    marginTop: 8,
    backgroundColor: '#EBF1FA',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: RADIUS.pill,
  },
  findSlotBtnText: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.xs,
    fontWeight: '700',
    color: COLORS.navy,
  },
  nightGroupTitle: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
    color: COLORS.navy,
  },
  nightGroupSub: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.xs,
    color: COLORS.support,
    marginTop: 2,
  },
  repeatSection: {
    marginTop: SPACING.lg,
  },
  repeatButton: {
    shadowColor: COLORS.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  repeatHint: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.xs,
    color: COLORS.support,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 16,
  },
});
