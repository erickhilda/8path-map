import {
  LayerGroup,
  LayersControl,
  Marker,
  Tooltip,
  TileLayer,
} from "react-leaflet";
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
} from "./constants";
import { markers } from "../../data/markers";
import { routes } from "../../data/routes";
import MapMarker from "./map-marker";
import RouteLayer from "./route-layer";
import { ReactElement } from "react";

interface MapElementsProps {
  zoom: number;
  coords: [number, number];
}

const MapElements = ({ zoom, coords }: MapElementsProps) => {
  const civilization: ReactElement[] = [];
  const wilderness: ReactElement[] = [];
  
  markers.forEach((marker, index) => {
    switch (marker.type) {
      case CITY:
      case VILLAGE:
      case TOWN:
      case FORT:
      case FARM:
        civilization.push(
          <MapMarker 
            key={index} 
            marker={marker} 
            zoom={zoom} 
            index={index}
          />
        );
        break;
      case PORTAL:
      case DUNGEON:
      case CAVE:
      case UNKNOWN:
        wilderness.push(
          <MapMarker 
            key={index} 
            marker={marker} 
            zoom={zoom} 
            index={index}
          />
        );
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
      
      <LayersControl.Overlay
        checked
        name="Civilized Locations"
      >
        <LayerGroup>{civilization}</LayerGroup>
      </LayersControl.Overlay>
      
      <LayersControl.Overlay
        checked
        name="Wilderness Locations"
      >
        <LayerGroup>{wilderness}</LayerGroup>
      </LayersControl.Overlay>
      
      <LayersControl.Overlay
        checked
        name="Main Routes"
      >
        <RouteLayer routes={routes} visibleRoutes={mainRoutes} />
      </LayersControl.Overlay>
      
      <LayersControl.Overlay
        checked
        name="Secondary Routes"
      >
        <RouteLayer routes={routes} visibleRoutes={secondaryRoutes} />
      </LayersControl.Overlay>
      
      <LayersControl.Overlay
        name="Secret Routes"
      >
        <RouteLayer routes={routes} visibleRoutes={secretRoutes} />
      </LayersControl.Overlay>
      
      <LayersControl.Overlay name="Click Location">
        {coords.length > 0 ? (
          <Marker position={coords}>
            <Tooltip>
              {coords[0]},{coords[1]}
            </Tooltip>
          </Marker>
        ) : null}
      </LayersControl.Overlay>
    </LayersControl>
  );
};

export default MapElements;
