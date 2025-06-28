import { useMapEvents } from "react-leaflet";

const EventComponent = ({
  updateZoom,
  updateCoords,
  isAddMarkerMode,
  onOpenAddMarkerModal
}: {
  updateZoom: (newZoomLevel: number) => void;
  updateCoords: (coords: [number, number]) => void;
  isAddMarkerMode: boolean;
  onOpenAddMarkerModal: (location: [number, number]) => void;
}) => {
  useMapEvents({
    click: (e) => {
      if (isAddMarkerMode) {
        // In add marker mode, directly open the add marker modal
        onOpenAddMarkerModal([e.latlng.lat, e.latlng.lng]);
      } else {
        // Normal mode - just update coordinates
        updateCoords([e.latlng.lat, e.latlng.lng]);
      }
    },
    zoomend: (e) => {
      updateZoom(e.target._zoom);
    },
  });
  return null;
};
export default EventComponent;
