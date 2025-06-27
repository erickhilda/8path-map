import { Marker, Popup, Tooltip } from "react-leaflet";
import { determineIcon } from "./icons";
import { MarkerData } from "../../data/markers";

interface MapMarkerProps {
  marker: MarkerData;
  zoom: number;
  index: number;
}

const MapMarker = ({ marker, zoom }: MapMarkerProps) => {
  const { name, type, location, description, link, major } = marker;
  const icon = determineIcon({ type, major }, zoom);

  return icon ? (
    <Marker 
      position={location} 
      icon={icon}
    >
      {name ? <Tooltip>{name}</Tooltip> : null}
      {description ? (
        <Popup>
          {description}
          <br />
          {link ? (
            <a href={link} target="_blank" rel="noreferrer">
              Wiki Page
            </a>
          ) : (
            ""
          )}
        </Popup>
      ) : null}
    </Marker>
  ) : null;
};

export default MapMarker;
