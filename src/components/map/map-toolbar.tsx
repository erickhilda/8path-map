import { useState, useRef } from "react";
import AddMarkerModal from "./add-marker-modal";
import CustomMarkersPanel from "./custom-markers-panel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { deleteCustomMarker, getCustomMarkers } from "../../data/markers";
import {PiBookmarks, PiPlus, PiGear, PiMapTrifold, PiFileArrowDown, PiFileArrowUp, PiTrash, PiCamera, PiX} from "react-icons/pi"

interface MapToolbarProps {
  clickLocation: [number, number] | null;
  onMarkerAdded: () => void;
}

const MapToolbar = ({ clickLocation, onMarkerAdded }: MapToolbarProps) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCustomMarkersPanelOpen, setIsCustomMarkersPanelOpen] = useState(false);
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [measurementPoints, setMeasurementPoints] = useState<[number, number][]>([]);
  const [measurementDistance, setMeasurementDistance] = useState<number>(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddMarker = () => {
    if (clickLocation) {
      setIsAddModalOpen(true);
    } else {
      alert("Please click on the map to select a location first.");
    }
  };

  const handleClearAllMarkers = () => {
    if (window.confirm("Are you sure you want to delete ALL custom markers? This action cannot be undone.")) {
      const customMarkers = getCustomMarkers();
      customMarkers.forEach(marker => {
        deleteCustomMarker(marker.id);
      });
      onMarkerAdded();
      alert("All custom markers have been deleted.");
    }
  };

  const handleExportMarkers = () => {
    const customMarkers = getCustomMarkers();
    if (customMarkers.length === 0) {
      alert("No custom markers to export.");
      return;
    }

    const dataStr = JSON.stringify(customMarkers, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'custom-markers.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportMarkers = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const markers = JSON.parse(e.target?.result as string);
        // Here you would add logic to import markers
        // For now, just show a message
        alert(`Found ${markers.length} markers in file. Import functionality to be implemented.`);
      } catch (error) {
        alert("Invalid file format. Please select a valid JSON file.");
      }
    };
    reader.readAsText(file);
  };

  const handleScreenshot = () => {
    // This would require html2canvas or similar library
    alert("Screenshot functionality requires additional libraries. To be implemented.");
  };

  const handleToggleMeasuring = () => {
    setIsMeasuring(!isMeasuring);
    if (isMeasuring) {
      setMeasurementPoints([]);
      setMeasurementDistance(0);
    }
  };

  const handleMapClickForMeasurement = () => {
    if (!isMeasuring || !clickLocation) return;
    
    const newPoints = [...measurementPoints, clickLocation];
    setMeasurementPoints(newPoints);
    
    if (newPoints.length >= 2) {
      // Calculate distance between last two points
      const [lat1, lng1] = newPoints[newPoints.length - 2];
      const [lat2, lng2] = newPoints[newPoints.length - 1];
      
      // Simple distance calculation (for more accuracy, use proper geodetic formulas)
      const distance = Math.sqrt(
        Math.pow(lat2 - lat1, 2) + Math.pow(lng2 - lng1, 2)
      ) * 111; // Rough conversion to km
      
      setMeasurementDistance(measurementDistance + distance);
    }
  };

  const clearMeasurement = () => {
    setMeasurementPoints([]);
    setMeasurementDistance(0);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <>
      <Card className={`absolute top-20 left-3 z-[1000] transition-all duration-300 ease-in-out delay-150 ${
        isMinimized ? 'w-fit h-fit' : 'w-64'
      }`}>
        <CardHeader className={`p-3 ${isMinimized ? 'hidden' : ''}`}>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Map Tools</CardTitle>
              <CardDescription>Interactive map actions</CardDescription>
            </div>
            <Button
              onClick={toggleMinimize}
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-gray-100"
              title="Minimize"
            >
              <PiX className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className={`${isMinimized ? 'p-0' : 'space-y-3'}`}>
          {isMinimized ? (
            // Minimized state - just show a button to expand
            <div className="flex items-center justify-center h-full">
              <Button
                onClick={toggleMinimize}
                variant="link"
                size="icon"
                title="Expand toolbar"
              >
                <PiGear className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            // Expanded state - show all content
            <>
              {/* Marker Management */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-700">Markers</h3>
                <Button
                  onClick={handleAddMarker}
                  disabled={!clickLocation}
                  className="w-full"
                  variant="default"
                  size="sm"
                  >
                    <PiPlus className="w-4 h-4 mr-2" />
                  Add Marker
                </Button>
                
                <Button
                  onClick={() => setIsCustomMarkersPanelOpen(true)}
                  className="w-full"
                  variant="secondary"
                  size="sm"
                >
                  <PiBookmarks className="w-4 h-4 mr-2" />
                  My Markers
                </Button>
              </div>

              {/* Measurement Tools */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-700">Tools</h3>
                <Button
                  onClick={handleToggleMeasuring}
                  className="w-full"
                  variant={isMeasuring ? "destructive" : "outline"}
                  size="sm"
                  >
                    <PiMapTrifold className="w-4 h-4 mr-2" />
                  {isMeasuring ? "Stop Measuring" : "Measure Distance"}
                </Button>

                {isMeasuring && (
                  <div className="bg-blue-50 p-2 rounded text-xs">
                    <p>Click on map to add measurement points</p>
                    {measurementPoints.length > 0 && (
                      <p>Points: {measurementPoints.length}</p>
                    )}
                    {measurementDistance > 0 && (
                      <p>Distance: {measurementDistance.toFixed(2)} km</p>
                    )}
                    <Button
                      onClick={clearMeasurement}
                      variant="outline"
                      size="sm"
                      className="mt-1 w-full"
                    >
                      Clear
                    </Button>
                  </div>
                )}
              </div>

              {/* Data Management */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-700">Data</h3>
                <Button
                  onClick={handleExportMarkers}
                  className="w-full"
                  variant="outline"
                  size="sm"
                >
                  <PiFileArrowDown className="w-4 h-4 mr-2" />
                  Export Markers
                </Button>
                
                <Button
                  onClick={handleImportMarkers}
                  className="w-full"
                  variant="outline"
                  size="sm"
                >
                  <PiFileArrowUp className="w-4 h-4 mr-2" />
                  Import Markers
                </Button>
                
                <Button
                  onClick={handleClearAllMarkers}
                  className="w-full"
                  variant="destructive"
                  size="sm"
                >
                  <PiTrash className="w-4 h-4 mr-2" />
                  Clear All Markers
                </Button>
              </div>

              {/* Utilities */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-700">Utilities</h3>
                <Button
                  onClick={handleScreenshot}
                  className="w-full"
                  variant="outline"
                  size="sm"
                >
                  <PiCamera className="w-4 h-4 mr-2" />
                  Screenshot
                </Button>
              </div>

              {/* Selected Location Display */}
              {clickLocation && (
                <div className="text-xs text-gray-600 bg-gray-100 p-2 rounded">
                  <p className="font-semibold">Selected Location:</p>
                  <p>{clickLocation[0].toFixed(2)}, {clickLocation[1].toFixed(2)}</p>
                </div>
              )}

              {/* Hidden file input for import */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </>
          )}
        </CardContent>
      </Card>

      <AddMarkerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onMarkerAdded={onMarkerAdded}
        clickLocation={clickLocation}
      />

      <CustomMarkersPanel
        isOpen={isCustomMarkersPanelOpen}
        onClose={() => setIsCustomMarkersPanelOpen(false)}
        onMarkerUpdated={onMarkerAdded}
      />
    </>
  );
};

export default MapToolbar;