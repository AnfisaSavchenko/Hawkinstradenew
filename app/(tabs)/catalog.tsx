import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  RefreshControl,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import HawkinsHeader from '@/components/HawkinsHeader';
import CatalogGrid from '@/components/CatalogGrid';
import { Figure, OFFICIAL_FIGURES } from '@/types/hawkins';
import { getUserSellingFigures, clearAllData } from '@/services/dataService';

export default function CatalogScreen() {
  const { theme } = useTheme();
  const [sellingFigures, setSellingFigures] = useState<string[]>([]);
  const [ownedFigures, setOwnedFigures] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [cleanSlateCount, setCleanSlateCount] = useState(0);

  const loadData = useCallback(async () => {
    try {
      const selling = await getUserSellingFigures();
      setSellingFigures(selling);
      // For demo, mark owned figures as the ones user has ever listed
      setOwnedFigures(selling);
    } catch (error) {
      console.error('Failed to load catalog data:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    loadData();
  }, [loadData]);

  const handleFigurePress = useCallback((figure: Figure) => {
    Alert.alert(
      figure.name,
      `Figure ID: ${figure.id}\nCharacter: ${figure.character}\n\n${
        sellingFigures.includes(figure.id)
          ? '✅ You are currently selling this figure'
          : ownedFigures.includes(figure.id)
          ? '📦 In your collection'
          : '❓ Not in your collection'
      }`,
      [{ text: 'OK' }]
    );
  }, [sellingFigures, ownedFigures]);

  // Hidden Clean Slate trigger (tap title 5 times)
  const handleCleanSlate = useCallback(async () => {
    const newCount = cleanSlateCount + 1;
    setCleanSlateCount(newCount);

    if (newCount >= 5) {
      setCleanSlateCount(0);
      Alert.alert(
        '🌀 Clean Slate',
        'Are you sure you want to reset all data? This will wipe all listings and restore the initial mock data.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Reset Everything',
            style: 'destructive',
            onPress: async () => {
              try {
                await clearAllData();
                loadData();
                Alert.alert('Done!', 'The slate has been cleaned. Pull down to refresh.');
              } catch {
                Alert.alert('Error', 'Failed to clear data.');
              }
            },
          },
        ]
      );
    }
  }, [cleanSlateCount, loadData]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <HawkinsHeader />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
      >
        {/* Archive Title */}
        <TouchableOpacity onPress={handleCleanSlate} activeOpacity={1}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: theme.colors.primary }]}>
              THE ARCHIVE
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              24 Official Figures • VC259-VC282
            </Text>
          </View>
        </TouchableOpacity>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={[styles.statBox, { borderColor: theme.colors.border }]}>
            <Text style={[styles.statNumber, { color: theme.colors.secondary }]}>
              {sellingFigures.length}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              Selling
            </Text>
          </View>
          <View style={[styles.statBox, { borderColor: theme.colors.border }]}>
            <Text style={[styles.statNumber, { color: theme.colors.text }]}>
              {ownedFigures.length}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              Owned
            </Text>
          </View>
          <View style={[styles.statBox, { borderColor: theme.colors.border }]}>
            <Text style={[styles.statNumber, { color: theme.colors.primary }]}>
              {24 - ownedFigures.length}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              Missing
            </Text>
          </View>
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: theme.colors.primary }]} />
            <Text style={[styles.legendText, { color: theme.colors.textSecondary }]}>
              Currently Selling
            </Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: theme.colors.textSecondary, opacity: 0.4 }]} />
            <Text style={[styles.legendText, { color: theme.colors.textSecondary }]}>
              Not Owned (Dimmed)
            </Text>
          </View>
        </View>

        {/* Grid */}
        <CatalogGrid
          figures={OFFICIAL_FIGURES}
          sellingFigureIds={sellingFigures}
          ownedFigureIds={ownedFigures}
          onItemPress={handleFigurePress}
        />
      </ScrollView>
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
    paddingVertical: 20,
  },
  title: {
    fontFamily: 'serif',
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 4,
    textShadowColor: 'rgba(255, 21, 21, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontFamily: 'monospace',
    fontSize: 12,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 20,
    gap: 12,
  },
  statBox: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontFamily: 'monospace',
    fontSize: 28,
    fontWeight: 'bold',
  },
  statLabel: {
    fontFamily: 'monospace',
    fontSize: 10,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontFamily: 'monospace',
    fontSize: 10,
  },
});
