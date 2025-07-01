import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Route, addCustomRoute } from "../../data/routes";
import { useAlert } from "../../hooks/useAlert";

interface AddRouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  routePath: [number, number][];
  onRouteAdded: () => void;
}

const AddRouteModal = ({
  isOpen,
  onClose,
  routePath,
  onRouteAdded,
}: AddRouteModalProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"main" | "secondary" | "secret" | "custom">("custom");
  const [color, setColor] = useState("#FF6B6B");
  const [width, setWidth] = useState(3);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { showError, showSuccess } = useAlert();

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setName("");
      setDescription("");
      setType("custom");
      setColor("#FF6B6B");
      setWidth(3);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      showError("Validation Error", "Route name is required.");
      return;
    }

    if (routePath.length < 2) {
      showError("Validation Error", "Route must have at least 2 points.");
      return;
    }

    setIsSubmitting(true);

    try {
      const newRoute: Omit<Route, 'id' | 'isCustom' | 'createdAt'> = {
        name: name.trim(),
        description: description.trim(),
        type,
        color,
        width,
        path: routePath,
      };

      addCustomRoute(newRoute);
      
      showSuccess(
        "Route Added",
        `Route "${name}" has been successfully added to the map.`
      );
      
      onRouteAdded();
      onClose();
    } catch (error) {
      showError(
        "Error",
        "Failed to add route. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Custom Route</DialogTitle>
          <DialogDescription>
            Create a new custom route on the map. The route will be saved to your local storage.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Route Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter route name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe this route..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Route Type</Label>
            <Select value={type} onValueChange={(value: string) => setType(value as "main" | "secondary" | "secret" | "custom")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="custom">Custom</SelectItem>
                <SelectItem value="main">Main</SelectItem>
                <SelectItem value="secondary">Secondary</SelectItem>
                <SelectItem value="secret">Secret</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <Select value={color} onValueChange={setColor}>
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

          <div className="space-y-2">
            <Label htmlFor="width">Width</Label>
            <Select value={width.toString()} onValueChange={(value) => setWidth(parseInt(value))}>
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

          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
            <strong>Route Points:</strong> {routePath.length} points
            <br />
            <strong>Coordinates:</strong> {routePath.map(([lat, lng]) => `(${lat.toFixed(2)}, ${lng.toFixed(2)})`).join(" → ")}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Route"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddRouteModal; 