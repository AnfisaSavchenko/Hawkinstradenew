import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Figure } from '@/types/hawkins';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COLUMN_GAP = 10;
const HORIZONTAL_PADDING = 16;
const NUM_COLUMNS = 3;
const ITEM_WIDTH = (SCREEN_WIDTH - HORIZONTAL_PADDING * 2 - COLUMN_GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS;

interface CatalogItemProps {
  figure: Figure;
  onPress: () => void;
}

function CatalogItem({ figure, onPress }: CatalogItemProps) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.item,
        {
          backgroundColor: theme.colors.cardBg,
          borderColor: theme.colors.primary,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Figure Image */}
      <View style={[styles.imageContainer, { backgroundColor: theme.colors.surface }]}>
        <Image
          source={figure.image}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      {/* Figure Info - File Label Style */}
      <View style={[styles.info, { borderTopColor: theme.colors.primary }]}>
        <Text
          style={[styles.figureId, { color: theme.colors.primary }]}
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
  onItemPress: (figure: Figure) => void;
}

export default function CatalogGrid({
  figures,
  onItemPress,
}: CatalogGridProps) {
  return (
    <View style={styles.grid}>
      {figures.map((figure) => (
        <CatalogItem
          key={figure.id}
          figure={figure}
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
    borderWidth: 2,
    overflow: 'hidden',
    marginBottom: COLUMN_GAP,
  },
  imageContainer: {
    height: ITEM_WIDTH * 1.2,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  info: {
    padding: 8,
    borderTopWidth: 1,
  },
  figureId: {
    fontFamily: 'monospace',
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 2,
    letterSpacing: 1,
  },
  characterName: {
    fontFamily: 'monospace',
    fontSize: 10,
    fontWeight: '600',
  },
});
