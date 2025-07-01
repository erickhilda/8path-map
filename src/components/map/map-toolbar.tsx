import { useState, useRef } from "react";
import AddMarkerModal from "./add-marker-modal";
import AddRouteModal from "./add-route-modal";
import CustomMarkersPanel from "./custom-markers-panel";
import CustomRoutesPanel from "./custom-routes-panel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import {
  MarkerData,
  addCustomMarker,
  deleteCustomMarker,
  getCustomMarkers,
} from "../../data/markers";
import {
  getCustomRoutes,
  deleteCustomRoute,
} from "../../data/routes";
import { useAlert } from "../../hooks/useAlert";
import { useAlertDialog } from "../../hooks/useAlertDialog";
import {
  PiBookmarks,
  PiPlus,
  PiGear,
  PiFileArrowDown,
  PiFileArrowUp,
  PiTrash,
  PiX,
  PiPath,
} from "react-icons/pi";
import { cn } from "@/lib/utils";

interface MapToolbarProps {
  clickLocation: [number, number] | null;
  onMarkerAdded: () => void;
  isAddMarkerMode: boolean;
  onToggleAddMarkerMode: () => void;
  isAddModalOpen: boolean;
  onCloseAddMarkerModal: () => void;
  modalLocation: [number, number] | null;
  isDrawRouteMode: boolean;
  onToggleDrawRouteMode: () => void;
  routePath: [number, number][];
  isAddRouteModalOpen: boolean;
  onCloseAddRouteModal: () => void;
  onRouteAdded: () => void;
}

