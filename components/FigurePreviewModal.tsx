import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { Figure } from '@/types/hawkins';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface FigurePreviewModalProps {
  visible: boolean;
  figure: Figure | null;
  onClose: () => void;
}

export default function FigurePreviewModal({
  visible,
  figure,
  onClose,
}: FigurePreviewModalProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  if (!figure) return null;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, { backgroundColor: 'rgba(0, 0, 0, 0.95)' }]}>
        <View
          style={[
            styles.container,
            {
              backgroundColor: theme.colors.background,
              paddingTop: insets.top + 16,
              paddingBottom: insets.bottom + 16,
            },
          ]}
        >
          {/* Close Button */}
          <TouchableOpacity
            style={[
              styles.closeButton,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.primary,
                top: insets.top + 16,
              },
            ]}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={[styles.closeButtonText, { color: theme.colors.primary }]}>✕</Text>
          </TouchableOpacity>

          {/* Hero Image Container */}
          <View
            style={[
              styles.heroContainer,
              {
                borderColor: theme.colors.primary,
                backgroundColor: theme.colors.cardBg,
              },
            ]}
          >
            {/* Neon glow effect */}
            <View
              style={[
                styles.glowEffect,
                {
                  shadowColor: theme.colors.primary,
                },
              ]}
            />
            <Image
              source={figure.image}
              style={styles.heroImage}
              resizeMode="contain"
            />
          </View>

          {/* Figure Info */}
          <View style={styles.infoContainer}>
            {/* VC Number Badge */}
            <View
              style={[
                styles.idBadge,
                {
                  backgroundColor: theme.colors.primary,
                  borderColor: theme.colors.primary,
                },
              ]}
            >
              <Text style={styles.idBadgeText}>{figure.id}</Text>
            </View>

            {/* Character Name */}
            <Text
              style={[
                styles.characterName,
                {
                  color: theme.colors.text,
                  textShadowColor: theme.colors.primary + '80',
                },
              ]}
            >
              {figure.character}
            </Text>

            {/* Full Figure Name */}
            <Text
              style={[
                styles.figureName,
                {
                  color: theme.colors.textSecondary,
                },
              ]}
            >
              {figure.name}
            </Text>

            {/* Decorative divider */}
            <View style={styles.dividerContainer}>
              <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
              <Text style={[styles.dividerIcon, { color: theme.colors.primary }]}>◆</Text>
              <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
            </View>

            {/* Archive Label */}
            <View style={[styles.archiveLabel, { borderColor: theme.colors.border }]}>
              <Text style={[styles.archiveLabelText, { color: theme.colors.textSecondary }]}>
                OFFICIAL ARCHIVE
              </Text>
            </View>
          </View>

          {/* Close Button at Bottom */}
          <TouchableOpacity
            style={[
              styles.bottomCloseButton,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.primary,
              },
            ]}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={[styles.bottomCloseButtonText, { color: theme.colors.primary }]}>
              CLOSE
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  heroContainer: {
    width: SCREEN_WIDTH - 80,
    height: SCREEN_HEIGHT * 0.4,
    borderWidth: 3,
    borderRadius: 16,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#ff1515',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  glowEffect: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: 20,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 30,
      },
    }),
  },
  heroImage: {
    width: '90%',
    height: '90%',
  },
  infoContainer: {
    alignItems: 'center',
    marginTop: 32,
    paddingHorizontal: 20,
  },
  idBadge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 4,
    borderWidth: 1,
    marginBottom: 16,
  },
  idBadgeText: {
    color: '#ffffff',
    fontFamily: 'monospace',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  characterName: {
    fontFamily: 'serif',
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 2,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
    marginBottom: 8,
  },
  figureName: {
    fontFamily: 'monospace',
    fontSize: 14,
    textAlign: 'center',
    letterSpacing: 1,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    width: 200,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerIcon: {
    marginHorizontal: 12,
    fontSize: 10,
  },
  archiveLabel: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderWidth: 1,
    borderRadius: 4,
  },
  archiveLabelText: {
    fontFamily: 'monospace',
    fontSize: 10,
    letterSpacing: 3,
  },
  bottomCloseButton: {
    position: 'absolute',
    bottom: 40,
    paddingHorizontal: 48,
    paddingVertical: 14,
    borderWidth: 2,
    borderRadius: 8,
  },
  bottomCloseButtonText: {
    fontFamily: 'monospace',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
});
