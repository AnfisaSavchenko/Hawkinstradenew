// Hawkins Trade - Core Types
import { ImageSourcePropType } from 'react-native';

export interface Figure {
  id: string;
  name: string;
  character: string;
  image: ImageSourcePropType;
}

export type ListingType = 'sell' | 'swap' | 'iso';

export interface ContactMethod {
  type: 'instagram' | 'tiktok' | 'email';
  username: string;
}

export interface Listing {
  id: string;
  figureId: string;
  title: string;
  price: number;
  condition: 'Mint in Box' | 'Near Mint' | 'Excellent' | 'Good' | 'Loose, Complete' | 'Loose, Incomplete';
  location: string;
  description: string;
  imageUri: string;
  userImageUri?: string; // User-uploaded photo evidence
  sellerId: string;
  sellerHandle: string;
  contactMethods: ContactMethod[];
  isSold: boolean;
  createdAt: number;
  listingType: ListingType;
  swapTargetId?: string; // Figure ID user wants in exchange (for swap listings)
}

export interface UserData {
  id: string;
  handle: string;
  listings: string[]; // listing IDs
  favorites: string[];
}

export type ThemeMode = 'realWorld' | 'upsideDown';

export interface Theme {
  mode: ThemeMode;
  colors: {
    background: string;
    surface: string;
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    textSecondary: string;
    border: string;
    sold: string;
    success: string;
    cardBg: string;
    swap: string;
    iso: string;
  };
}

export const REAL_WORLD_THEME: Theme = {
  mode: 'realWorld',
  colors: {
    background: '#1e0707',
    surface: '#2a0d0d',
    primary: '#ff1515',
    secondary: '#3a5fe5',
    accent: '#073e1e',
    text: '#ffffff',
    textSecondary: '#cccccc',
    border: '#ff1515',
    sold: '#ff1515',
    success: '#073e1e',
    cardBg: '#1a0505',
    swap: '#f59e0b',
    iso: '#8b5cf6',
  },
};

export const UPSIDE_DOWN_THEME: Theme = {
  mode: 'upsideDown',
  colors: {
    background: '#091428',
    surface: '#0d1a30',
    primary: '#580b58',
    secondary: '#b0c4de',
    accent: '#1a0a2e',
    text: '#e0e0e0',
    textSecondary: '#b0c4de',
    border: '#580b58',
    sold: '#580b58',
    success: '#2e4a1e',
    cardBg: '#0a1020',
    swap: '#d97706',
    iso: '#7c3aed',
  },
};