const MapToolbar = ({
  clickLocation,
  onMarkerAdded,
  isAddMarkerMode,
  onToggleAddMarkerMode,
  isAddModalOpen,
  onCloseAddMarkerModal,
  modalLocation,
  isDrawRouteMode,
  onToggleDrawRouteMode,
  routePath,
  isAddRouteModalOpen,
  onCloseAddRouteModal,
  onRouteAdded,
}: MapToolbarProps) => {
  const [isCustomMarkersPanelOpen, setIsCustomMarkersPanelOpen] =
    useState(false);
  const [isCustomRoutesPanelOpen, setIsCustomRoutesPanelOpen] =
    useState(false);
  // const [isMeasuring, setIsMeasuring] = useState(false);
  // const [measurementPoints, setMeasurementPoints] = useState<
  //   [number, number][]
  // >([]);
  // const [measurementDistance, setMeasurementDistance] = useState<number>(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use the global alert system
  const { showInfo, showError, showSuccess } = useAlert();
  const { showDeleteConfirm } = useAlertDialog();

  const handleToggleAddMarkerMode = () => {
    onToggleAddMarkerMode();
  };

  const handleClearAllMarkers = () => {
    showDeleteConfirm(
      "Clear All Markers",
      "Are you sure you want to delete ALL custom markers? This action cannot be undone.",
      () => {
        const customMarkers = getCustomMarkers();
        customMarkers.forEach((marker) => {
          deleteCustomMarker(marker.id);
        });
        onMarkerAdded();
        showSuccess(
          "Markers Cleared",
          "All custom markers have been deleted successfully."
        );
      }
    );
  };

  const handleClearAllRoutes = () => {
    showDeleteConfirm(
      "Clear All Routes",
      "Are you sure you want to delete ALL custom routes? This action cannot be undone.",
      () => {
        const customRoutes = getCustomRoutes();
        customRoutes.forEach((route) => {
          deleteCustomRoute(route.id);
        });
        onRouteAdded();
        showSuccess(
          "Routes Cleared",
          "All custom routes have been deleted successfully."
        );
      }
    );
  };

  const handleExportMarkers = () => {
    const customMarkers = getCustomMarkers();
    if (customMarkers.length === 0) {
      showInfo("No Markers", "No custom markers to export.");
      return;
    }

    const dataStr = JSON.stringify(customMarkers, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "custom-markers.json";
    link.click();
    URL.revokeObjectURL(url);

    showSuccess(
      "Export Successful",
      `${customMarkers.length} markers have been exported to custom-markers.json`
    );
  };

  const handleExportRoutes = () => {
    const customRoutes = getCustomRoutes();
    if (customRoutes.length === 0) {
      showInfo("No Routes", "No custom routes to export.");
      return;
    }

    const dataStr = JSON.stringify(customRoutes, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "custom-routes.json";
    link.click();
    URL.revokeObjectURL(url);

    showSuccess(
      "Export Successful",
      `${customRoutes.length} routes have been exported to custom-routes.json`
    );
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
        if (!Array.isArray(markers)) {
          showError(
            "Invalid Format",
            "The file must contain an array of markers."
          );
          return;
        }

        // Validate each marker has required fields
        const validMarkers = markers.filter((marker: MarkerData) => {
          return (
            marker.name &&
            marker.type &&
            marker.location &&
            Array.isArray(marker.location) &&
            marker.location.length === 2
          );
        });

        if (validMarkers.length === 0) {
          showError(
            "No Valid Markers",
            "No valid markers found in the file. Each marker must have a name, type, and location coordinates."
          );
          return;
        }

        if (validMarkers.length !== markers.length) {
          showInfo(
            "Partial Import",
            `${validMarkers.length} out of ${markers.length} markers are valid and will be imported.`
          );
        }

        // Import the valid markers
        validMarkers.forEach((marker: MarkerData) => {
          const newMarker: MarkerData = {
            id: "",
            name: marker.name,
            type: marker.type,
            location: marker.location,
            description: marker.description,
            link: marker.link,
            major: marker.major || false,
            createdAt: Date.now(),
          };
          addCustomMarker(newMarker);
        });

        onMarkerAdded();
        showSuccess(
          "Import Successful",
          `${validMarkers.length} markers have been successfully imported.`
        );
      } catch (error) {
        showError(
          "Invalid File",
          "Invalid file format. Please select a valid JSON file."
        );
      }
    };
    reader.readAsText(file);

    // Clear the file input value so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // const handleScreenshot = () => {
  //   // This would require html2canvas or similar library
  //   showInfo(
  //     "Coming Soon",
  //     "Screenshot functionality requires additional libraries. To be implemented."
  //   );
  // };

  // const handleToggleMeasuring = () => {
  //   setIsMeasuring(!isMeasuring);
  //   if (isMeasuring) {
  //     setMeasurementPoints([]);
  //     setMeasurementDistance(0);
  //   }
  // };

  // const clearMeasurement = () => {
  //   setMeasurementPoints([]);
  //   setMeasurementDistance(0);
  // };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <>
      <Card
        className={cn(
          "absolute top-20 left-3 z-[1000] transition-all duration-300 ease-in-out delay-150",
          isMinimized ? "w-fit h-fit" : "w-64"
        )}
      >
        <CardHeader className={`p-3 ${isMinimized ? "hidden" : ""}`}>
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

        <CardContent className={cn(isMinimized ? "p-0" : "space-y-3")}>
          {isMinimized ? (
            // Minimized state - just show a button to expand
            <>
              {(isAddMarkerMode || isDrawRouteMode) && (
                <span className="flex size-3 absolute -top-1 -right-1">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex size-3 rounded-full bg-red-500"></span>
                </span>
              )}

              <div className={cn("flex items-center justify-center h-full")}>
                <Button
                  onClick={toggleMinimize}
                  variant="link"
                  size="icon"
                  title="Expand toolbar"
                >
                  <PiGear className="w-4 h-4" />
                </Button>
              </div>
            </>
          ) : (
            // Expanded state - show all content
            <>
              {/* Marker Management */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-700">Markers</h3>
                <Button
                  onClick={handleToggleAddMarkerMode}
                  className="w-full"
                  variant={isAddMarkerMode ? "destructive" : "default"}
                  size="sm"
                >
                  <PiPlus className="w-4 h-4 mr-2" />
                  {isAddMarkerMode ? "Cancel Add Marker" : "Add Marker"}
                </Button>

                <Button
                  onClick={() => setIsCustomMarkersPanelOpen(true)}
                  className="w-full"
                  variant="outline"
                  size="sm"
                >
                  <PiBookmarks className="w-4 h-4 mr-2" />
                  My Markers
                </Button>
              </div>

              {/* Route Management */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-700">Routes</h3>
                <Button
                  onClick={onToggleDrawRouteMode}
                  className="w-full"
                  variant={isDrawRouteMode ? "destructive" : "default"}
                  size="sm"
                >
                  <PiPath className="w-4 h-4 mr-2" />
                  {isDrawRouteMode ? "Cancel Draw Route" : "Draw Route"}
                </Button>

                {isDrawRouteMode && (
                  <div className="bg-blue-50 p-2 rounded text-xs">
                    <p>Click on map to add route points</p>
                    <p>Double-click to finish route</p>
                    {routePath.length > 0 && (
                      <p>Points: {routePath.length}</p>
                    )}
                  </div>
                )}

                <Button
                  onClick={() => setIsCustomRoutesPanelOpen(true)}
                  className="w-full"
                  variant="outline"
                  size="sm"
                >
                  <PiBookmarks className="w-4 h-4 mr-2" />
                  My Routes
                </Button>
              </div>

              {/* Measurement Tools */}
              {/* <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-700">Tools</h3>
                <Button
                  onClick={handleToggleMeasuring}
                  className="w-full"
                  variant={isMeasuring ? "destructive" : "outline"}
                  size="sm"
                  disabled
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
              </div> */}

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
                  onClick={handleExportRoutes}
                  className="w-full"
                  variant="outline"
                  size="sm"
                >
                  <PiFileArrowDown className="w-4 h-4 mr-2" />
                  Export Routes
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

                <Button
                  onClick={handleClearAllRoutes}
                  className="w-full"
                  variant="destructive"
                  size="sm"
                >
                  <PiTrash className="w-4 h-4 mr-2" />
                  Clear All Routes
                </Button>
              </div>

              {/* Utilities */}
              {/* <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-700">
                  Utilities
                </h3>
                <Button
                  onClick={handleScreenshot}
                  className="w-full"
                  variant="outline"
                  size="sm"
                  disabled
                >
                  <PiCamera className="w-4 h-4 mr-2" />
                  Screenshot
                </Button>
              </div> */}

              {/* Selected Location Display */}
              {clickLocation && (
                <div className="text-xs text-gray-600 bg-gray-100 p-2 rounded">
                  <p className="font-semibold">Selected Location:</p>
                  <p>
                    {clickLocation[0].toFixed(2)}, {clickLocation[1].toFixed(2)}
                  </p>
                </div>
              )}

              {/* Hidden file input for import */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                style={{ display: "none" }}
              />
            </>
          )}
        </CardContent>
      </Card>

      <AddMarkerModal
        isOpen={isAddModalOpen}
        onClose={onCloseAddMarkerModal}
        onMarkerAdded={onMarkerAdded}
        clickLocation={modalLocation}
      />

      <AddRouteModal
        isOpen={isAddRouteModalOpen}
        onClose={onCloseAddRouteModal}
        routePath={routePath}
        onRouteAdded={onRouteAdded}
      />

      <CustomMarkersPanel
        isOpen={isCustomMarkersPanelOpen}
        onClose={() => setIsCustomMarkersPanelOpen(false)}
        onMarkerUpdated={onMarkerAdded}
      />

      <CustomRoutesPanel
        isOpen={isCustomRoutesPanelOpen}
        onClose={() => setIsCustomRoutesPanelOpen(false)}
        onRouteUpdated={onRouteAdded}
      />
    </>
  );
};

export default MapToolbar;
