import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Svg, { Path, Circle, Line, Rect, G } from 'react-native-svg';
import {
  ChevronLeft,
  Navigation,
  Clock,
  MapPin,
  Share2,
  AlertTriangle,
  MessageCircle,
  PhoneCall,
  ShieldCheck,
} from 'lucide-react-native';
import { WheelsULogo } from '../../src/components/brand/WheelsULogo';
import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';
import { Badge } from '../../src/components/ui/Badge';
import { COLORS, FONTS, RADIUS, SPACING } from '../../src/constants/theme';
import { useTripsStore } from '../../src/stores/useTripsStore';
import { useAuthStore } from '../../src/stores/useAuthStore';

export default function ViajeEnCursoScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const user = useAuthStore((s) => s.user);
  const getTripById = useTripsStore((s) => s.getTripById);
  const triggerSOS = useTripsStore((s) => s.triggerSOS);

  const trip = getTripById(id || 'trip-1') || useTripsStore.getState().trips[0];
  const [copiedLink, setCopiedLink] = useState(false);

  const trackingLink = `https://wheels-u.app/seguimiento/${trip.token_seguimiento || 'demo-token'}`;

  const handleShareTrip = async () => {
    try {
      const shareMessage = `🚗 Hola! Estoy viajando seguro con ${trip.conductor.nombre} en Wheels U hacia ${trip.destino}. Puedes ver mi recorrido en vivo aquí: ${trackingLink}`;
      await Share.share({
        message: shareMessage,
        title: 'Mi viaje en Wheels U',
      });
      setCopiedLink(true);
    } catch (e) {
      Alert.alert('Enlace de seguimiento', trackingLink);
    }
  };

  const handleSOSPress = () => {
    Alert.alert(
      '🚨 BOTÓN DE AYUDA / SOS',
      `¿Deseas enviar una alerta de emergencia a tu contacto de confianza (${user?.contacto_confianza?.nombre || 'Mamá'}) con tu ubicación exacta?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Enviar Alerta SOS',
          style: 'destructive',
          onPress: () => {
            const res = triggerSOS(
              user?.nombre || '[TU NOMBRE]',
              user?.contacto_confianza?.telefono || '+57 300 000 0000',
              4.665,
              -74.075
            );
            Alert.alert('Alerta SOS Disparada', res.alertText);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Cabecera flotante */}
        <View style={styles.topHeader}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <ChevronLeft size={24} color={COLORS.navy} />
          </TouchableOpacity>
          <View style={styles.headerTitleWrap}>
            <WheelsULogo size={26} showText textColor={COLORS.navy} />
          </View>
          <TouchableOpacity
            style={styles.chatHeaderBtn}
            onPress={() => router.push({ pathname: '/chat/[id]', params: { id: trip.id } })}
          >
            <MessageCircle size={20} color={COLORS.navy} />
          </TouchableOpacity>
        </View>

        {/* Mapa Interactivo / Visualización Estilizada de Ruta */}
        <View style={styles.mapContainer}>
          <Svg width="100%" height="100%" viewBox="0 0 360 300">
            {/* Fondo de calles urbanas */}
            <Rect x="0" y="0" width="360" height="300" fill="#E8EEF5" />
            <Line x1="0" y1="80" x2="360" y2="80" stroke="#FFFFFF" strokeWidth="12" />
            <Line x1="0" y1="180" x2="360" y2="180" stroke="#FFFFFF" strokeWidth="18" />
            <Line x1="80" y1="0" x2="80" y2="300" stroke="#FFFFFF" strokeWidth="10" />
            <Line x1="220" y1="0" x2="220" y2="300" stroke="#FFFFFF" strokeWidth="16" />
            <Line x1="300" y1="0" x2="300" y2="300" stroke="#FFFFFF" strokeWidth="8" />

            {/* Trazo de la ruta diagonal punteada */}
            <Path
              d="M 60 250 L 140 170 L 220 110 L 300 50"
              stroke={COLORS.navy}
              strokeWidth="4"
              strokeDasharray="6, 6"
              fill="none"
            />

            {/* Parada 1 - Origen */}
            <Circle cx="60" cy="250" r="9" fill={COLORS.primary} stroke={COLORS.navy} strokeWidth="3" />

            {/* Parada 2 - Intermedia */}
            <Circle cx="140" cy="170" r="9" fill={COLORS.primary} stroke={COLORS.navy} strokeWidth="3" />

            {/* Parada 3 - Conductor actual */}
            <Circle cx="220" cy="110" r="11" fill={COLORS.navy} />
            <Circle cx="220" cy="110" r="5" fill="#FFFFFF" />

            {/* Parada 4 - Destino Universitario */}
            <Circle cx="300" cy="50" r="12" fill={COLORS.navy} />
            <Circle cx="300" cy="50" r="6" fill={COLORS.primary} />
          </Svg>

          {/* Indicador de Estado En Vivo Flotante */}
          <View style={styles.liveIndicator}>
            <View style={styles.livePulse} />
            <Text style={styles.liveText}>EN TRAYECTO • CONDUCTOR EN CAMINO</Text>
          </View>
        </View>

        {/* Tarjeta Inferior de Información y Seguridad */}
        <Card style={styles.bottomCard}>
          {/* Conductor y ETA */}
          <View style={styles.driverRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {trip.conductor.nombre.slice(0, 2).toUpperCase()}
              </Text>
            </View>
            <View style={styles.driverInfo}>
              <Text style={styles.driverName}>{trip.conductor.nombre}</Text>
              <Text style={styles.vehicleInfo}>
                {trip.vehiculo} • Placa {trip.placa}
              </Text>
            </View>
            <View style={styles.etaBadge}>
              <Clock size={12} color={COLORS.navy} style={{ marginRight: 3 }} />
              <Text style={styles.etaText}>Llega {trip.hora_llegada_estimada || '07:20'}</Text>
            </View>
          </View>

          {/* Próxima Parada */}
          <View style={styles.nextStopBanner}>
            <Navigation size={16} color={COLORS.navy} />
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.nextStopLabel}>Próxima parada:</Text>
              <Text style={styles.nextStopValue}>{trip.proxima_parada}</Text>
            </View>
          </View>

          {/* Botones de Seguridad y Contacto */}
          <View style={styles.actionGrid}>
            <TouchableOpacity
              onPress={handleShareTrip}
              style={styles.shareBtn}
              activeOpacity={0.8}
            >
              <Share2 size={16} color={COLORS.navy} />
              <Text style={styles.shareBtnText}>
                {copiedLink ? '¡Enlace Compartido!' : 'Compartir mi viaje'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSOSPress}
              style={styles.sosAlertBtn}
              activeOpacity={0.85}
            >
              <AlertTriangle size={16} color="#FFFFFF" />
              <Text style={styles.sosAlertBtnText}>Botón de Ayuda</Text>
            </TouchableOpacity>
          </View>

          {/* Acceso a Chat */}
          <Button
            title="Abrir Chat del Viaje"
            variant="outline"
            icon={<MessageCircle size={18} color={COLORS.navy} />}
            onPress={() => router.push({ pathname: '/chat/[id]', params: { id: trip.id } })}
            style={{ marginTop: 10 }}
          />
        </Card>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    backgroundColor: '#FFFFFF',
    zIndex: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backBtn: {
    padding: 6,
  },
  headerTitleWrap: {
    alignItems: 'center',
  },
  chatHeaderBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  liveIndicator: {
    position: 'absolute',
    top: 14,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.navy,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.pill,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  livePulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginRight: 6,
  },
  liveText: {
    fontFamily: FONTS.family,
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  bottomCard: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    padding: SPACING.lg,
    borderRadius: RADIUS.card,
  },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    borderWidth: 1.5,
    borderColor: COLORS.navy,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.navy,
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.navy,
  },
  vehicleInfo: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.xs,
    color: COLORS.support,
    marginTop: 2,
  },
  etaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E5',
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.md,
  },
  etaText: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.xs,
    fontWeight: '700',
    color: COLORS.navy,
  },
  nextStopBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5FA',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
  },
  nextStopLabel: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.xs,
    color: COLORS.support,
  },
  nextStopValue: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
    color: COLORS.navy,
    marginTop: 1,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  shareBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    minHeight: 44,
  },
  shareBtnText: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.xs,
    fontWeight: '700',
    color: COLORS.navy,
    marginLeft: 6,
  },
  sosAlertBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.danger,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    minHeight: 44,
  },
  sosAlertBtnText: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.xs,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 6,
  },
});
