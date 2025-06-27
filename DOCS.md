# 8Path Map Documentation

## Overview
This project is a custom map viewer built with React and Leaflet that displays custom tile-based maps with interactive markers and routes.

## Custom Tiles Implementation

The assets under the tiles directory are used to replace the actual map from Leaflet, displaying our custom map instead of the world map.

These tiles were generated using [gdal2tiles](https://gdal.org/programs/gdal2tiles.html).

To apply custom tiles, place the tiles directory into the TileLayer component:

```jsx
<TileLayer url="tiles/{z}/{x}/{y}.png" noWrap={true} />
```

## Adding Markers and Routes

### Step 1: Define Location Types

First, define the types of locations you want to mark on your map in `src/components/map/constants.ts`:

```typescript
// Types of Markers
export const CITY = "CITY";
export const VILLAGE = "VILLAGE";
export const FARM = "FARM";
export const DUNGEON = "DUNGEON";
export const CAVE = "CAVE";
export const FORT = "FORT";
export const PORTAL = "PORTAL";
export const TOWN = "TOWN";
export const UNKNOWN = "UNKNOWN";

// Zoom Levels
export const NEAR = 5;
export const MID = 4;
export const FAR = 3;
```

### Step 2: Create Icons for Each Location Type

Create custom icons in `src/components/map/icons.tsx`:

```typescript
import L from "leaflet";
import ReactDOMServer from "react-dom/server";
import { GiCastle, GiVillage, GiWindmill } from "react-icons/gi";
import { IconContext } from "react-icons";

export const city = L.divIcon({
  className: "custom-icon",
  html: ReactDOMServer.renderToString(
    <IconContext.Provider value={{ size: "2em" }}>
      <div>
        <GiCastle />
      </div>
    </IconContext.Provider>
  ),
});

// Add more icons for other location types...
```

### Step 3: Create Marker Data

Define your locations in `src/data/markers.ts`:

```typescript
import { CITY, VILLAGE, FARM } from "../components/map/constants";

export const markers = [
  {
    name: "Capital City",
    type: CITY,
    location: [-50, 100] as [number, number],
    description: "The grand capital city of the realm.",
    link: "https://example.com/capital",
    major: true,
  },
  {
    name: "Riverside Village",
    type: VILLAGE,
    location: [-30, 80] as [number, number],
    description: "A peaceful village by the river.",
    link: "https://example.com/riverside",
    major: false,
  },
  // Add more markers...
];
```

### Step 4: Create Route Data

Define your routes in `src/data/routes.ts`:

```typescript
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
  // Add more routes...
];
```

### Step 5: Create Route Display Component

Create `src/components/map/route-layer.tsx`:

```typescript
import { LayerGroup, Polyline, Tooltip, Popup } from "react-leaflet";
import { Route } from "../../data/routes";

interface RouteLayerProps {
  routes: Route[];
  visibleRoutes: string[];
}

const RouteLayer = ({ routes, visibleRoutes }: RouteLayerProps) => {
  const visibleRouteData = routes.filter(route => visibleRoutes.includes(route.id));

  return (
    <LayerGroup>
      {visibleRouteData.map((route) => (
        <Polyline
          key={route.id}
          positions={route.path}
          pathOptions={{
            color: route.color,
            weight: route.width,
            opacity: 0.8,
            dashArray: route.type === 'secret' ? '10, 5' : undefined,
          }}
        >
          <Tooltip>{route.name}</Tooltip>
          <Popup>
            <div>
              <h3 className="font-bold text-lg">{route.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{route.description}</p>
            </div>
          </Popup>
        </Polyline>
      ))}
    </LayerGroup>
  );
};

export default RouteLayer;
```

### Step 6: Create Marker Component

Create `src/components/map/map-marker.tsx`:

```typescript
import { Marker, Popup, Tooltip } from "react-leaflet";
import { determineIcon } from "./icons";

const MapMarker = ({ marker, zoom, index }: { marker: any, zoom: number, index: number }) => {
  const { name, type, location, description, link, major } = marker;
  let icon = determineIcon({ type, major }, zoom);

  return !!icon ? (
    <Marker position={location} icon={icon} id={index + name}>
      {!!name ? <Tooltip>{name}</Tooltip> : null}
      {!!description ? (
        <Popup>
          {description}
          <br />
          {!!link ? (
            <a href={link} target="_blank" rel="noreferrer">
              Wiki Page
            </a>
          ) : (
            ""
          )}
        </Popup>
      ) : null}
    </Marker>
  ) : null;
};

export default MapMarker;
```

### Step 7: Update Map Elements Component

Update `src/components/map/map-elements.tsx` to include markers and routes:

```typescript
import { LayerGroup, LayersControl, Marker, Tooltip, TileLayer } from "react-leaflet";
import { markers } from "../../data/markers";
import { routes } from "../../data/routes";
import MapMarker from "./map-marker";
import RouteLayer from "./route-layer";

const MapElements = ({ zoom, coords }: { zoom: number, coords: [number, number] }) => {
  let civilization: ReactElement[] = [];
  let wilderness: ReactElement[] = [];
  
  markers.forEach((marker, index) => {
    switch (marker.type) {
      case CITY:
      case VILLAGE:
      case TOWN:
      case FORT:
      case FARM:
        civilization.push(<MapMarker key={index} marker={marker} zoom={zoom} index={index} />);
        break;
      case PORTAL:
      case DUNGEON:
      case CAVE:
      case UNKNOWN:
        wilderness.push(<MapMarker key={index} marker={marker} zoom={zoom} index={index} />);
        break;
      default:
        console.error("Invalid Location Type");
    }
  });

  // Group routes by type
  const mainRoutes = routes.filter(route => route.type === 'main').map(route => route.id);
  const secondaryRoutes = routes.filter(route => route.type === 'secondary').map(route => route.id);
  const secretRoutes = routes.filter(route => route.type === 'secret').map(route => route.id);

  return (
    <LayersControl position="topright">
      <LayersControl.BaseLayer checked name="Basemap">
        <TileLayer url="tiles/{z}/{x}/{y}.png" noWrap={true} />
      </LayersControl.BaseLayer>
      
      <LayersControl.Overlay checked name="Civilized Locations">
        <LayerGroup>{civilization}</LayerGroup>
      </LayersControl.Overlay>
      
      <LayersControl.Overlay checked name="Wilderness Locations">
        <LayerGroup>{wilderness}</LayerGroup>
      </LayersControl.Overlay>
      
      <LayersControl.Overlay checked name="Main Routes">
        <RouteLayer routes={routes} visibleRoutes={mainRoutes} />
      </LayersControl.Overlay>
      
      <LayersControl.Overlay checked name="Secondary Routes">
        <RouteLayer routes={routes} visibleRoutes={secondaryRoutes} />
      </LayersControl.Overlay>
      
      <LayersControl.Overlay name="Secret Routes">
        <RouteLayer routes={routes} visibleRoutes={secretRoutes} />
      </LayersControl.Overlay>
    </LayersControl>
  );
};
```

### Step 8: Add CSS Styling

Add custom icon styles to `src/App.css`:

```css
/* Custom map icon styles */
.custom-icon {
  background: none;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin-left: -16px;
  margin-top: -16px;
}

.custom-icon div {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid #333;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;
}

.custom-icon div:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
}

.custom-icon svg {
  color: #333;
}
```

### Step 9: Update Main App Component

Update `src/App.tsx` to use the MapElements component:

```typescript
import { useState } from 'react'
import { MapContainer } from 'react-leaflet';
import { CRS } from 'leaflet';
import EventComponent from './components/map/event-component';
import MapElements from './components/map/map-elements';
import './App.css'

function App() {
  const [currentZoom, setZoomLevel] = useState(3);
  const [coords, setCoords] = useState<[number, number]>([-150.25, 178.5]);

  return (
    <div className='h-screen bg-amber-200'>
      <MapContainer
        center={[-100, 143.62]}
        minZoom={1}
        zoom={currentZoom}
        style={{ height: window.innerHeight, width: window.innerWidth }}
        crs={CRS.Simple}
        maxZoom={4}
        attributionControl={false}
      >
        <MapElements zoom={currentZoom} coords={coords} />
        <EventComponent updateZoom={setZoomLevel} updateCoords={setCoords} />
      </MapContainer>
    </div>
  )
}

export default App
```

## Features

### Marker Features
- **Zoom-based visibility**: Icons appear/disappear based on zoom level
- **Interactive tooltips**: Hover to see location names
- **Detailed popups**: Click for descriptions and links
- **Categorized layers**: Separate civilized and wilderness locations
- **Custom styling**: Unique icons for each location type

### Route Features
- **Color-coded routes**: Different colors for different route types
- **Line styling**: Different widths and dash patterns
- **Interactive information**: Tooltips and popups for route details
- **Layer controls**: Toggle route visibility by type
- **Type categorization**: Main, secondary, and secret routes

### Layer Controls
- **Toggle visibility**: Show/hide different marker and route types
- **Organized categories**: Civilized vs wilderness locations
- **Route type filtering**: Main, secondary, and secret routes
- **User-friendly interface**: Checkbox controls in top-right corner

## Customization

### Adding New Location Types
1. Add the type constant in `constants.ts`
2. Create an icon in `icons.tsx`
3. Add the icon to the `determineIcon` function
4. Update the marker categorization in `map-elements.tsx`

### Adding New Route Types
1. Add the route type to the Route interface
2. Create route data with the new type
3. Add styling logic in `route-layer.tsx`
4. Update the route grouping in `map-elements.tsx`

### Styling Customization
- Modify the CSS in `App.css` to change icon appearance
- Update route colors and styles in `routes.ts`
- Adjust zoom level thresholds in `constants.ts`
