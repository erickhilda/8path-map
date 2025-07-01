export interface Route {
  id: string;
  name: string;
  path: [number, number][];
  type: 'main' | 'secondary' | 'secret' | 'custom';
  description: string;
  color: string;
  width: number;
  isCustom?: boolean;
  createdAt?: number;
}

// Default routes
const defaultRoutes: Route[] = [
  {
    id: "royal-road",
    name: "Royal Road",
    path: [
      [-50, 100], // Capital City
      [-40, 60],  // Trading Town
      [-30, 80],  // Riverside Village
    ],
    type: "main",
    description: "The main trade route connecting the capital to the coastal regions.",
    color: "#FFD700",
    width: 4,
    isCustom: false,
  },
  {
    id: "mountain-path",
    name: "Mountain Path",
    path: [
      [-50, 100], // Capital City
      [-80, 120], // Mountain Fort
    ],
    type: "main",
    description: "A treacherous mountain path leading to the ancient fortress.",
    color: "#8B4513",
    width: 3,
    isCustom: false,
  },
  {
    id: "river-trail",
    name: "River Trail",
    path: [
      [-30, 80],  // Riverside Village
      [-20, 140], // Golden Farm
      [-60, 160], // Abandoned Dungeon
    ],
    type: "secondary",
    description: "A winding trail that follows the river through fertile lands.",
    color: "#4169E1",
    width: 2,
    isCustom: false,
  },
  {
    id: "ancient-way",
    name: "Ancient Way",
    path: [
      [-90, 40],  // Ancient Portal
      [-120, 60], // Dark Cave
      [-150, 100], // Mysterious Ruins
    ],
    type: "secret",
    description: "An ancient path that connects mystical locations, known only to few.",
    color: "#9932CC",
    width: 2,
    isCustom: false,
  },
  {
    id: "trade-route",
    name: "Trade Route",
    path: [
      [-40, 60],  // Trading Town
      [-20, 140], // Golden Farm
    ],
    type: "secondary",
    description: "A busy trade route connecting the trading town to the farmlands.",
    color: "#228B22",
    width: 3,
    isCustom: false,
  },
];

// Local storage key
const STORAGE_KEY = 'custom-routes';

// Get all routes (default + custom)
export const getAllRoutes = (): Route[] => {
  const customRoutes = getCustomRoutes();
  return [...defaultRoutes, ...customRoutes];
};

// Get only custom routes from local storage
export const getCustomRoutes = (): Route[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading custom routes:', error);
    return [];
  }
};

// Save custom routes to local storage
export const saveCustomRoutes = (routes: Route[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(routes));
  } catch (error) {
    console.error('Error saving custom routes:', error);
  }
};

// Add a new custom route
export const addCustomRoute = (route: Omit<Route, 'id' | 'isCustom' | 'createdAt'>): Route => {
  const customRoutes = getCustomRoutes();
  const newRoute: Route = {
    ...route,
    id: `route-${route.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    isCustom: true,
    createdAt: Date.now(),
  };
  
  const updatedRoutes = [...customRoutes, newRoute];
  saveCustomRoutes(updatedRoutes);
  return newRoute;
};

// Update a custom route
export const updateCustomRoute = (id: string, updates: Partial<Route>): boolean => {
  const customRoutes = getCustomRoutes();
  const index = customRoutes.findIndex(route => route.id === id);
  
  if (index === -1) return false;
  
  customRoutes[index] = { ...customRoutes[index], ...updates };
  saveCustomRoutes(customRoutes);
  return true;
};

// Delete a custom route
export const deleteCustomRoute = (id: string): boolean => {
  const customRoutes = getCustomRoutes();
  const filteredRoutes = customRoutes.filter(route => route.id !== id);
  
  if (filteredRoutes.length === customRoutes.length) return false;
  
  saveCustomRoutes(filteredRoutes);
  return true;
};

// Legacy export for backward compatibility
export const routes = getAllRoutes(); 