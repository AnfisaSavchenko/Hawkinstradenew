import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Text,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import HawkinsHeader from '@/components/HawkinsHeader';
import ListingCard from '@/components/ListingCard';
import FilterChips, { FilterType } from '@/components/FilterChips';
import { Listing, OFFICIAL_FIGURES } from '@/types/hawkins';
import {
  getListings,
  getUniqueCharacters,
  getUniqueLocations,
  getUniqueSellers,
} from '@/services/dataService';

interface FilterOption {
  type: FilterType;
  value: string;
  label: string;
}

export default function MarketScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterOption | null>(null);

  // Filter options
  const [characters, setCharacters] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [sellers, setSellers] = useState<string[]>([]);

  const loadData = useCallback(async () => {
    try {
      const [listingsData, chars, locs, sels] = await Promise.all([
        getListings(),
        getUniqueCharacters(),
        getUniqueLocations(),
        getUniqueSellers(),
      ]);

      setListings(listingsData);
      setCharacters(chars);
      setLocations(locs);
      setSellers(sels);
    } catch (error) {
      console.error('Failed to load listings:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Apply filters
  useEffect(() => {
    if (!activeFilter) {
      setFilteredListings(listings);
      return;
    }

    const filtered = listings.filter((listing) => {
      switch (activeFilter.type) {
        case 'character':
          const figure = OFFICIAL_FIGURES.find((f) => f.id === listing.figureId);
          return figure?.character === activeFilter.value;
        case 'location':
          return listing.location === activeFilter.value;
        case 'seller':
          return listing.sellerHandle === activeFilter.value;
        default:
          return true;
      }
    });

    setFilteredListings(filtered);
  }, [activeFilter, listings]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    loadData();
  }, [loadData]);

  const handleListingPress = useCallback(
    (listing: Listing) => {
      router.push(`/listing/${listing.id}`);
    },
    [router]
  );

  const handleSellerPress = useCallback(
    (sellerHandle: string) => {
      setActiveFilter({
        type: 'seller',
        value: sellerHandle,
        label: sellerHandle,
      });
    },
    []
  );

  const handleFilterChange = useCallback((filter: FilterOption | null) => {
    setActiveFilter(filter);
  }, []);

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <HawkinsHeader />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
            Loading the Upside Down...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <HawkinsHeader />

      <FilterChips
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        characters={characters}
        locations={locations}
        sellers={sellers}
      />

      <FlatList
        data={filteredListings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListingCard
            listing={item}
            onPress={() => handleListingPress(item)}
            onSellerPress={() => handleSellerPress(item.sellerHandle)}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyIcon]}>👻</Text>
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              {activeFilter
                ? 'No listings match your filter'
                : 'No listings yet. Be the first!'}
            </Text>
          </View>
        }
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
  loadingText: {
    fontFamily: 'monospace',
    fontSize: 14,
    marginTop: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontFamily: 'monospace',
    fontSize: 14,
    textAlign: 'center',
  },
});
