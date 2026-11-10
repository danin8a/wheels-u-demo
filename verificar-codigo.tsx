import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { KeyRound, CheckCircle2, ChevronLeft, RefreshCw } from 'lucide-react-native';
import { WheelsULogo } from '../../src/components/brand/WheelsULogo';
import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';
import { COLORS, FONTS, RADIUS, SPACING } from '../../src/constants/theme';
import { useAuthStore } from '../../src/stores/useAuthStore';

export default function VerificarCodigoScreen() {
  const router = useRouter();
  const { pendingEmail, verifyCode, isLoading, error } = useAuthStore();
  const [code, setCode] = useState('');

  const handleVerify = async () => {
    if (code.length < 6) {
      Alert.alert('Código incompleto', 'Por favor ingresa los 6 dígitos del código enviado a tu correo.');
      return;
    }

    const success = await verifyCode(code);
    if (success) {
      Alert.alert(
        '¡Identidad Verificada!',
        'Tu correo universitario ha sido comprobado con éxito. Bienvenido a Wheels U.',
        [
          {
            text: 'Comenzar a viajar',
            onPress: () => router.replace('/(tabs)'),
          },
        ]
      );
    }
  };

  const handleDemoPaste = () => {
    setCode('123456');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ChevronLeft size={24} color={COLORS.navy} />
            <Text style={styles.backText}>Volver</Text>
          </TouchableOpacity>

          <View style={styles.logoRow}>
            <WheelsULogo size={60} />
          </View>

          <Text style={styles.title}>Código de Verificación</Text>
          <Text style={styles.subtitle}>
            Hemos enviado un código seguro de 6 dígitos a:
          </Text>
          <Text style={styles.emailHighlight}>
            {pendingEmail || 'estudiante@uni.edu.co'}
          </Text>

          {/* Input OTP de 6 dígitos */}
          <Card style={styles.codeCard}>
            <View style={styles.codeRow}>
              <KeyRound size={22} color={COLORS.navy} style={{ marginRight: 10 }} />
              <TextInput
                style={styles.codeInput}
                value={code}
                onChangeText={setCode}
                placeholder="123456"
                placeholderTextColor="#94A3B8"
                keyboardType="number-pad"
                maxLength={6}
                autoFocus
              />
            </View>
          </Card>

          {/* Atajo para desarrollo / demo testing */}
          <TouchableOpacity
            onPress={handleDemoPaste}
            style={styles.demoShortcut}
            activeOpacity={0.8}
          >
            <Text style={styles.demoShortcutText}>
              ⚡ Pegar código demo: 123456
            </Text>
          </TouchableOpacity>

          {error && <Text style={styles.errorText}>⚠️ {error}</Text>}

          <Button
            title="Validar y Entrar a Wheels U"
            variant="primary"
            size="lg"
            loading={isLoading}
            icon={<CheckCircle2 size={18} color="#FFFFFF" />}
            onPress={handleVerify}
            style={styles.verifyBtn}
          />

          <TouchableOpacity
            style={styles.resendBtn}
            onPress={() => Alert.alert('Reenvío', 'Se ha vuelto a enviar el código a tu correo institucional.')}
          >
            <RefreshCw size={14} color={COLORS.support} />
            <Text style={styles.resendText}>¿No recibiste el código? Reenviar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
    justifyContent: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: SPACING.md,
    left: SPACING.xl,
  },
  backText: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.sm,
    color: COLORS.navy,
    fontWeight: '600',
    marginLeft: 2,
  },
  logoRow: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.xxl,
    fontWeight: '700',
    color: COLORS.navy,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.sm,
    color: COLORS.support,
    textAlign: 'center',
    marginTop: 6,
  },
  emailHighlight: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
    color: COLORS.navy,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    marginTop: 2,
  },
  codeCard: {
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  codeInput: {
    flex: 1,
    fontFamily: FONTS.family,
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.navy,
    letterSpacing: 8,
    textAlign: 'center',
    minHeight: 48,
  },
  demoShortcut: {
    backgroundColor: '#FFF9E5',
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: RADIUS.pill,
    alignSelf: 'center',
    marginVertical: SPACING.md,
  },
  demoShortcutText: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.xs,
    color: COLORS.navy,
    fontWeight: '700',
  },
  errorText: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.xs,
    color: COLORS.danger,
    textAlign: 'center',
    marginBottom: 8,
  },
  verifyBtn: {
    marginTop: SPACING.md,
  },
  resendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.xl,
    paddingVertical: 8,
    gap: 6,
  },
  resendText: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.xs,
    color: COLORS.support,
  },
});
