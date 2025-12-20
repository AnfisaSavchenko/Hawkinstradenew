import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Listing, getFigureById, getFigureImage } from '@/types/hawkins';

interface ListingCardProps {
  listing: Listing;
  onPress: () => void;
  onSellerPress: () => void;
}

export default function ListingCard({ listing, onPress, onSellerPress }: ListingCardProps) {
  const { theme } = useTheme();
  const isUpsideDown = theme.mode === 'upsideDown';

  const figure = getFigureById(listing.figureId);
  const targetFigure = listing.swapTargetId ? getFigureById(listing.swapTargetId) : null;
  const figureImage = getFigureImage(listing.figureId);

  // Use user-uploaded photo if available, otherwise fall back to stock figure image
  const displayImage = listing.userImageUri ? { uri: listing.userImageUri } : figureImage;

  const getTypeColor = () => {
    switch (listing.listingType) {
      case 'sell': return theme.colors.primary;
      case 'swap': return theme.colors.swap;
      case 'iso': return theme.colors.iso;
      default: return theme.colors.primary;
    }
  };

  const getTypeBadge = () => {
    switch (listing.listingType) {
      case 'sell': return '💰 FOR SALE';
      case 'swap': return '⇄ SWAP';
      case 'iso': return '🔍 ISO';
      default: return '';
    }
  };

  const isIso = listing.listingType === 'iso';
  const isSwap = listing.listingType === 'swap';

  // In Upside Down mode, remove borders; in Real World mode, keep neon borders
  const getBorderStyle = () => {
    if (isUpsideDown) {
      return {
        borderColor: 'transparent',
        borderWidth: 0,
      };
    }
    return {
      borderColor: isIso ? theme.colors.iso : theme.colors.border,
      borderStyle: isIso ? 'dashed' as const : 'solid' as const,
      borderWidth: isIso ? 2 : 1,
    };
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.cardBg,
          ...getBorderStyle(),
        },
      ]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {/* Hero Image */}
      <View style={styles.imageContainer}>
        <Image
          source={displayImage}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Type Badge */}
        <View style={[styles.typeBadge, { backgroundColor: getTypeColor() }]}>
          <Text style={styles.typeBadgeText}>{getTypeBadge()}</Text>
        </View>

        {/* SOLD Stamp Overlay */}
        {listing.isSold && (
          <View style={styles.soldOverlay}>
            <View style={[styles.soldStamp, { borderColor: theme.colors.sold }]}>
              <Text style={[styles.soldText, { color: theme.colors.sold }]}>SOLD</Text>
            </View>
          </View>
        )}

        {/* Favorite Button */}
        <TouchableOpacity style={styles.favoriteButton} activeOpacity={0.7}>
          <Text style={styles.favoriteIcon}>♡</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Title */}
        <Text
          style={[styles.title, { color: theme.colors.text }]}
          numberOfLines={1}
        >
          {isIso ? `ISO: ${figure?.character || listing.figureId}` : listing.title}
        </Text>

        {/* Price/Swap Info Row */}
        <View style={styles.priceRow}>
          {isSwap ? (
            // Swap display
            <View style={styles.swapInfo}>
              <Text style={[styles.swapIcon, { color: theme.colors.swap }]}>⇄</Text>
              <Text style={[styles.swapText, { color: theme.colors.swap }]}>
                Wants: {targetFigure?.character || 'Any'}
              </Text>
            </View>
          ) : (
            // Price display (Sell or ISO)
            <Text style={[styles.price, { color: getTypeColor() }]}>
              {isIso ? `Max: $${listing.price.toFixed(2)}` : `$${listing.price.toFixed(2)}`}
            </Text>
          )}

          <View
            style={[
              styles.conditionBadge,
              { backgroundColor: theme.colors.accent },
            ]}
          >
            <Text style={[styles.conditionText, { color: theme.colors.text }]}>
              {listing.condition}
            </Text>
          </View>
        </View>

        {/* Swap target thumbnail */}
        {isSwap && targetFigure && (
          <View style={styles.swapTargetRow}>
            <Image
              source={getFigureImage(listing.swapTargetId!)}
              style={styles.swapTargetThumb}
              resizeMode="cover"
            />
            <Text style={[styles.swapTargetText, { color: theme.colors.textSecondary }]}>
              {targetFigure.id} - {targetFigure.name}
            </Text>
          </View>
        )}

        {/* Seller with pen doodle annotation */}
        <View style={styles.sellerRow}>
          <TouchableOpacity onPress={onSellerPress} style={styles.sellerTouchable}>
            <Text style={[styles.seller, { color: theme.colors.textSecondary }]}>
              {isIso ? 'Buyer: ' : 'Seller: '}
              <Text style={[styles.sellerHandle, { color: theme.colors.secondary }]}>
                {listing.sellerHandle}
              </Text>
            </Text>
          </TouchableOpacity>
          <Image
            source={require('@/assets/dossier/pen_star.png')}
            style={styles.sellerDoodle}
            resizeMode="contain"
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  imageContainer: {
    height: 280,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1a1a1a',
  },
  typeBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  typeBadgeText: {
    color: '#fff',
    fontFamily: 'monospace',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  soldOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  soldStamp: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderWidth: 4,
    borderRadius: 8,
    transform: [{ rotate: '-15deg' }],
    backgroundColor: 'rgba(30, 7, 7, 0.8)',
  },
  soldText: {
    fontFamily: 'serif',
    fontSize: 36,
    fontWeight: 'bold',
    letterSpacing: 6,
    textTransform: 'uppercase',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteIcon: {
    fontSize: 20,
    color: '#ff6b6b',
  },
  content: {
    padding: 16,
  },
  title: {
    fontFamily: 'serif',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  price: {
    fontFamily: 'monospace',
    fontSize: 20,
    fontWeight: 'bold',
  },
  swapInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  swapIcon: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  swapText: {
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: '600',
  },
  swapTargetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
  },
  swapTargetThumb: {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: '#1a1a1a',
  },
  swapTargetText: {
    fontFamily: 'monospace',
    fontSize: 11,
    flex: 1,
  },
  conditionBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  conditionText: {
    fontFamily: 'monospace',
    fontSize: 11,
    fontWeight: '600',
  },
  sellerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sellerTouchable: {
    flex: 1,
  },
  seller: {
    fontFamily: 'monospace',
    fontSize: 12,
  },
  sellerHandle: {
    fontWeight: '600',
  },
  sellerDoodle: {
    width: 18,
    height: 18,
    opacity: 0.6,
    transform: [{ rotate: '-15deg' }],
  },
});
