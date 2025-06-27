import { Marker, Popup, Tooltip } from "react-leaflet";

import { determineIcon } from "./icons";

interface MarkerData {
  name: string;
  type: string;
  location: [number, number];
  description?: string;
  link?: string;
  major: boolean;
}

interface MapMarkerProps {
  marker: MarkerData;
  zoom: number;
  index: number;
}

const MapMarker = ({ marker, zoom, index }: MapMarkerProps) => {
  const { name, type, location, description, link, major } = marker;
  let icon = determineIcon({ type, major }, zoom);

  return !!icon ? (
    <Marker position={location} icon={icon} id={index + name}>
      {!!name ? <Tooltip>{name}</Tooltip> : null}
      {!!description ? (
        <Popup>
          {description}
          <br />
          {!!link ? (
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
