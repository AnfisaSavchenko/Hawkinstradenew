import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Listing } from '@/types/hawkins';

interface ListingCardProps {
  listing: Listing;
  onPress: () => void;
  onSellerPress: () => void;
}

export default function ListingCard({ listing, onPress, onSellerPress }: ListingCardProps) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.cardBg,
          borderColor: theme.colors.border,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {/* Hero Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: listing.imageUri }}
          style={styles.image}
          resizeMode="cover"
        />
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
        <Text
          style={[styles.title, { color: theme.colors.text }]}
          numberOfLines={1}
        >
          {listing.title}
        </Text>

        <View style={styles.priceRow}>
          <Text style={[styles.price, { color: theme.colors.primary }]}>
            ${listing.price.toFixed(2)}
          </Text>
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

        <TouchableOpacity onPress={onSellerPress}>
          <Text style={[styles.seller, { color: theme.colors.textSecondary }]}>
            Seller: <Text style={[styles.sellerHandle, { color: theme.colors.secondary }]}>
              {listing.sellerHandle}
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
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
  seller: {
    fontFamily: 'monospace',
    fontSize: 12,
  },
  sellerHandle: {
    fontWeight: '600',
  },
});
