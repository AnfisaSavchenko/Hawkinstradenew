import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import HawkinsHeader from '@/components/HawkinsHeader';
import ListingCard from '@/components/ListingCard';
import FilterChips, { FilterType } from '@/components/FilterChips';
import TradeModal from '@/components/TradeModal';
import { Listing, OFFICIAL_FIGURES, ListingType } from '@/types/hawkins';
import {
  getListings,
  getUniqueCharacters,
  getUniqueCountries,
  addListing,
} from '@/services/dataService';

interface FilterOption {
  type: FilterType;
  value: string;
  label: string;
}

export default function MarketScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterOption | null>(null);
  const [isTradeModalVisible, setIsTradeModalVisible] = useState(false);

  // Filter options
  const [characters, setCharacters] = useState<string[]>([]);
  const [countries, setCountries] = useState<string[]>([]);

  const loadData = useCallback(async () => {
    try {
      const [listingsData, chars, ctries] = await Promise.all([
        getListings(),
        getUniqueCharacters(),
        getUniqueCountries(),
      ]);

      setListings(listingsData);
      setCharacters(chars);
      setCountries(ctries);
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
        case 'type':
          return listing.listingType === (activeFilter.value as ListingType);
        case 'character':
          const figure = OFFICIAL_FIGURES.find((f) => f.id === listing.figureId);
          return figure?.character === activeFilter.value;
        case 'country':
          // Match if location ends with the selected country
          return listing.location.trim().endsWith(activeFilter.value);
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
    (_sellerHandle: string) => {
      // Seller filter removed - could navigate to seller profile in future
    },
    []
  );

  const handleFilterChange = useCallback((filter: FilterOption | null) => {
    setActiveFilter(filter);
  }, []);

  const handleTradeSubmit = useCallback(
    async (listing: Omit<Listing, 'id' | 'createdAt'>) => {
      await addListing(listing);
      setIsTradeModalVisible(false);
      loadData();
    },
    [loadData]
  );

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
        countries={countries}
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

      {/* FAB - Floating Action Button */}
      <TouchableOpacity
        style={[
          styles.fab,
          {
            backgroundColor: theme.colors.secondary,
            bottom: 20 + insets.bottom,
          },
        ]}
        onPress={() => setIsTradeModalVisible(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      {/* Trade Modal */}
      <TradeModal
        visible={isTradeModalVisible}
        onClose={() => setIsTradeModalVisible(false)}
        onSubmit={handleTradeSubmit}
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
    paddingBottom: 100,
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
  fab: {
    position: 'absolute',
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  fabIcon: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '300',
    marginTop: -2,
  },
});
