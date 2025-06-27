import { useState, useEffect } from 'react';
import { MarkerData, getCustomMarkers, deleteCustomMarker, updateCustomMarker } from '../../data/markers';
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
} from './constants';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { useAlert } from '../../hooks/useAlert';

interface CustomMarkersPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onMarkerUpdated: () => void;
}

const CustomMarkersPanel = ({ isOpen, onClose, onMarkerUpdated }: CustomMarkersPanelProps) => {
  const [customMarkers, setCustomMarkers] = useState<MarkerData[]>([]);
  const [editingMarker, setEditingMarker] = useState<MarkerData | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    type: TOWN,
    description: '',
    link: '',
    major: false,
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const { showSuccess } = useAlert();

  const locationTypes = [
    { value: CITY, label: 'City' },
    { value: TOWN, label: 'Town' },
    { value: VILLAGE, label: 'Village' },
    { value: FORT, label: 'Fort' },
    { value: DUNGEON, label: 'Dungeon' },
    { value: CAVE, label: 'Cave' },
    { value: PORTAL, label: 'Portal' },
    { value: FARM, label: 'Farm' },
    { value: UNKNOWN, label: 'Unknown' },
  ];

  useEffect(() => {
    if (isOpen) {
      loadCustomMarkers();
    }
  }, [isOpen]);

  const loadCustomMarkers = () => {
    const markers = getCustomMarkers();
    setCustomMarkers(markers);
  };

  const handleDelete = (id: string) => {
    setShowDeleteConfirm(id);
  };

  const confirmDelete = () => {
    if (showDeleteConfirm) {
      deleteCustomMarker(showDeleteConfirm);
      loadCustomMarkers();
      onMarkerUpdated();
      showSuccess(
        "Marker Deleted",
        "The marker has been successfully deleted."
      );
      setShowDeleteConfirm(null);
    }
  };

  const handleEdit = (marker: MarkerData) => {
    setEditingMarker(marker);
    setEditForm({
      name: marker.name,
      type: marker.type,
      description: marker.description || '',
      link: marker.link || '',
      major: marker.major,
    });
  };

  const handleSaveEdit = () => {
    if (!editingMarker) return;

    const updates: Partial<MarkerData> = {
      name: editForm.name.trim(),
      type: editForm.type,
      description: editForm.description.trim() || undefined,
      link: editForm.link.trim() || undefined,
      major: editForm.major,
    };

    updateCustomMarker(editingMarker.id, updates);
    setEditingMarker(null);
    loadCustomMarkers();
    onMarkerUpdated();
    showSuccess(
      "Marker Updated",
      "The marker has been successfully updated."
    );
  };

  const handleCancelEdit = () => {
    setEditingMarker(null);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <>
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!showDeleteConfirm} onOpenChange={() => setShowDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Marker</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this marker? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Custom Markers</DialogTitle>
          </DialogHeader>

          {customMarkers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No custom markers yet.</p>
              <p className="text-sm">Click on the map to add your first marker!</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              <div className="space-y-4">
                {customMarkers.map((marker) => (
                  <div key={marker.id} className="border rounded-lg p-4">
                    {editingMarker?.id === marker.id ? (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name
                          </label>
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Type
                          </label>
                          <select
                            value={editForm.type}
                            onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {locationTypes.map((type) => (
                              <option key={type.value} value={type.value}>
                                {type.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                          </label>
                          <textarea
                            value={editForm.description}
                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={2}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Link
                          </label>
                          <input
                            type="url"
                            value={editForm.link}
                            onChange={(e) => setEditForm({ ...editForm, link: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={`major-${marker.id}`}
                            checked={editForm.major}
                            onChange={(e) => setEditForm({ ...editForm, major: e.target.checked })}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`major-${marker.id}`} className="ml-2 block text-sm text-gray-700">
                            Major location
                          </label>
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button
                            onClick={handleCancelEdit}
                            variant="outline"
                            size="sm"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleSaveEdit}
                            variant="default"
                            size="sm"
                          >
                            Save
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{marker.name}</h3>
                            <p className="text-sm text-gray-600">
                              Type: {locationTypes.find(t => t.value === marker.type)?.label}
                            </p>
                            <p className="text-sm text-gray-600">
                              Location: {marker.location[0].toFixed(2)}, {marker.location[1].toFixed(2)}
                            </p>
                            {marker.description && (
                              <p className="text-sm text-gray-700 mt-2">{marker.description}</p>
                            )}
                            {marker.link && (
                              <a
                                href={marker.link}
                                target="_blank"
                                rel="noreferrer"
                                className="text-sm text-blue-600 hover:text-blue-800 block mt-1"
                              >
                                View Link
                              </a>
                            )}
                            <p className="text-xs text-gray-500 mt-2">
                              Created: {marker.createdAt ? formatDate(marker.createdAt) : 'Unknown'}
                            </p>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <Button
                              onClick={() => handleEdit(marker)}
                              variant="outline"
                              size="sm"
                            >
                              Edit
                            </Button>
                            <Button
                              onClick={() => handleDelete(marker.id)}
                              variant="destructive"
                              size="sm"
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CustomMarkersPanel; 