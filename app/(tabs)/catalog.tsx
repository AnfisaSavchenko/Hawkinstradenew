import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import HawkinsHeader from '@/components/HawkinsHeader';
import CatalogGrid from '@/components/CatalogGrid';
import FigurePreviewModal from '@/components/FigurePreviewModal';
import { Figure, OFFICIAL_FIGURES } from '@/types/hawkins';

export default function CatalogScreen() {
  const { theme } = useTheme();
  const [selectedFigure, setSelectedFigure] = useState<Figure | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleFigurePress = useCallback((figure: Figure) => {
    setSelectedFigure(figure);
    setIsModalVisible(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalVisible(false);
    setSelectedFigure(null);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <HawkinsHeader />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Archive Title */}
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: theme.colors.primary }]}>
            THE ARCHIVE
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            {OFFICIAL_FIGURES.length} Official Figures • VC259-VC356
          </Text>
        </View>

        {/* Decorative Divider */}
        <View style={styles.dividerContainer}>
          <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
          <Text style={[styles.dividerText, { color: theme.colors.primary }]}>◆ ◆ ◆</Text>
          <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
        </View>

        {/* Grid */}
        <CatalogGrid
          figures={OFFICIAL_FIGURES}
          onItemPress={handleFigurePress}
        />
      </ScrollView>

      {/* Figure Preview Modal */}
      <FigurePreviewModal
        visible={isModalVisible}
        figure={selectedFigure}
        onClose={handleCloseModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  titleContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  title: {
    fontFamily: 'serif',
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 6,
    textShadowColor: 'rgba(255, 21, 21, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontFamily: 'monospace',
    fontSize: 12,
    marginTop: 8,
    letterSpacing: 1,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 8,
    letterSpacing: 4,
  },
});
