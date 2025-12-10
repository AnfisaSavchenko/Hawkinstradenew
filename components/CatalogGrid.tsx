import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Figure } from '@/types/hawkins';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COLUMN_GAP = 8;
const HORIZONTAL_PADDING = 16;
const NUM_COLUMNS = 3;
const ITEM_WIDTH = (SCREEN_WIDTH - HORIZONTAL_PADDING * 2 - COLUMN_GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS;

interface CatalogItemProps {
  figure: Figure;
  isSelling: boolean;
  isOwned: boolean;
  onPress: () => void;
}

function CatalogItem({ figure, isSelling, isOwned, onPress }: CatalogItemProps) {
  const { theme } = useTheme();

  const getDimmedOpacity = () => {
    if (isSelling) return 1;
    if (isOwned) return 0.8;
    return 0.4;
  };

  return (
    <TouchableOpacity
      style={[
        styles.item,
        {
          backgroundColor: theme.colors.cardBg,
          borderColor: isSelling ? theme.colors.primary : theme.colors.border,
          opacity: getDimmedOpacity(),
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Placeholder silhouette image */}
      <View style={[styles.imageContainer, { backgroundColor: theme.colors.surface }]}>
        <Image
          source={{ uri: `https://picsum.photos/seed/${figure.id}/120/140` }}
          style={styles.image}
          resizeMode="cover"
        />
        {isSelling && (
          <View style={[styles.sellingBadge, { backgroundColor: theme.colors.primary }]}>
            <Text style={styles.sellingText}>Selling</Text>
          </View>
        )}
      </View>

      {/* Figure Info */}
      <View style={styles.info}>
        <Text
          style={[styles.figureId, { color: theme.colors.textSecondary }]}
          numberOfLines={1}
        >
          {figure.id}
        </Text>
        <Text
          style={[styles.characterName, { color: theme.colors.text }]}
          numberOfLines={1}
        >
          {figure.character}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

interface CatalogGridProps {
  figures: Figure[];
  sellingFigureIds: string[];
  ownedFigureIds: string[];
  onItemPress: (figure: Figure) => void;
}

export default function CatalogGrid({
  figures,
  sellingFigureIds,
  ownedFigureIds,
  onItemPress,
}: CatalogGridProps) {
  return (
    <View style={styles.grid}>
      {figures.map((figure) => (
        <CatalogItem
          key={figure.id}
          figure={figure}
          isSelling={sellingFigureIds.includes(figure.id)}
          isOwned={ownedFigureIds.includes(figure.id)}
          onPress={() => onItemPress(figure)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: HORIZONTAL_PADDING,
    gap: COLUMN_GAP,
  },
  item: {
    width: ITEM_WIDTH,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: COLUMN_GAP,
  },
  imageContainer: {
    height: ITEM_WIDTH * 1.2,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  sellingBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  sellingText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    textTransform: 'uppercase',
  },
  info: {
    padding: 8,
  },
  figureId: {
    fontFamily: 'monospace',
    fontSize: 10,
    marginBottom: 2,
  },
  characterName: {
    fontFamily: 'serif',
    fontSize: 11,
    fontWeight: '600',
  },
});
