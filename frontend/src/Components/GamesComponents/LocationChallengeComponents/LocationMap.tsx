import { memo, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
    MapContainer,
    Marker,
    Polyline,
    TileLayer,
    useMap,
    useMapEvents,
} from "react-leaflet";
import type { LocationPoint } from "../../../Contexts/GamesContexts/LocationChallengeContext";

interface Props {
    guess: LocationPoint | null;
    correctLocation: LocationPoint | null;
    disabled: boolean;
    onGuess: (point: LocationPoint) => void;
}

// OpenStreetMap affiche les noms des villes. Pour un jeu plus difficile, tu peux utiliser :
// "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
const TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILE_ATTRIBUTION =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

// Pastilles rondes ancrées au centre : pas besoin des images par défaut de Leaflet
// (qui posent souci avec Vite) et le point cliqué reste précis.
const makeIcon = (color: string) =>
    L.divIcon({
        className: "",
        html: `<div style="width:24px;height:24px;border-radius:9999px;background:${color};border:4px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.45);"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
    });

const guessIcon = makeIcon("#292722");
const correctIcon = makeIcon("#16a34a");

const ClickHandler = ({
    disabled,
    onGuess,
}: {
    disabled: boolean;
    onGuess: (point: LocationPoint) => void;
}) => {
    useMapEvents({
        click(event) {
            if (disabled) return;
            onGuess({
                latitude: event.latlng.lat,
                longitude: event.latlng.lng,
            });
        },
    });

    return null;
};

// Une fois la réponse révélée, cadre la carte sur les deux points.
const FitResult = ({
    guess,
    correct,
}: {
    guess: LocationPoint;
    correct: LocationPoint;
}) => {
    const map = useMap();

    useEffect(() => {
        const bounds = L.latLngBounds(
            [guess.latitude, guess.longitude],
            [correct.latitude, correct.longitude]
        );
        map.fitBounds(bounds, { padding: [60, 60], maxZoom: 8 });
    }, [
        map,
        guess.latitude,
        guess.longitude,
        correct.latitude,
        correct.longitude,
    ]);

    return null;
};

const LocationMap = ({ guess, correctLocation, disabled, onGuess }: Props) => {
    const showResult = Boolean(guess && correctLocation);

    return (
        <div className="relative isolate z-0 h-[420px] w-full overflow-hidden rounded-2xl border border-[#292722]/15 max-[600px]:h-[340px]">
            <MapContainer
                center={[20, 0]}
                zoom={2}
                minZoom={2}
                worldCopyJump
                className="h-full w-full"
                style={{ cursor: disabled ? "grab" : "crosshair" }}
            >
                <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />

                <ClickHandler disabled={disabled} onGuess={onGuess} />

                {guess && (
                    <Marker
                        position={[guess.latitude, guess.longitude]}
                        icon={guessIcon}
                    />
                )}

                {showResult && guess && correctLocation && (
                    <>
                        <Marker
                            position={[
                                correctLocation.latitude,
                                correctLocation.longitude,
                            ]}
                            icon={correctIcon}
                        />
                        <Polyline
                            positions={[
                                [guess.latitude, guess.longitude],
                                [
                                    correctLocation.latitude,
                                    correctLocation.longitude,
                                ],
                            ]}
                            pathOptions={{
                                color: "#B08D57",
                                weight: 3,
                                dashArray: "6 8",
                            }}
                        />
                        <FitResult guess={guess} correct={correctLocation} />
                    </>
                )}
            </MapContainer>
        </div>
    );
};

export default memo(LocationMap);