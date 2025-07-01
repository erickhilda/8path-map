import { useMapEvents } from "react-leaflet";

const EventComponent = ({
  updateZoom,
  updateCoords,
  isAddMarkerMode,
  isDrawRouteMode,
  onOpenAddMarkerModal,
  onAddRoutePoint,
  onFinishRoute
}: {
  updateZoom: (newZoomLevel: number) => void;
  updateCoords: (coords: [number, number]) => void;
  isAddMarkerMode: boolean;
  isDrawRouteMode: boolean;
  onOpenAddMarkerModal: (location: [number, number]) => void;
  onAddRoutePoint: (location: [number, number]) => void;
  onFinishRoute: () => void;
}) => {
  useMapEvents({
    click: (e) => {
      if (isAddMarkerMode) {
        // In add marker mode, directly open the add marker modal
        onOpenAddMarkerModal([e.latlng.lat, e.latlng.lng]);
      } else if (isDrawRouteMode) {
        // In draw route mode, add point to the route
        onAddRoutePoint([e.latlng.lat, e.latlng.lng]);
      } else {
        // Normal mode - just update coordinates
        updateCoords([e.latlng.lat, e.latlng.lng]);
      }
    },
    zoomend: (e) => {
      updateZoom(e.target._zoom);
    },
    // Handle double-click to finish route drawing
    dblclick: (e) => {
      if (isDrawRouteMode) {
        e.originalEvent.preventDefault();
        onFinishRoute();
      }
    },
  });
  return null;
};
export default EventComponent;
