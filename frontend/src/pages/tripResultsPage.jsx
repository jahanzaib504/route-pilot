import { useEffect, useState, useContext, useMemo, useRef } from "react";
import { eldLogsData, routeSummaryData } from "../devData";
import {
    Navigation,
    StopCircle,
    Timer,
    TimerIcon,
    LucideMessageCircleWarning,
    ChevronLeft,
    ChevronRight,
    Download,
} from "lucide-react";
import routeContext from "../contexts/routeContext";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import { LatLngBounds } from "leaflet";
import DisplayEldGraph from "../components/DisplayEldGraph";

const PANEL_HEIGHT = 480; // px

const TripResultPage = () => {
    const { eldLogs, routePath, points, setEldLogs, setRoutePath, setPoints } = useContext(routeContext);

    const [selectedDay, setSelectedDay] = useState(0);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const svgWrapperRef = useRef(null);

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

    // Keep selectedDay valid if eldLogs changes (e.g. shorter trip recalculated)
    useEffect(() => {
        if (eldLogs?.length && selectedDay >= eldLogs.length) {
            setSelectedDay(0);
        }
    }, [eldLogs, selectedDay]);

    const handleDownload = () => {
        const svgElement = svgWrapperRef.current?.querySelector("svg");
        if (!svgElement) return;

        const serializer = new XMLSerializer();
        let svgString = serializer.serializeToString(svgElement);

        // Ensure the namespace is present so the file opens correctly outside the browser
        if (!svgString.includes("xmlns=")) {
            svgString = svgString.replace(
                "<svg",
                '<svg xmlns="http://www.w3.org/2000/svg"'
            );
        }

        const blob = new Blob([svgString], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `eld-log-day-${selectedDay + 1}.svg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    if (!coordinates.length)
        return (
            <div className="flex h-screen items-center justify-center">
                Loading Route...
            </div>
        );

    const hasLogs = Array.isArray(eldLogs) && eldLogs.length > 0;

    return (
        <div className="h-screen w-screen relative overflow-hidden">
            <MapContainer
                bounds={bounds}
                scrollWheelZoom
                className="h-full w-full"
            >
                <TileLayer
                    attribution="© OpenStreetMap contributors"
                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
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
                    return (
                        <Marker key={index} position={point}>
                            <Popup>{labels[index] || `Stop ${index + 1}`}</Popup>
                        </Marker>
                    );
                })}
            </MapContainer>

            {/* Toggle arrow — sits on the panel's edge, slides with it */}
            {hasLogs && (
                <button
                    onClick={() => setIsPanelOpen((open) => !open)}
                    className="fixed left-1/2 -translate-x-1/2 bg-blue-500 shadow-lg rounded-t-md p-2 border border-gray-200 border-b-0 transition-all duration-300 z-[1001]"
                    style={{
                        bottom: isPanelOpen ? `${PANEL_HEIGHT}px` : "0px",
                    }}
                    aria-label={isPanelOpen ? "Hide ELD logs" : "Show ELD logs"}
                >
                    {isPanelOpen ? (
                        <ChevronRight className="rotate-90" size={20} />
                    ) : (
                        <ChevronLeft className="-rotate-90" size={20} />
                    )}
                </button>
            )}

            {/* Fixed, slide-in ELD log panel */}
            {hasLogs && (
                <div
                    className="fixed bottom-0 left-0 w-full bg-white shadow-2xl z-[1000] transition-transform duration-300 flex flex-col"
                    style={{
                        height: `${PANEL_HEIGHT}px`,
                        transform: isPanelOpen
                            ? "translateY(0)"
                            : "translateY(100%)",
                    }}
                >
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800">
                            ELD Log
                        </h2>

                        <button
                            onClick={handleDownload}
                            className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700"
                        >
                            <Download size={16} />
                            Download
                        </button>
                    </div>

                    <div className="flex items-center gap-4 p-4 border-b border-gray-200">
                        <label htmlFor="day-select">Day</label>

                        <select
                            id="day-select"
                            value={selectedDay}
                            onChange={(e) => setSelectedDay(Number(e.target.value))}
                            className="border rounded-md px-3 py-2"
                        >
                            {eldLogs.map((_, index) => (
                                <option key={index} value={index}>
                                    Day {index + 1}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div
                        className="flex-1 overflow-auto p-4"
                        ref={svgWrapperRef}
                    >
                        <DisplayEldGraph eldLog={eldLogs[selectedDay]} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default TripResultPage;