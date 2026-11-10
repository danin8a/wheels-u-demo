import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  Flame,
  Award,
  Users,
  Compass,
  Clock,
  Leaf,
  CheckCircle,
  Plus,
  Car,
  Star,
  ChevronRight,
} from 'lucide-react-native';
import { WheelsULogo } from '../../src/components/brand/WheelsULogo';
import { Card } from '../../src/components/ui/Card';
import { Badge } from '../../src/components/ui/Badge';
import { Button } from '../../src/components/ui/Button';
import { COLORS, FONTS, RADIUS, SPACING } from '../../src/constants/theme';
import { useCommunityStore } from '../../src/stores/useCommunityStore';

export default function ComunidadScreen() {
  const { groups, badges, reviews, streakWeeks, toggleJoinGroup } = useCommunityStore();

  const handleGroupAction = (groupId: string, groupName: string, isMember: boolean) => {
    toggleJoinGroup(groupId);
    Alert.alert(
      isMember ? 'Grupo abandonado' : '¡Bienvenido al grupo!',
      isMember
        ? `Has salido del grupo ${groupName}.`
        : `Te has unido a ${groupName}. Ahora recibirás alertas de nuevos viajes en esta ruta.`
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
          <Text style={styles.headerTitle}>Comunidad U</Text>
          <WheelsULogo size={32} />
        </View>

        {/* Tarjeta de Racha Compartida */}
        <Card variant="yellow" style={styles.streakCard}>
          <View style={styles.streakRow}>
            <View style={styles.flameCircle}>
              <Flame size={28} color={COLORS.navy} fill={COLORS.navy} />
            </View>
            <View style={styles.streakInfo}>
              <Text style={styles.streakNumber}>{streakWeeks} Semanas</Text>
              <Text style={styles.streakLabel}>
                Racha activa compartiendo viaje con tu comunidad
              </Text>
            </View>
          </View>
          <View style={styles.streakFooter}>
            <Text style={styles.streakHelp}>
              Has ahorrado aprox. 28 kg de CO₂ y evitado congestión vehicular en el campus.
            </Text>
          </View>
        </Card>

        {/* Grupos de Ruta */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Grupos de ruta activos</Text>
            <Text style={styles.sectionCounter}>{groups.length} grupos</Text>
          </View>

          {groups.map((group) => {
            const isMember = Boolean(group.es_miembro);
            return (
              <Card key={group.id} style={styles.groupCard}>
                <View style={styles.groupTop}>
                  <View style={styles.groupIconWrapper}>
                    <Users size={20} color={COLORS.navy} />
                  </View>
                  <View style={styles.groupMeta}>
                    <Text style={styles.groupName}>{group.nombre}</Text>
                    <Text style={styles.groupRuta}>{group.ruta}</Text>
                  </View>
                </View>

                <Text style={styles.groupDesc}>{group.descripcion}</Text>

                <View style={styles.groupBottom}>
                  <Text style={styles.membersCount}>
                    👥 {group.miembros_count} estudiantes
                  </Text>
                  <Button
                    title={isMember ? 'Miembro ✓' : '+ Unirme'}
                    variant={isMember ? 'outline' : 'primary'}
                    size="sm"
                    onPress={() => handleGroupAction(group.id, group.nombre, isMember)}
                    style={styles.groupBtn}
                  />
                </View>
              </Card>
            );
          })}
        </View>

        {/* Insignias de Convivencia y Seguridad */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tus insignias universitarias</Text>
            <Text style={styles.sectionCounter}>
              {badges.filter((b) => b.desbloqueada).length} / {badges.length}
            </Text>
          </View>

          <View style={styles.badgesGrid}>
            {badges.map((badge) => {
              return (
                <View
                  key={badge.id}
                  style={[
                    styles.badgeCard,
                    !badge.desbloqueada && styles.badgeCardLocked,
                  ]}
                >
                  <View
                    style={[
                      styles.badgeIconBubble,
                      badge.desbloqueada ? styles.badgeUnlocked : styles.badgeLocked,
                    ]}
                  >
                    {badge.id === 'primer_viaje' && <Award size={24} color={COLORS.navy} />}
                    {badge.id === 'puntual' && <Clock size={24} color={COLORS.navy} />}
                    {badge.id === 'guia_u' && <Compass size={24} color={COLORS.navy} />}
                    {badge.id === 'eco_friendly' && <Leaf size={24} color={badge.desbloqueada ? COLORS.navy : '#94A3B8'} />}
                  </View>

                  <Text style={styles.badgeName}>{badge.nombre}</Text>
                  <Text style={styles.badgeDesc} numberOfLines={2}>
                    {badge.descripcion}
                  </Text>
                  {badge.desbloqueada ? (
                    <Text style={styles.badgeUnlockedLabel}>✓ Desbloqueada</Text>
                  ) : (
                    <Text style={styles.badgeLockedLabel}>En progreso</Text>
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* Reseñas y Confianza Universitaria */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Reseñas de compañeros</Text>
          </View>

          {reviews.map((rev) => (
            <Card key={rev.id} style={styles.reviewCard}>
              <View style={styles.reviewTop}>
                <Text style={styles.reviewAuthor}>{rev.autor_nombre}</Text>
                <View style={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={14}
                      color={COLORS.primary}
                      fill={star <= rev.puntuacion ? COLORS.primary : 'none'}
                    />
                  ))}
                </View>
              </View>

              <Text style={styles.reviewComment}>"{rev.comentario}"</Text>

              <View style={styles.tagsRow}>
                {rev.etiquetas.map((tag, idx) => (
                  <Badge key={idx} label={tag} variant="support" style={{ marginRight: 6 }} />
                ))}
              </View>
            </Card>
          ))}
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
  streakCard: {
    padding: SPACING.lg,
    borderRadius: RADIUS.card,
    marginBottom: SPACING.xl,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flameCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    borderWidth: 1.5,
    borderColor: COLORS.navy,
  },
  streakInfo: {
    flex: 1,
  },
  streakNumber: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
    color: COLORS.navy,
  },
  streakLabel: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.xs,
    fontWeight: '600',
    color: COLORS.navy,
    marginTop: 2,
  },
  streakFooter: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(14, 42, 94, 0.15)',
  },
  streakHelp: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.xs,
    color: COLORS.navy,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.navy,
  },
  sectionCounter: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.xs,
    color: COLORS.support,
    fontWeight: '600',
  },
  groupCard: {
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  groupTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  groupIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EBF1FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  groupMeta: {
    flex: 1,
  },
  groupName: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.sm + 1,
    fontWeight: '700',
    color: COLORS.navy,
  },
  groupRuta: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.xs,
    color: COLORS.support,
  },
  groupDesc: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.xs,
    color: COLORS.navy,
    marginBottom: 10,
    lineHeight: 18,
  },
  groupBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F3F8',
  },
  membersCount: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.xs,
    color: COLORS.support,
    fontWeight: '600',
  },
  groupBtn: {
    minHeight: 36,
    paddingHorizontal: 14,
    borderRadius: RADIUS.pill,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  badgeCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#E8ECF5',
  },
  badgeCardLocked: {
    opacity: 0.6,
  },
  badgeIconBubble: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  badgeUnlocked: {
    backgroundColor: COLORS.primary,
    borderWidth: 1.5,
    borderColor: COLORS.navy,
  },
  badgeLocked: {
    backgroundColor: '#E2E8F0',
  },
  badgeName: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
    color: COLORS.navy,
    textAlign: 'center',
  },
  badgeDesc: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.xs,
    color: COLORS.support,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 6,
  },
  badgeUnlockedLabel: {
    fontFamily: FONTS.family,
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.success,
  },
  badgeLockedLabel: {
    fontFamily: FONTS.family,
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  reviewCard: {
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  reviewTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  reviewAuthor: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
    color: COLORS.navy,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewComment: {
    fontFamily: FONTS.family,
    fontSize: FONTS.sizes.xs + 1,
    color: COLORS.navy,
    fontStyle: 'italic',
    lineHeight: 18,
    marginBottom: 8,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