// The Official Figures with local images
export const OFFICIAL_FIGURES: Figure[] = [
  { id: 'VC259', name: 'Will Byers - The Vanishing', character: 'Will', image: require('@/assets/images/Will_VC259.jpg') },
  { id: 'VC260', name: 'Will Byers - Upside Down', character: 'Will', image: require('@/assets/images/Will_VC260_Upside_down.jpg') },
  { id: 'VC261', name: 'Dustin Henderson - The Brain', character: 'Dustin', image: require('@/assets/images/Dustin_VC261.jpg') },
  { id: 'VC262', name: 'Dustin Henderson - Upside Down', character: 'Dustin', image: require('@/assets/images/Dustin_VC262_Upside_down.jpg') },
  { id: 'VC263', name: 'Jim Hopper - The Chief', character: 'Hopper', image: require('@/assets/images/Hopper_VC263.jpg') },
  { id: 'VC264', name: 'Jim Hopper - Upside Down', character: 'Hopper', image: require('@/assets/images/Hopper_Upside_down_VC264.jpg') },
  { id: 'VC265', name: 'Max Mayfield - The Runaway', character: 'Max', image: require('@/assets/images/Max_VC265.jpg') },
  { id: 'VC266', name: 'Max Mayfield - Upside Down', character: 'Max', image: require('@/assets/images/Max_Upside_down__VC266.jpg') },
  { id: 'VC267', name: 'Steve Harrington - The Protector', character: 'Steve', image: require('@/assets/images/Steve_VC267.jpg') },
  { id: 'VC268', name: 'Steve Harrington - Upside Down', character: 'Steve', image: require('@/assets/images/Steve_VC268_Upside_down.jpg') },
  { id: 'VC269', name: 'Eleven - The Psychic', character: 'Eleven', image: require('@/assets/images/Eleven_VC269.jpg') },
  { id: 'VC271', name: 'Demogorgon - The Monster', character: 'Demogorgon', image: require('@/assets/images/Demogorgone_VC271.jpg') },
  { id: 'VC273', name: 'Lucas Sinclair - The Warrior', character: 'Lucas', image: require('@/assets/images/Lucas_VC273.jpg') },
  { id: 'VC274', name: 'Mike Wheeler - The Searcher', character: 'Mike', image: require('@/assets/images/Mike_VC274.jpg') },
  { id: 'VC275', name: 'Demogorgon - Paperclip Edition', character: 'Demogorgon', image: require('@/assets/images/Demogorgone_paperclip_VC275.jpg') },
  { id: 'VC276', name: 'Eleven - Phone Stand Edition', character: 'Eleven', image: require('@/assets/images/Eleven_sopporto_smartphone_VC276.jpg') },
  { id: 'VC277', name: 'Vecna - Phone Stand Edition', character: 'Vecna', image: require('@/assets/images/Vecna_smartphone_VC277.jpg') },
  { id: 'VC283', name: 'Nancy Wheeler - Cable Deco', character: 'Nancy', image: require('@/assets/images/Nanacy_cable_deco_VC283.jpg') },
  { id: 'VC285', name: 'Erica Sinclair - Cable Deco', character: 'Erica', image: require('@/assets/images/Erica_cable_deco_VC285.jpg') },
  { id: 'VC286', name: 'Steve & Robin - Pen Deco', character: 'Steve & Robin', image: require('@/assets/images/Steven_e_robin_pen_deco_VC286.jpg') },
  { id: 'VC287', name: 'Demogorgon - Pen Deco', character: 'Demogorgon', image: require('@/assets/images/Demogorgone_pen_deco_VC287.jpg') },
  { id: 'VC288', name: 'Eddie Munson - Upside Down Cable Deco', character: 'Eddie', image: require('@/assets/images/Eddie_Upside_down__cable_deco_VC288.jpg') },
  { id: 'VC289', name: 'Robin Buckley - Upside Down', character: 'Robin', image: require('@/assets/images/Robin_Upside_down_VC288.jpg') },
  { id: 'VC356', name: 'Eleven - Paperclip Edition', character: 'Eleven', image: require('@/assets/images/Eleven_paperclip_VC356.jpg') },
];

// Helper to get figure by ID
export function getFigureById(id: string): Figure | undefined {
  return OFFICIAL_FIGURES.find((f) => f.id === id);
}

// Helper to get figure image source
export function getFigureImage(figureId: string): ImageSourcePropType {
  const figure = getFigureById(figureId);
  return figure?.image ?? require('@/assets/images/Will_VC259.jpg');
}

export const CONDITIONS = [
  'Mint in Box',
  'Near Mint',
  'Excellent',
  'Good',
  'Loose, Complete',
  'Loose, Incomplete',
] as const;

export const LOCATIONS = [
  'Hawkins, IN',
  'Indianapolis, IN',
  'Chicago, IL',
  'New York, NY',
  'Los Angeles, CA',
  'San Francisco, CA',
  'Seattle, WA',
  'Denver, CO',
  'Austin, TX',
  'Miami, FL',
];

export const LISTING_TYPES: { value: ListingType; label: string; icon: string }[] = [
  { value: 'sell', label: 'Sell', icon: '💰' },
  { value: 'swap', label: 'Swap', icon: '⇄' },
  { value: 'iso', label: 'ISO', icon: '🔍' },
];
