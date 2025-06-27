import { useState, useCallback } from 'react'
import { MapContainer } from 'react-leaflet';
import { CRS } from 'leaflet';
import EventComponent from './components/map/event-component';
import MapElements from './components/map/map-elements';
import MapToolbar from './components/map/map-toolbar';

function App() {
  const [currentZoom, setZoomLevel] = useState(3);
  const updateZoom = (newZoomLevel: number) => setZoomLevel(newZoomLevel);

  const [coords, setCoords] = useState<[number, number]>([-150.25, 178.5]);
  const updateCoords = (coords: [number, number]) => setCoords(coords);

  // Force refresh of map elements when markers are updated
  const [markerUpdateKey, setMarkerUpdateKey] = useState(0);
  const handleMarkerUpdate = useCallback(() => {
    setMarkerUpdateKey(prev => prev + 1);
  }, []);

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
        <MapElements 
          key={markerUpdateKey}
          zoom={currentZoom} 
          coords={coords} 
        />
        <EventComponent updateZoom={updateZoom} updateCoords={updateCoords} />
      </MapContainer>
      
      <MapToolbar 
        clickLocation={coords.length > 0 ? coords : null}
        onMarkerAdded={handleMarkerUpdate}
      />
    </div>
  )
}

export default App
