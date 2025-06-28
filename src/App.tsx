import { useState, useCallback } from "react";
import { Provider } from "jotai";
import { MapContainer } from "react-leaflet";
import { CRS } from "leaflet";
import EventComponent from "./components/map/event-component";
import MapElements from "./components/map/map-elements";
import MapToolbar from "./components/map/map-toolbar";
import { AlertProvider } from "./components/ui/alert-provider";
import { AlertDialogProvider } from "./components/ui/alert-dialog-provider";

function App() {
  const [currentZoom, setZoomLevel] = useState(3);
  const updateZoom = (newZoomLevel: number) => setZoomLevel(newZoomLevel);

  const [coords, setCoords] = useState<[number, number] | null>(null);
  const updateCoords = (coords: [number, number]) => setCoords(coords);

  // Add marker mode state
  const [isAddMarkerMode, setIsAddMarkerMode] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalLocation, setModalLocation] = useState<[number, number] | null>(
    null
  );

  // Force refresh of map elements when markers are updated
  const [markerUpdateKey, setMarkerUpdateKey] = useState(0);
  const handleMarkerUpdate = useCallback(() => {
    setMarkerUpdateKey((prev) => prev + 1);
  }, []);

  const handleToggleAddMarkerMode = useCallback(() => {
    setIsAddMarkerMode((prev) => !prev);
  }, []);

  const handleOpenAddMarkerModal = useCallback((location: [number, number]) => {
    setModalLocation(location);
    setIsAddModalOpen(true);
  }, []);

  const handleCloseAddMarkerModal = useCallback(() => {
    setIsAddModalOpen(false);
    setModalLocation(null);
  }, []);

  return (
    <Provider>
      <div className="h-screen bg-amber-200">
        <MapContainer
          center={[-100, 143.62]}
          minZoom={1}
          zoom={currentZoom}
          style={{
            height: window.innerHeight,
            width: window.innerWidth,
          }}
          crs={CRS.Simple}
          maxZoom={4}
          attributionControl={false}
        >
          <MapElements
            key={markerUpdateKey}
            zoom={currentZoom}
            coords={coords || [-150.25, 178.5]}
          />
          <EventComponent
            updateZoom={updateZoom}
            updateCoords={updateCoords}
            isAddMarkerMode={isAddMarkerMode}
            onOpenAddMarkerModal={handleOpenAddMarkerModal}
          />
        </MapContainer>

        <MapToolbar
          clickLocation={coords}
          onMarkerAdded={handleMarkerUpdate}
          isAddMarkerMode={isAddMarkerMode}
          onToggleAddMarkerMode={handleToggleAddMarkerMode}
          isAddModalOpen={isAddModalOpen}
          onCloseAddMarkerModal={handleCloseAddMarkerModal}
          modalLocation={modalLocation}
        />

        <AlertProvider />
        <AlertDialogProvider />
      </div>
    </Provider>
  );
}

export default App;
