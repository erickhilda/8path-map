import { LayerGroup, Polyline, CircleMarker } from "react-leaflet";

interface RouteDrawingLayerProps {
  routePath: [number, number][];
  isDrawing: boolean;
}

const RouteDrawingLayer = ({ routePath, isDrawing }: RouteDrawingLayerProps) => {
  if (!isDrawing || routePath.length === 0) {
    return null;
  }

  return (
    <LayerGroup>
      {/* Draw the route line */}
      {routePath.length > 1 && (
        <Polyline
          positions={routePath}
          pathOptions={{
            color: "#FF6B6B",
            weight: 3,
            opacity: 0.8,
            dashArray: "5, 5",
          }}
        />
      )}

      {/* Draw points */}
      {routePath.map((point, index) => (
        <CircleMarker
          key={index}
          center={point}
          radius={6}
          pathOptions={{
            color: "#FF6B6B",
            fillColor: "#FF6B6B",
            fillOpacity: 0.8,
            weight: 2,
          }}
        />
      ))}
    </LayerGroup>
  );
};

export default RouteDrawingLayer; 