import { memo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";

import type { ChallengeCoordinates } from "../../Types/GamesAdmin";

const pinIcon = L.divIcon({
    className: "",
    html: `<div style="width:24px;height:24px;border-radius:9999px;background:#B89B72;border:4px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.45);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
});

// Leaflet permet de faire défiler la carte au-delà de ±180° : on ramène dans [-180, 180)
const normalizeLongitude = (longitude: number) =>
    ((((longitude + 180) % 360) + 360) % 360) - 180;

const ClickHandler = ({
    onPick,
}: {
    onPick: (coordinates: ChallengeCoordinates) => void;
}) => {
    useMapEvents({
        click(event) {
            onPick({
                latitude: event.latlng.lat,
                longitude: normalizeLongitude(event.latlng.lng),
            });
        },
    });

    return null;
};

interface Props {
    position: ChallengeCoordinates | null;
    onPick: (coordinates: ChallengeCoordinates) => void;
}

const CoordinatePicker = ({ position, onPick }: Props) => (
    <div className="relative isolate z-0 h-[320px] w-full overflow-hidden rounded-xl border border-[#E7E0D6]">
        <MapContainer
            center={
                position ? [position.latitude, position.longitude] : [20, 0]
            }
            zoom={position ? 5 : 2}
            minZoom={2}
            worldCopyJump
            className="h-full w-full"
            style={{ cursor: "crosshair" }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            <ClickHandler onPick={onPick} />

            {position && (
                <Marker
                    position={[position.latitude, position.longitude]}
                    icon={pinIcon}
                />
            )}
        </MapContainer>
    </div>
);

export default memo(CoordinatePicker);
