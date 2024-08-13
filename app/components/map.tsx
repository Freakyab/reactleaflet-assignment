"use client";
import { TileLayer, MapContainer, Marker, Popup, useMap } from "react-leaflet";
import { userIcon } from "./icons";
import "leaflet/dist/leaflet.css";
import markers from "./location";
import React, { useEffect } from "react";

function FlyToMarker({
  flyTo,
  markerRef,
}: {
  flyTo: { lat: number; lng: number };
  markerRef: React.RefObject<any>[];
}) {
  const map = useMap();

  useEffect(() => {
    if (flyTo.lat !== 0 && flyTo.lng !== 0) {
      const index = markers.findIndex(
        (marker) =>
          marker.position[0] === flyTo.lat && marker.position[1] === flyTo.lng
      );
      map.flyTo([flyTo.lat, flyTo.lng], 12);
      setTimeout(() => {
        if (markerRef[index]?.current) {
          markerRef[index].current.openPopup();
        }
      }, 1500);
    }
  }, [flyTo, map]);

  return null;
}

export default function Map({
  flyTo,
  className,
  setActiveIndex,
}: {
  flyTo: { lat: number; lng: number };
  className: string;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
}) {
  const markerRef = markers.map(() => React.createRef<any>());
  return (
    <MapContainer
      center={[19, 76]}
      zoom={7}
      className={className}
      scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FlyToMarker flyTo={flyTo} markerRef={markerRef} />
      {markers.map((marker, index) => (
        <Marker
          key={index}
          ref={markerRef[index]}
          position={[marker.position[0], marker.position[1]]}
          eventHandlers={{
            click: (event: any) => {
              const map = event.target._map;
              if (map) {
                map.flyTo(marker.position, 12);
                setActiveIndex(index);
              }
            },
          }}
          icon={userIcon}>
          <Popup>{marker.label}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
