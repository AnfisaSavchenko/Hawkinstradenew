import AsyncStorage from '@react-native-async-storage/async-storage';
import { Listing, UserData, OFFICIAL_FIGURES, ListingType } from '@/types/hawkins';

const STORAGE_KEYS = {
  LISTINGS: 'hawkins_trade_listings_v2',
  USER_DATA: 'hawkins_trade_user_v2',
  INITIALIZED: 'hawkins_trade_initialized_v2',
};

// Generate a unique ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Mock Community Listings for initial seed - includes Sell, Swap, and ISO types
const MOCK_LISTINGS: Listing[] = [
  // SELL listings
  {
    id: 'mock_1',
    figureId: 'VC259',
    title: 'VC259 Will Byers - The Vanishing',
    price: 120,
    condition: 'Mint in Box',
    location: 'Hawkins, IN',
    description: 'Rare VC259 Will figure, still in original packaging. Slight wear on the corners of the box. From a smoke-free home in Hawkins.',
    imageUri: '',
    sellerId: 'seller_1',
    sellerHandle: '@MikeWheeler_84',
    contactMethods: [
      { type: 'instagram', username: '@MikeWheeler_84' },
      { type: 'email', username: 'mike.wheeler@hawkins.edu' },
    ],
    isSold: false,
    createdAt: Date.now() - 86400000 * 2,
    listingType: 'sell',
  },
  {
    id: 'mock_2',
    figureId: 'VC271',
    title: 'VC271 Demogorgon - The Monster',
    price: 330,
    condition: 'Loose, Complete',
    location: 'Indianapolis, IN',
    description: 'The legendary Demogorgon figure. All parts included. Perfect for collectors who want to display without box.',
    imageUri: '',
    sellerId: 'seller_2',
    sellerHandle: '@DustinHenderson',
    contactMethods: [
      { type: 'instagram', username: '@DustinHenderson' },
      { type: 'tiktok', username: '@dusty_bun' },
    ],
    isSold: true,
    createdAt: Date.now() - 86400000 * 5,
    listingType: 'sell',
  },
  {
    id: 'mock_3',
    figureId: 'VC269',
    title: 'VC269 Eleven - The Psychic',
    price: 250,
    condition: 'Near Mint',
    location: 'Chicago, IL',
    description: 'Eleven figure in near mint condition. Minor shelf wear only. A must-have for any serious collector.',
    imageUri: '',
    sellerId: 'seller_3',
    sellerHandle: '@HopperChief',
    contactMethods: [
      { type: 'email', username: 'jim.hopper@hawkinspd.gov' },
    ],
    isSold: false,
    createdAt: Date.now() - 86400000 * 1,
    listingType: 'sell',
  },
  {
    id: 'mock_4',
    figureId: 'VC263',
    title: 'VC263 Jim Hopper - The Chief',
    price: 180,
    condition: 'Excellent',
    location: 'Hawkins, IN',
    description: 'Chief Hopper figure. Great condition, adult owned.',
    imageUri: '',
    sellerId: 'seller_1',
    sellerHandle: '@MikeWheeler_84',
    contactMethods: [
      { type: 'instagram', username: '@MikeWheeler_84' },
    ],
    isSold: false,
    createdAt: Date.now() - 86400000 * 3,
    listingType: 'sell',
  },
  // SWAP listings
  {
    id: 'mock_5',
    figureId: 'VC267',
    title: 'VC267 Steve Harrington - The Protector',
    price: 0,
    condition: 'Mint in Box',
    location: 'Los Angeles, CA',
    description: 'Have Steve in Mint condition. Looking to swap for Eleven or Vecna figure. Can add cash for the right deal.',
    imageUri: '',
    sellerId: 'seller_4',
    sellerHandle: '@MaxMayfield',
    contactMethods: [
      { type: 'instagram', username: '@MaxMayfield' },
      { type: 'tiktok', username: '@mad_max_sk8' },
    ],
    isSold: false,
    createdAt: Date.now() - 86400000 * 0.5,
    listingType: 'swap',
    swapTargetId: 'VC269',
  },
  {
    id: 'mock_6',
    figureId: 'VC268',
    title: 'VC268 Steve Harrington - Upside Down',
    price: 0,
    condition: 'Good',
    location: 'Denver, CO',
    description: 'Upside Down Steve looking to swap for any Demogorgon variant. DM me!',
    imageUri: '',
    sellerId: 'seller_2',
    sellerHandle: '@DustinHenderson',
    contactMethods: [
      { type: 'instagram', username: '@DustinHenderson' },
    ],
    isSold: false,
    createdAt: Date.now() - 86400000 * 4,
    listingType: 'swap',
    swapTargetId: 'VC271',
  },
  {
    id: 'mock_7',
    figureId: 'VC261',
    title: 'VC261 Dustin Henderson - The Brain',
    price: 0,
    condition: 'Near Mint',
    location: 'Austin, TX',
    description: 'Trading my Dustin for Eddie. Fair swap only!',
    imageUri: '',
    sellerId: 'seller_5',
    sellerHandle: '@NancyDrew_67',
    contactMethods: [
      { type: 'email', username: 'nancy.wheeler@hawkins.edu' },
      { type: 'instagram', username: '@NancyDrew_67' },
    ],
    isSold: false,
    createdAt: Date.now() - 86400000 * 2.5,
    listingType: 'swap',
    swapTargetId: 'VC288',
  },
  // ISO (In Search Of) listings
  {
    id: 'mock_8',
    figureId: 'VC277',
    title: 'Looking for VC277 Vecna - Phone Stand Edition',
    price: 500,
    condition: 'Mint in Box',
    location: 'Hawkins, IN',
    description: 'Desperately seeking Vecna Phone Stand Edition! Will pay top dollar for mint condition. This is my grail piece!',
    imageUri: '',
    sellerId: 'seller_1',
    sellerHandle: '@MikeWheeler_84',
    contactMethods: [
      { type: 'instagram', username: '@MikeWheeler_84' },
    ],
    isSold: false,
    createdAt: Date.now() - 86400000 * 0.25,
    listingType: 'iso',
  },
  {
    id: 'mock_9',
    figureId: 'VC288',
    title: 'ISO: VC288 Eddie Munson - Cable Deco',
    price: 350,
    condition: 'Near Mint',
    location: 'Seattle, WA',
    description: 'Looking for Eddie Cable Deco edition. Willing to pay up to $350 for near mint or better.',
    imageUri: '',
    sellerId: 'seller_6',
    sellerHandle: '@JoyceByers_Mom',
    contactMethods: [
      { type: 'email', username: 'joyce.byers@hawkins.gov' },
    ],
    isSold: false,
    createdAt: Date.now() - 86400000 * 1.5,
    listingType: 'iso',
  },
  {
    id: 'mock_10',
    figureId: 'VC356',
    title: 'WANTED: VC356 Eleven Paperclip Edition',
    price: 200,
    condition: 'Good',
    location: 'Miami, FL',
    description: 'Searching for the Eleven Paperclip variant. Any condition considered! Message me what you have.',
    imageUri: '',
    sellerId: 'seller_3',
    sellerHandle: '@HopperChief',
    contactMethods: [
      { type: 'instagram', username: '@HopperChief' },
      { type: 'tiktok', username: '@hop_til_you_drop' },
    ],
    isSold: false,
    createdAt: Date.now() - 86400000 * 3.5,
    listingType: 'iso',
  },
  // More SELL listings
  {
    id: 'mock_11',
    figureId: 'VC274',
    title: 'VC274 Mike Wheeler - The Searcher',
    price: 95,
    condition: 'Excellent',
    location: 'New York, NY',
    description: 'Mike Wheeler figure in excellent condition. Box has minor wear but figure is perfect.',
    imageUri: '',
    sellerId: 'seller_7',
    sellerHandle: '@LucasSinclair',
    contactMethods: [
      { type: 'instagram', username: '@LucasSinclair' },
    ],
    isSold: false,
    createdAt: Date.now() - 86400000 * 6,
    listingType: 'sell',
  },
  {
    id: 'mock_12',
    figureId: 'VC265',
    title: 'VC265 Max Mayfield - The Runaway',
    price: 145,
    condition: 'Near Mint',
    location: 'San Francisco, CA',
    description: 'Max figure. Kate Bush not included but highly recommended as soundtrack.',
    imageUri: '',
    sellerId: 'seller_4',
    sellerHandle: '@MaxMayfield',
    contactMethods: [
      { type: 'instagram', username: '@MaxMayfield' },
    ],
    isSold: false,
    createdAt: Date.now() - 86400000 * 4.5,
    listingType: 'sell',
  },
];

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
