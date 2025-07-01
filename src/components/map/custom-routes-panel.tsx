import { useState, useEffect } from 'react';
import { Route, getCustomRoutes, deleteCustomRoute, updateCustomRoute } from '../../data/routes';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useAlert } from '../../hooks/useAlert';
import { useAlertDialog } from '../../hooks/useAlertDialog';

interface CustomRoutesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onRouteUpdated: () => void;
}

const CustomRoutesPanel = ({ isOpen, onClose, onRouteUpdated }: CustomRoutesPanelProps) => {
  const [customRoutes, setCustomRoutes] = useState<Route[]>([]);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    type: 'custom' as 'main' | 'secondary' | 'secret' | 'custom',
    description: '',
    color: '#FF6B6B',
    width: 3,
  });

  const { showSuccess } = useAlert();
  const { showDeleteConfirm } = useAlertDialog();

  const routeTypes = [
    { value: 'custom', label: 'Custom' },
    { value: 'main', label: 'Main' },
    { value: 'secondary', label: 'Secondary' },
    { value: 'secret', label: 'Secret' },
  ];

  const colorOptions = [
    { value: "#FF6B6B", label: "Red" },
    { value: "#4ECDC4", label: "Teal" },
    { value: "#45B7D1", label: "Blue" },
    { value: "#96CEB4", label: "Green" },
    { value: "#FFEAA7", label: "Yellow" },
    { value: "#DDA0DD", label: "Purple" },
    { value: "#FFB347", label: "Orange" },
    { value: "#87CEEB", label: "Sky Blue" },
  ];

  useEffect(() => {
    if (isOpen) {
      loadCustomRoutes();
    }
  }, [isOpen]);

  const loadCustomRoutes = () => {
    const routes = getCustomRoutes();
    setCustomRoutes(routes);
  };

  const handleDelete = (id: string) => {
    showDeleteConfirm(
      "Delete Route",
      "Are you sure you want to delete this route? This action cannot be undone.",
      () => {
        deleteCustomRoute(id);
        loadCustomRoutes();
        onRouteUpdated();
        showSuccess(
          "Route Deleted",
          "The route has been successfully deleted."
        );
      }
    );
  };

  const handleEdit = (route: Route) => {
    setEditingRoute(route);
    setEditForm({
      name: route.name,
      type: route.type,
      description: route.description,
      color: route.color,
      width: route.width,
    });
  };

  const handleSaveEdit = () => {
    if (!editingRoute) return;

    const updates: Partial<Route> = {
      name: editForm.name.trim(),
      type: editForm.type,
      description: editForm.description.trim(),
      color: editForm.color,
      width: editForm.width,
    };

    updateCustomRoute(editingRoute.id, updates);
    setEditingRoute(null);
    loadCustomRoutes();
    onRouteUpdated();
    showSuccess(
      "Route Updated",
      "The route has been successfully updated."
    );
  };

  const handleCancelEdit = () => {
    setEditingRoute(null);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const formatPath = (path: [number, number][]) => {
    if (path.length === 0) return 'No points';
    if (path.length === 1) return '1 point';
    return `${path.length} points`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Custom Routes</DialogTitle>
        </DialogHeader>

        {customRoutes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No custom routes yet.</p>
            <p className="text-sm">Draw your first route on the map!</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-4">
              {customRoutes.map((route) => (
                <div key={route.id} className="border rounded-lg p-4">
                  {editingRoute?.id === route.id ? (
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="edit-name">Name</Label>
                        <Input
                          id="edit-name"
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-type">Type</Label>
                        <Select value={editForm.type} onValueChange={(value: string) => setEditForm({ ...editForm, type: value as "main" | "secondary" | "secret" | "custom" })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {routeTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="edit-description">Description</Label>
                        <Textarea
                          id="edit-description"
                          value={editForm.description}
                          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                          rows={2}
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-color">Color</Label>
                        <Select value={editForm.color} onValueChange={(value: string) => setEditForm({ ...editForm, color: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {colorOptions.map((colorOption) => (
                              <SelectItem key={colorOption.value} value={colorOption.value}>
                                <div className="flex items-center gap-2">
                                  <div
                                    className="w-4 h-4 rounded-full border border-gray-300"
                                    style={{ backgroundColor: colorOption.value }}
                                  />
                                  {colorOption.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="edit-width">Width</Label>
                        <Select value={editForm.width.toString()} onValueChange={(value) => setEditForm({ ...editForm, width: parseInt(value) })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Thin (1px)</SelectItem>
                            <SelectItem value="2">Normal (2px)</SelectItem>
                            <SelectItem value="3">Thick (3px)</SelectItem>
                            <SelectItem value="4">Very Thick (4px)</SelectItem>
                            <SelectItem value="5">Extra Thick (5px)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex space-x-2 pt-2">
                        <Button onClick={handleSaveEdit} className="flex-1">
                          Save
                        </Button>
                        <Button onClick={handleCancelEdit} variant="outline" className="flex-1">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold">{route.name}</h3>
                            <span className="px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-700">
                              {route.type}
                            </span>
                            <div 
                              className="w-4 h-4 rounded-full border border-gray-300"
                              style={{ backgroundColor: route.color }}
                            />
                          </div>
                          {route.description && (
                            <p className="text-gray-600 mb-2">{route.description}</p>
                          )}
                          <div className="text-sm text-gray-500 space-y-1">
                            <p>Points: {formatPath(route.path)}</p>
                            <p>Width: {route.width}px</p>
                            {route.createdAt && (
                              <p>Created: {formatDate(route.createdAt)}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <Button
                            onClick={() => handleEdit(route)}
                            variant="outline"
                            size="sm"
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleDelete(route.id)}
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
  );
};

export default CustomRoutesPanel; 