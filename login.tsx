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
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Mail, GraduationCap, ChevronLeft, ArrowRight, ShieldCheck } from 'lucide-react-native';
import { WheelsULogo } from '../../src/components/brand/WheelsULogo';
import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';
import { COLORS, FONTS, RADIUS, SPACING } from '../../src/constants/theme';
import { useAuthStore } from '../../src/stores/useAuthStore';

export default function LoginScreen() {
  const router = useRouter();
  const {
    universities,
    selectedUniversity,
    selectUniversity,
    sendVerificationEmail,
    isLoading,
    error,
  } = useAuthStore();

  const [email, setEmail] = useState('');

  const handleSendCode = async () => {
    if (!email.trim()) {
      Alert.alert('Atención', 'Por favor ingresa tu correo institucional.');
      return;
    }

    const res = await sendVerificationEmail(email);
    if (res.success) {
      router.push('/(auth)/verificar-codigo');
    } else {
      Alert.alert('Acceso Restringido', res.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Botón Volver */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ChevronLeft size={24} color={COLORS.navy} />
            <Text style={styles.backText}>Volver</Text>
          </TouchableOpacity>

          <View style={styles.logoRow}>
            <WheelsULogo size={64} vertical showText textColor={COLORS.navy} />
          </View>

          <Text style={styles.title}>Ingreso Universitario</Text>
          <Text style={styles.subtitle}>
            Para garantizar la seguridad de la comunidad, solo aceptamos correos institucionales verificados.
          </Text>

          {/* Selector de Universidad */}
          <Text style={styles.inputLabel}>Selecciona tu Universidad:</Text>
          <View style={styles.uniList}>
            {universities.map((uni) => {
              const isSelected = selectedUniversity?.id === uni.id;
              return (
                <TouchableOpacity
                  key={uni.id}
                  onPress={() => selectUniversity(uni)}
                  style={[styles.uniItem, isSelected && styles.uniItemSelected]}
                  activeOpacity={0.8}
                >
                  <GraduationCap
                    size={18}
                    color={isSelected ? COLORS.navy : COLORS.support}
                  />
                  <View style={styles.uniTextWrap}>
                    <Text
                      style={[styles.uniName, isSelected && styles.uniNameSelected]}
                    >
                      {uni.nombre}
                    </Text>
                    <Text style={styles.uniDomain}>@{uni.dominio_correo}</Text>
                  </View>
                  {isSelected && (
                    <ShieldCheck size={18} color={COLORS.navy} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Input de Correo Institucional */}
          <Text style={styles.inputLabel}>Tu correo institucional:</Text>
          <Card style={styles.inputCard}>
            <View style={styles.inputFieldRow}>
              <Mail size={20} color={COLORS.navy} style={{ marginRight: 10 }} />
              <TextInput
                style={styles.textInput}
                placeholder={`estudiante@${selectedUniversity?.dominio_correo || 'uni.edu.co'}`}
                placeholderTextColor="#94A3B8"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </Card>

          {error && <Text style={styles.errorText}>⚠️ {error}</Text>}

          <View style={styles.infoTip}>
            <Text style={styles.infoTipText}>
              💡 Te enviaremos un código de seguridad de 6 dígitos a tu bandeja de entrada universitaria.
            </Text>
          </View>

          <Button
            title="Enviar código de verificación"
            variant="primary"
            size="lg"
            loading={isLoading}
            icon={<ArrowRight size={18} color="#FFFFFF" />}
            onPress={handleSendCode}
            style={styles.submitBtn}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
    paddingBottom: 40,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    alignSelf: 'flex-start',
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
    marginBottom: SPACING.md,
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
    fontSize: FONTS.sizes.xs + 1,
    color: COLORS.support,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: SPACING.xl,
    lineHeight: 18,
  },
  inputLabel: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
    color: COLORS.navy,
    marginBottom: 8,
  },
  uniList: {
    marginBottom: SPACING.lg,
    gap: 8,
  },
  uniItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
  },
  uniItemSelected: {
    backgroundColor: '#FFF9E5',
    borderColor: COLORS.primary,
  },
  uniTextWrap: {
    flex: 1,
    marginLeft: 10,
  },
  uniName: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.navy,
  },
  uniNameSelected: {
    fontWeight: '700',
  },
  uniDomain: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.xs,
    color: COLORS.support,
  },
  inputCard: {
    padding: SPACING.sm + 2,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.sm,
  },
  inputFieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  textInput: {
    flex: 1,
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.md,
    color: COLORS.navy,
    minHeight: 44,
  },
  errorText: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.xs,
    color: COLORS.danger,
    marginTop: 4,
    marginBottom: 8,
  },
  infoTip: {
    backgroundColor: '#EBF1FA',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginTop: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  infoTipText: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.xs,
    color: COLORS.support,
    lineHeight: 18,
  },
  submitBtn: {
    shadowColor: COLORS.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
});
