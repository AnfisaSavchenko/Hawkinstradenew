import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Figure } from '@/types/hawkins';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COLUMN_GAP = 10;
const HORIZONTAL_PADDING = 16;
const NUM_COLUMNS = 3;
const ITEM_WIDTH = (SCREEN_WIDTH - HORIZONTAL_PADDING * 2 - COLUMN_GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS;

// Pen doodle decorations for analog dossier feel
const PEN_DOODLES = [
  { type: 'star', source: require('@/assets/dossier/pen_star.png') },
  { type: 'circle', source: require('@/assets/dossier/pen_circle.png') },
  { type: 'underline', source: require('@/assets/dossier/pen_underline.png') },
];

// Deterministic "random" doodle selection based on figure ID
function getDoodleForFigure(figureId: string): { doodle: typeof PEN_DOODLES[number]; position: { top?: number; bottom?: number; left?: number; right?: number; rotation: number } } | null {
  // Simple hash function to get a number from the figure ID
  const hash = figureId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  // Only about 20% of items get a doodle
  if (hash % 5 !== 0) return null;

  const doodleIndex = hash % PEN_DOODLES.length;
  const doodle = PEN_DOODLES[doodleIndex];

  // Varied positions for a hand-annotated feel
  const positions = [
    { top: -5, right: -5, rotation: 15 },
    { top: 5, left: -5, rotation: -20 },
    { bottom: 25, right: 5, rotation: 10 },
    { bottom: 30, left: 5, rotation: -15 },
  ];

  const positionIndex = Math.floor(hash / 10) % positions.length;

  return { doodle, position: positions[positionIndex] };
}

interface CatalogItemProps {
  figure: Figure;
  onPress: () => void;
}

function CatalogItem({ figure, onPress }: CatalogItemProps) {
  const { theme } = useTheme();
  const isUpsideDown = theme.mode === 'upsideDown';
  const doodleData = getDoodleForFigure(figure.id);

  return (
    <TouchableOpacity
      style={[
        styles.item,
        {
          backgroundColor: theme.colors.cardBg,
          borderColor: isUpsideDown ? 'transparent' : theme.colors.primary,
          borderWidth: isUpsideDown ? 0 : 2,
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

      {/* Hand-drawn pen doodle annotations */}
      {doodleData && (
        <Image
          source={doodleData.doodle.source}
          style={[
            styles.doodleOverlay,
            {
              top: doodleData.position.top,
              bottom: doodleData.position.bottom,
              left: doodleData.position.left,
              right: doodleData.position.right,
              transform: [{ rotate: `${doodleData.position.rotation}deg` }],
              width: doodleData.doodle.type === 'underline' ? 45 : 32,
              height: doodleData.doodle.type === 'underline' ? 12 : 32,
            },
          ]}
          resizeMode="contain"
        />
      )}

      {/* Figure Info - File Label Style */}
      <View
        style={[
          styles.info,
          {
            borderTopColor: isUpsideDown ? 'transparent' : theme.colors.primary,
            borderTopWidth: isUpsideDown ? 0 : 1,
          },
        ]}
      >
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
    overflow: 'visible',
    marginBottom: COLUMN_GAP,
  },
  imageContainer: {
    height: ITEM_WIDTH * 1.2,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  doodleOverlay: {
    position: 'absolute',
    opacity: 0.8,
    zIndex: 10,
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
