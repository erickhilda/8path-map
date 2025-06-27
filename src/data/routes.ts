export interface Route {
  id: string;
  name: string;
  path: [number, number][];
  type: 'main' | 'secondary' | 'secret';
  description: string;
  color: string;
  width: number;
}

export const routes: Route[] = [
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
  },
]; 