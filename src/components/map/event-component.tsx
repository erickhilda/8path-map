import { useMapEvents } from "react-leaflet";

const EventComponent = ({
  updateZoom,
  updateCoords
}: {
  updateZoom: (newZoomLevel: number) => void;
  updateCoords: (coords: [number, number]) => void;
}) => {
  useMapEvents({
    click: (e) => {
      updateCoords([e.latlng.lat, e.latlng.lng]);
    },
    zoomend: (e) => {
      updateZoom(e.target._zoom);
    },
  });
  return null;
};
export default EventComponent;
