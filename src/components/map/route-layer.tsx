import { LayerGroup, Polyline, Tooltip, Popup } from "react-leaflet";
import { Route } from "../../data/routes";

interface RouteLayerProps {
  routes: Route[];
  visibleRoutes: string[];
}

const RouteLayer = ({ routes, visibleRoutes }: RouteLayerProps) => {
  const visibleRouteData = routes.filter(route => visibleRoutes.includes(route.id));

  return (
    <LayerGroup>
      {visibleRouteData.map((route) => (
        <Polyline
          key={route.id}
          positions={route.path}
          pathOptions={{
            color: route.color,
            weight: route.width,
            opacity: 0.8,
            dashArray: route.type === 'secret' ? '10, 5' : undefined,
          }}
        >
          <Tooltip>{route.name}</Tooltip>
          <Popup>
            <div>
              <h3 className="font-bold text-lg">{route.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{route.description}</p>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 rounded-full bg-gray-200">
                  {route.type}
                </span>
                <div 
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: route.color }}
                />
              </div>
            </div>
          </Popup>
        </Polyline>
      ))}
    </LayerGroup>
  );
};

export default RouteLayer; 