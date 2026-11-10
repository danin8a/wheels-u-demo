import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Svg, { Path, Circle, Line, Rect } from 'react-native-svg';
import { ShieldCheck, MapPin, Clock, Phone, Car, ArrowLeft } from 'lucide-react-native';
import { WheelsULogo } from '../../src/components/brand/WheelsULogo';
import { Card } from '../../src/components/ui/Card';
import { Badge } from '../../src/components/ui/Badge';
import { COLORS, FONTS, RADIUS, SPACING } from '../../src/constants/theme';
import { useTripsStore } from '../../src/stores/useTripsStore';

export default function SeguimientoScreen() {
  const router = useRouter();
  const { token } = useLocalSearchParams<{ token: string }>();
  const trips = useTripsStore((s) => s.trips);
  const trip = trips[0]; // Viaje activo demo

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Encabezado de Seguimiento Público */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={22} color={COLORS.navy} />
          </TouchableOpacity>
          <WheelsULogo size={32} showText textColor={COLORS.navy} />
          <View style={{ width: 22 }} />
        </View>

        <Card variant="navy" style={styles.statusCard}>
          <View style={styles.badgeRow}>
            <Badge label="Ruta en vivo" variant="yellow" />
            <Text style={styles.tokenText}>ID: {token || 'demo-live'}</Text>
          </View>

          <Text style={styles.statusTitle}>Monitoreo de Viaje Seguro</Text>
          <Text style={styles.statusSubtitle}>
            Estás visualizando el trayecto en vivo compartido por el estudiante.
          </Text>

          <View style={styles.etaBox}>
            <Clock size={16} color={COLORS.primary} />
            <Text style={styles.etaText}>
              Llegada estimada al campus: {trip.hora_llegada_estimada || '07:20'}
            </Text>
          </View>
        </Card>

        {/* Mapa vectorial */}
        <Card noPadding style={styles.mapCard}>
          <Svg width="100%" height={220} viewBox="0 0 360 220">
            <Rect x="0" y="0" width="360" height="220" fill="#E8EEF5" />
            <Line x1="0" y1="60" x2="360" y2="60" stroke="#FFFFFF" strokeWidth="12" />
            <Line x1="0" y1="140" x2="360" y2="140" stroke="#FFFFFF" strokeWidth="16" />
            <Line x1="100" y1="0" x2="100" y2="220" stroke="#FFFFFF" strokeWidth="12" />
            <Line x1="240" y1="0" x2="240" y2="220" stroke="#FFFFFF" strokeWidth="14" />

            <Path
              d="M 50 180 L 150 120 L 240 80 L 310 40"
              stroke={COLORS.navy}
              strokeWidth="4"
              strokeDasharray="6, 6"
              fill="none"
            />
            <Circle cx="50" cy="180" r="8" fill={COLORS.primary} stroke={COLORS.navy} strokeWidth="2" />
            <Circle cx="150" cy="120" r="8" fill={COLORS.primary} stroke={COLORS.navy} strokeWidth="2" />
            <Circle cx="240" cy="80" r="10" fill={COLORS.navy} />
            <Circle cx="240" cy="80" r="4" fill="#FFFFFF" />
            <Circle cx="310" cy="40" r="10" fill={COLORS.navy} />
            <Circle cx="310" cy="40" r="5" fill={COLORS.primary} />
          </Svg>
        </Card>

        {/* Ficha del Conductor y Vehículo */}
        <Card style={styles.infoCard}>
          <Text style={styles.sectionHeader}>Datos de la ruta</Text>
          <View style={styles.infoRow}>
            <Car size={18} color={COLORS.navy} />
            <Text style={styles.infoLabel}>Vehículo y placa:</Text>
            <Text style={styles.infoVal}>{trip.vehiculo} • {trip.placa}</Text>
          </View>
          <View style={styles.infoRow}>
            <ShieldCheck size={18} color={COLORS.navy} />
            <Text style={styles.infoLabel}>Conductor verificado:</Text>
            <Text style={styles.infoVal}>{trip.conductor.nombre} ({trip.conductor.carrera})</Text>
          </View>
          <View style={styles.infoRow}>
            <MapPin size={18} color={COLORS.navy} />
            <Text style={styles.infoLabel}>Destino:</Text>
            <Text style={styles.infoVal}>{trip.destino}</Text>
          </View>
        </Card>

        <View style={styles.footerNote}>
          <Text style={styles.footerNoteText}>
            🔒 Este enlace expira automáticamente al finalizar el viaje. Wheels U protege la privacidad de los estudiantes.
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
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  backBtn: {
    padding: 6,
  },
  statusCard: {
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tokenText: {
    fontFamily: FONTS.family,
    fontSize: 10,
    color: '#A3B8D8',
  },
  statusTitle: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statusSubtitle: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.xs + 1,
    color: '#A3B8D8',
    marginTop: 4,
  },
  etaBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
    marginTop: 12,
  },
  etaText: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.xs + 1,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  mapCard: {
    borderRadius: RADIUS.card,
    marginBottom: SPACING.lg,
  },
  infoCard: {
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  sectionHeader: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
    color: COLORS.navy,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  infoLabel: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.xs,
    color: COLORS.support,
    marginLeft: 8,
    width: 140,
  },
  infoVal: {
    flex: 1,
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.xs + 1,
    fontWeight: '600',
    color: COLORS.navy,
  },
  footerNote: {
    paddingHorizontal: SPACING.md,
  },
  footerNoteText: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.xs,
    color: COLORS.support,
    textAlign: 'center',
    lineHeight: 16,
  },
});
