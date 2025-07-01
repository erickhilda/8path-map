import {
  CAVE,
  CITY,
  DUNGEON,
  FARM,
  FORT,
  PORTAL,
  TOWN,
  UNKNOWN,
  VILLAGE,
} from "../components/map/constants";

export interface MarkerData {
  id: string;
  name: string;
  type: string;
  location: [number, number];
  description?: string;
  link?: string;
  major: boolean;
  isCustom?: boolean;
  createdAt?: number;
}

// Default markers
const defaultMarkers: MarkerData[] = [
  {
    id: "capital-city",
    name: "Capital City",
    type: CITY,
    location: [-54.38, 89.63] as [number, number],
    description: "The grand capital city of the realm, home to the royal palace and bustling markets.",
    link: "https://example.com/capital",
    major: true,
    isCustom: false,
  },
  {
    id: "riverside-village",
    name: "Riverside Village",
    type: VILLAGE,
    location: [-30, 80] as [number, number],
    description: "A peaceful village by the river, known for its fishing and boat building.",
    link: "https://example.com/riverside",
    major: true,
    isCustom: false,
  },
  {
    id: "mountain-fort",
    name: "Mountain Fort",
    type: FORT,
    location: [-80, 120] as [number, number],
    description: "An ancient fortress guarding the mountain pass, now home to a small garrison.",
    link: "https://example.com/fort",
    major: true,
    isCustom: false,
  },
  {
    id: "dark-cave",
    name: "Dark Cave",
    type: CAVE,
    location: [-120, 60] as [number, number],
    description: "A mysterious cave system rumored to contain ancient treasures and dangerous creatures.",
    link: "https://example.com/cave",
    major: true,
    isCustom: false,
  },
  {
    id: "ancient-portal",
    name: "Ancient Portal",
    type: PORTAL,
    location: [-90, 40] as [number, number],
    description: "A magical portal that leads to distant lands. Its power waxes and wanes with the moon.",
    link: "https://example.com/portal",
    major: true,
    isCustom: false,
  },
  {
    id: "abandoned-dungeon",
    name: "Abandoned Dungeon",
    type: DUNGEON,
    location: [-60, 160] as [number, number],
    description: "The ruins of an ancient dungeon, now overrun with monsters and traps.",
    link: "https://example.com/dungeon",
    major: true,
    isCustom: false,
  },
  {
    id: "golden-farm",
    name: "Golden Farm",
    type: FARM,
    location: [-20, 140] as [number, number],
    description: "A prosperous farm known for its golden wheat fields and friendly farmers.",
    link: "https://example.com/farm",
    major: true,
    isCustom: false,
  },
  {
    id: "trading-town",
    name: "Trading Town",
    type: TOWN,
    location: [-50.88, 72.38] as [number, number],
    description: "A busy trading town where merchants from all corners of the realm gather.",
    link: "https://example.com/town",
    major: true,
    isCustom: false,
  },
  {
    id: "mysterious-ruins",
    name: "Mysterious Ruins",
    type: UNKNOWN,
    location: [-150, 100] as [number, number],
    description: "Ancient ruins whose purpose and origin remain a mystery to scholars.",
    link: "https://example.com/ruins",
    major: true,
    isCustom: false,
  },
];

// Local storage key
const STORAGE_KEY = 'custom-markers';

// Get all markers (default + custom)
export const getAllMarkers = (): MarkerData[] => {
  const customMarkers = getCustomMarkers();
  return [...defaultMarkers, ...customMarkers];
};

// Get only custom markers from local storage
export const getCustomMarkers = (): MarkerData[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading custom markers:', error);
    return [];
  }
};

// Save custom markers to local storage
export const saveCustomMarkers = (markers: MarkerData[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(markers));
  } catch (error) {
    console.error('Error saving custom markers:', error);
  }
};

// Add a new custom marker
export const addCustomMarker = (marker: Omit<MarkerData, 'id' | 'isCustom' | 'createdAt'>): MarkerData => {
  const customMarkers = getCustomMarkers();
  const newMarker: MarkerData = {
    ...marker,
    id: `marker-${marker.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    isCustom: true,
    createdAt: Date.now(),
  };
  
  const updatedMarkers = [...customMarkers, newMarker];
  saveCustomMarkers(updatedMarkers);
  return newMarker;
};

// Update a custom marker
export const updateCustomMarker = (id: string, updates: Partial<MarkerData>): boolean => {
  const customMarkers = getCustomMarkers();
  const index = customMarkers.findIndex(marker => marker.id === id);
  
  if (index === -1) return false;
  
  customMarkers[index] = { ...customMarkers[index], ...updates };
  saveCustomMarkers(customMarkers);
  return true;
};

// Delete a custom marker
export const deleteCustomMarker = (id: string): boolean => {
  const customMarkers = getCustomMarkers();
  const filteredMarkers = customMarkers.filter(marker => marker.id !== id);
  
  if (filteredMarkers.length === customMarkers.length) return false;
  
  saveCustomMarkers(filteredMarkers);
  return true;
};

// Legacy export for backward compatibility
export const markers = getAllMarkers(); 