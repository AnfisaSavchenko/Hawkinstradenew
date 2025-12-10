import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import ItemDetailsModal from '@/components/ItemDetailsModal';
import { Listing } from '@/types/hawkins';
import {
  getListing,
  getListingsBySeller,
  getUserData,
  markAsSold,
  deleteListing,
} from '@/services/dataService';

export default function ListingDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const router = useRouter();

  const [listing, setListing] = useState<Listing | null>(null);
  const [moreBySeller, setMoreBySeller] = useState<Listing[]>([]);
  const [isOwner, setIsOwner] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!id) return;

    try {
      const [listingData, userData] = await Promise.all([
        getListing(id),
        getUserData(),
      ]);

      if (listingData) {
        setListing(listingData);
        setIsOwner(userData.listings.includes(listingData.id));

        // Get more listings from the same seller
        const sellerListings = await getListingsBySeller(listingData.sellerHandle);
        setMoreBySeller(
          sellerListings.filter((l) => l.id !== listingData.id).slice(0, 5)
        );
      }
    } catch (error) {
      console.error('Failed to load listing:', error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleClose = useCallback(() => {
    router.back();
  }, [router]);

  const handleMarkAsSold = useCallback(async () => {
    if (!listing) return;

    try {
      await markAsSold(listing.id);
      setListing({ ...listing, isSold: true });
    } catch (error) {
      console.error('Failed to mark as sold:', error);
    }
  }, [listing]);

  const handleDelete = useCallback(async () => {
    if (!listing) return;

    try {
      await deleteListing(listing.id);
      router.back();
    } catch (error) {
      console.error('Failed to delete listing:', error);
    }
  }, [listing, router]);

  const handleSellerPress = useCallback(
    (sellerHandle: string) => {
      // Navigate back to market with seller filter
      router.replace({
        pathname: '/(tabs)',
        params: { filterSeller: sellerHandle },
      });
    },
    [router]
  );

  const handleRelatedItemPress = useCallback(
    (relatedListing: Listing) => {
      // Navigate to the related listing
      router.push(`/listing/${relatedListing.id}`);
    },
    [router]
  );

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </View>
    );
  }

  if (!listing) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.colors.textSecondary }]}>
            Listing not found
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ItemDetailsModal
        listing={listing}
        moreBySeller={moreBySeller}
        isOwner={isOwner}
        onClose={handleClose}
        onMarkAsSold={handleMarkAsSold}
        onDelete={handleDelete}
        onSellerPress={handleSellerPress}
        onRelatedItemPress={handleRelatedItemPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontFamily: 'monospace',
    fontSize: 14,
  },
});
