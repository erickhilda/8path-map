import { useState } from 'react'
import { MapContainer } from 'react-leaflet';
import { CRS } from 'leaflet';
import EventComponent from './components/map/event-component';
import MapElements from './components/map/map-elements';

function App() {
  const [currentZoom, setZoomLevel] = useState(3);
  const updateZoom = (newZoomLevel: number) => setZoomLevel(newZoomLevel);
  console.log("zoom", currentZoom);

  const [coords, setCoords] = useState<[number, number]>([-150.25, 178.5]);
  const updateCoords = (coords: [number, number]) => setCoords(coords);
  console.log("coords", coords);

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
        <EventComponent updateZoom={updateZoom} updateCoords={updateCoords} />
      </MapContainer>
    </div>
  )
}

export default App
