import { useState } from 'react';
import { MarkerData, addCustomMarker } from '../../data/markers';
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
  DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';

interface AddMarkerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMarkerAdded: () => void;
  clickLocation: [number, number] | null;
}

const AddMarkerModal = ({ isOpen, onClose, onMarkerAdded, clickLocation }: AddMarkerModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    type: TOWN,
    description: '',
    link: '',
    major: false,
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clickLocation || !formData.name.trim()) {
      return;
    }

    const newMarker: Omit<MarkerData, 'id' | 'isCustom' | 'createdAt'> = {
      name: formData.name.trim(),
      type: formData.type,
      location: clickLocation,
      description: formData.description.trim() || undefined,
      link: formData.link.trim() || undefined,
      major: formData.major,
    };

    addCustomMarker(newMarker);
    onMarkerAdded();
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      name: '',
      type: TOWN,
      description: '',
      link: '',
      major: false,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Custom Marker</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter location name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
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
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter description (optional)"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Link URL
            </label>
            <input
              type="url"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com (optional)"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="major"
              checked={formData.major}
              onChange={(e) => setFormData({ ...formData, major: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="major" className="ml-2 block text-sm text-gray-700">
              Major location (always visible)
            </label>
          </div>

          {clickLocation && (
            <div className="text-sm text-gray-600 bg-gray-100 p-2 rounded">
              Location: {clickLocation[0].toFixed(2)}, {clickLocation[1].toFixed(2)}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              onClick={handleClose}
              variant="outline"
              size="sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!clickLocation || !formData.name.trim()}
              variant="default"
              size="sm"
            >
              Add Marker
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMarkerModal; 