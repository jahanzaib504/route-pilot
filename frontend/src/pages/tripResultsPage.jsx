import { useEffect, useState, useContext, useMemo } from "react";
import { eldLogsData, routeSummaryData } from "../devData";
import { Navigation, StopCircle, Timer, TimerIcon, LucideMessageCircleWarning } from "lucide-react"
import routeContext from "../contexts/routeContext";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import { LatLngBounds, point } from "leaflet";
import DisplayEldGraph from "../components/DisplayEldGraph"


const TripResultPage = () => {
    const { eldLogs, routePath, points, setEldLogs, setRoutePath, setPoints } = useContext(routeContext);
    const coordinates = useMemo(() => {
        if (!routePath?.paths?.length) return [];
        // Changing the format
        return routePath.paths[0].points.coordinates.map(([lng, lat]) => [
            lat,
            lng,
        ]);
    }, [routePath]);
    
    const bounds = useMemo(() => {
        if (coordinates.length === 0) return null;

        return new LatLngBounds(coordinates);
    }, [coordinates]);
    
    if (!coordinates.length)
        return (
            <div className="flex h-screen items-center justify-center">
                Loading Route...
            </div>
        );

    return (
        <div className="h-screen w-screen">
            <MapContainer
                bounds={bounds}
                scrollWheelZoom
                className="h-full w-full"
            >
                <TileLayer
                    attribution="© OpenStreetMap contributors"
                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {/*Connects all the coordinates */}
                <Polyline
                    positions={coordinates}
                    pathOptions={{
                        color: "#2563eb",
                        weight: 6,
                        opacity: 0.9,
                    }}
                />
                {points.map((point, index) => {
                    const labels = [
                        "Current Location",
                        "Pickup Location",
                        "Drop-off Location",
                    ];
                    const colors = [
                        "bg-blue-500",
                        "bg-green-500",
                        "bg-red-500"
                    ]

                    return (
                        <Marker key={index} position={point}>
                            <Popup>{labels[index] || `Stop ${index + 1}`}</Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
}
export default TripResultPage;