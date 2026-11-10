import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { WheelsULogo } from '../src/components/brand/WheelsULogo';
import { Button } from '../src/components/ui/Button';
import { COLORS, FONTS, RADIUS, SPACING } from '../src/constants/theme';
import { useAuthStore } from '../src/stores/useAuthStore';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const handleStart = () => {
    // Si ya está autenticado, lleva directo a buscar viaje, o al flujo de registro
    router.replace('/(tabs)');
  };

  const handleLoginPress = () => {
    router.push('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Cabecera superior con logo compacto */}
        <View style={styles.topHeader}>
          <WheelsULogo size={32} showText textColor={COLORS.navy} />
        </View>

        {/* Hero Central con el pin característico grande */}
        <View style={styles.heroSection}>
          <View style={styles.logoBadge}>
            <WheelsULogo size={110} />
          </View>

          <Text style={styles.heroTitle}>
            Comparte el camino{'\n'}a la <Text style={styles.titleHighlight}>U</Text>
          </Text>

          <Text style={styles.heroSubtitle}>
            Viajes seguros y solidarios entre estudiantes verificados de tu universidad.
          </Text>

          <View style={styles.nonProfitPill}>
            <Text style={styles.nonProfitText}>
              🤝 Sin fines de lucro • División exacta de gasolina y peajes
            </Text>
          </View>
        </View>

        {/* Botones de acción */}
        <View style={styles.actionsSection}>
          <Button
            title="Entrar a Wheels U"
            variant="primary"
            size="lg"
            onPress={handleStart}
            style={styles.primaryBtn}
          />

          <Button
            title="Registro con correo institucional"
            variant="outline"
            size="lg"
            onPress={handleLoginPress}
            style={styles.secondaryBtn}
          />

          <Text style={styles.footerNotice}>
            🔒 Acceso exclusivo con correo institucional (@*.edu*)
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  scrollContainer: {
    flexGrow: 1,
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: SPACING.md,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
  },
  heroSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SPACING.md,
    width: '100%',
  },
  logoBadge: {
    marginBottom: SPACING.lg,
    alignItems: 'center',
  },
  heroTitle: {
    fontFamily: FONTS.family,
    fontSize: 25,
    fontWeight: '700',
    color: COLORS.navy,
    textAlign: 'center',
    lineHeight: 32,
    letterSpacing: -0.5,
  },
  titleHighlight: {
    color: COLORS.navy,
    textDecorationLine: 'underline',
  },
  heroSubtitle: {
    fontFamily: FONTS.family,
    fontSize: 13,
    color: COLORS.navy,
    textAlign: 'center',
    marginTop: SPACING.sm,
    lineHeight: 18,
    maxWidth: 270,
    opacity: 0.9,
  },
  nonProfitPill: {
    marginTop: SPACING.md,
    backgroundColor: 'rgba(14, 42, 94, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.pill,
    maxWidth: 320,
  },
  nonProfitText: {
    fontFamily: FONTS.family,
    fontSize: 10,
    color: COLORS.navy,
    fontWeight: '600',
    textAlign: 'center',
  },
  actionsSection: {
    width: '100%',
    paddingBottom: SPACING.md,
  },
  primaryBtn: {
    backgroundColor: COLORS.navy,
    marginBottom: SPACING.md,
    shadowColor: COLORS.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  secondaryBtn: {
    borderColor: COLORS.navy,
    borderWidth: 2,
    marginBottom: SPACING.md,
    backgroundColor: 'transparent',
  },
  footerNotice: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.xs,
    color: COLORS.navy,
    textAlign: 'center',
    opacity: 0.8,
  },
});
