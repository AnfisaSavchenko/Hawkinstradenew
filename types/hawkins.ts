// Hawkins Trade - Core Types

export interface Figure {
  id: string; // VC259-VC282
  name: string;
  character: string;
}

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
  sellerId: string;
  sellerHandle: string;
  contactMethods: ContactMethod[];
  isSold: boolean;
  createdAt: number;
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
  },
};

// The 24 Official Figures (VC259-VC282)
export const OFFICIAL_FIGURES: Figure[] = [
  { id: 'VC259', name: 'Will Byers - The Vanishing', character: 'Will' },
  { id: 'VC260', name: 'Mike Wheeler - The Searcher', character: 'Mike' },
  { id: 'VC261', name: 'Lucas Sinclair - The Warrior', character: 'Lucas' },
  { id: 'VC262', name: 'Dustin Henderson - The Brain', character: 'Dustin' },
  { id: 'VC263', name: 'Eleven - The Psychic', character: 'Eleven' },
  { id: 'VC264', name: 'Joyce Byers - The Mother', character: 'Joyce' },
  { id: 'VC265', name: 'Jim Hopper - The Chief', character: 'Hopper' },
  { id: 'VC266', name: 'Nancy Wheeler - The Hunter', character: 'Nancy' },
  { id: 'VC267', name: 'Jonathan Byers - The Outsider', character: 'Jonathan' },
  { id: 'VC268', name: 'Steve Harrington - The Protector', character: 'Steve' },
  { id: 'VC269', name: 'Max Mayfield - The Runaway', character: 'Max' },
  { id: 'VC270', name: 'Robin Buckley - The Translator', character: 'Robin' },
  { id: 'VC271', name: 'Demogorgon - The Monster', character: 'Demogorgon' },
  { id: 'VC272', name: 'Demobat - The Swarm', character: 'Demobat' },
  { id: 'VC273', name: 'Mind Flayer - The Shadow', character: 'Mind Flayer' },
  { id: 'VC274', name: 'Vecna - The Curse', character: 'Vecna' },
  { id: 'VC275', name: 'Eddie Munson - The Hero', character: 'Eddie' },
  { id: 'VC276', name: 'Billy Hargrove - The Lifeguard', character: 'Billy' },
  { id: 'VC277', name: 'Dr. Brenner - The Father', character: 'Brenner' },
  { id: 'VC278', name: 'Bob Newby - The Brain', character: 'Bob' },
  { id: 'VC279', name: 'Murray Bauman - The Investigator', character: 'Murray' },
  { id: 'VC280', name: 'Erica Sinclair - The Spy', character: 'Erica' },
  { id: 'VC281', name: 'Argyle - The Stoner', character: 'Argyle' },
  { id: 'VC282', name: 'Suzie Bingham - The Voice', character: 'Suzie' },
];

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
