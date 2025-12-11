import AsyncStorage from '@react-native-async-storage/async-storage';
import { Listing, UserData, OFFICIAL_FIGURES, ListingType } from '@/types/hawkins';

const STORAGE_KEYS = {
  LISTINGS: 'hawkins_trade_listings_v3',
  USER_DATA: 'hawkins_trade_user_v3',
  INITIALIZED: 'hawkins_trade_initialized_v3',
};

// Generate a unique ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Initial seed data - empty for fresh start (users create their own listings)
const MOCK_LISTINGS: Listing[] = [];

// Default current user
const DEFAULT_USER: UserData = {
  id: 'current_user',
  handle: '@CurrentUser',
  listings: [],
  favorites: [],
};

// Initialize the app with seed data
export async function initializeApp(): Promise<void> {
  try {
    const initialized = await AsyncStorage.getItem(STORAGE_KEYS.INITIALIZED);
    if (initialized) return;

    await AsyncStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(MOCK_LISTINGS));
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(DEFAULT_USER));
    await AsyncStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  } catch (error) {
    console.error('Failed to initialize app:', error);
  }
}

// Get all listings
export async function getListings(): Promise<Listing[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.LISTINGS);
    if (!data) return [];
    const listings = JSON.parse(data) as Listing[];
    return listings.sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.error('Failed to get listings:', error);
    return [];
  }
}

// Get a single listing by ID
export async function getListing(id: string): Promise<Listing | null> {
  try {
    const listings = await getListings();
    return listings.find((l) => l.id === id) || null;
  } catch (error) {
    console.error('Failed to get listing:', error);
    return null;
  }
}

// Get listings by seller handle
export async function getListingsBySeller(sellerHandle: string): Promise<Listing[]> {
  try {
    const listings = await getListings();
    return listings.filter((l) => l.sellerHandle === sellerHandle);
  } catch (error) {
    console.error('Failed to get listings by seller:', error);
    return [];
  }
}

// Add a new listing
export async function addListing(listing: Omit<Listing, 'id' | 'createdAt'>): Promise<Listing> {
  try {
    const listings = await getListings();
    const newListing: Listing = {
      ...listing,
      id: generateId(),
      createdAt: Date.now(),
    };
    listings.unshift(newListing);
    await AsyncStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(listings));

    // Update user data
    const userData = await getUserData();
    userData.listings.push(newListing.id);
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));

    return newListing;
  } catch (error) {
    console.error('Failed to add listing:', error);
    throw error;
  }
}

// Update a listing
export async function updateListing(id: string, updates: Partial<Listing>): Promise<Listing | null> {
  try {
    const listings = await getListings();
    const index = listings.findIndex((l) => l.id === id);
    if (index === -1) return null;

    listings[index] = { ...listings[index], ...updates };
    await AsyncStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(listings));
    return listings[index];
  } catch (error) {
    console.error('Failed to update listing:', error);
    return null;
  }
}

// Delete a listing
export async function deleteListing(id: string): Promise<boolean> {
  try {
    const listings = await getListings();
    const filtered = listings.filter((l) => l.id !== id);
    await AsyncStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(filtered));

    // Update user data
    const userData = await getUserData();
    userData.listings = userData.listings.filter((lid) => lid !== id);
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));

    return true;
  } catch (error) {
    console.error('Failed to delete listing:', error);
    return false;
  }
}

// Mark listing as sold
export async function markAsSold(id: string): Promise<Listing | null> {
  return updateListing(id, { isSold: true });
}

// Get user data
export async function getUserData(): Promise<UserData> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    if (!data) return DEFAULT_USER;
    return JSON.parse(data) as UserData;
  } catch (error) {
    console.error('Failed to get user data:', error);
    return DEFAULT_USER;
  }
}

// Update user data
export async function updateUserData(updates: Partial<UserData>): Promise<UserData> {
  try {
    const userData = await getUserData();
    const updated = { ...userData, ...updates };
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Failed to update user data:', error);
    throw error;
  }
}

// Clear all data (Clean Slate)
export async function clearAllData(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.LISTINGS,
      STORAGE_KEYS.USER_DATA,
      STORAGE_KEYS.INITIALIZED,
    ]);
    // Re-initialize with fresh data
    await initializeApp();
  } catch (error) {
    console.error('Failed to clear data:', error);
    throw error;
  }
}

// Get figures the current user is selling
export async function getUserSellingFigures(): Promise<string[]> {
  try {
    const userData = await getUserData();
    const listings = await getListings();
    const userListings = listings.filter(
      (l) => userData.listings.includes(l.id) && !l.isSold
    );
    return userListings.map((l) => l.figureId);
  } catch (error) {
    console.error('Failed to get user selling figures:', error);
    return [];
  }
}

// Get unique sellers
export async function getUniqueSellers(): Promise<string[]> {
  try {
    const listings = await getListings();
    const sellers = [...new Set(listings.map((l) => l.sellerHandle))];
    return sellers;
  } catch (error) {
    console.error('Failed to get unique sellers:', error);
    return [];
  }
}

// Get unique locations
export async function getUniqueLocations(): Promise<string[]> {
  try {
    const listings = await getListings();
    const locations = [...new Set(listings.map((l) => l.location))];
    return locations;
  } catch (error) {
    console.error('Failed to get unique locations:', error);
    return [];
  }
}

// Get unique characters from listings
export async function getUniqueCharacters(): Promise<string[]> {
  try {
    const listings = await getListings();
    const figureIds = [...new Set(listings.map((l) => l.figureId))];
    const characters = figureIds
      .map((id) => OFFICIAL_FIGURES.find((f) => f.id === id)?.character)
      .filter((c): c is string => !!c);
    return [...new Set(characters)];
  } catch (error) {
    console.error('Failed to get unique characters:', error);
    return [];
  }
}

// Get unique listing types
export async function getUniqueListingTypes(): Promise<ListingType[]> {
  try {
    const listings = await getListings();
    const types = [...new Set(listings.map((l) => l.listingType))];
    return types;
  } catch (error) {
    console.error('Failed to get unique listing types:', error);
    return [];
  }
}

// Get unique countries from location strings (format: "City, Country")
export async function getUniqueCountries(): Promise<string[]> {
  try {
    const listings = await getListings();
    const countries = listings
      .map((l) => {
        const parts = l.location.split(',');
        if (parts.length >= 2) {
          return parts[parts.length - 1].trim();
        }
        return null;
      })
      .filter((c): c is string => c !== null && c.length > 0);
    return [...new Set(countries)].sort();
  } catch (error) {
    console.error('Failed to get unique countries:', error);
    return [];
  }
}
