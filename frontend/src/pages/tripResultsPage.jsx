import { useEffect, useState } from "react";
import { eldLogsData, routeSummaryData } from "../devData";
import { Navigation, StopCircle, Timer, TimerIcon, LucideMessageCircleWarning } from "lucide-react"
const TripResultPage = () => {
    const [routeSummary, setRouteSummary] = useState(routeSummaryData);
    const [eldLogs, setEldLogs] = useState(eldLogsData); // Array of eld logs for each day
    return (<div className="relative min-h-screen overflow-hidden text-white bg-slate-950">
        <div className="max-w-5xl mx-auto">
            <h1 className="text-center text-4xl text-blue-400 mt-3">Trip Results</h1>
            <div className="px-4 py-4 mt-3 bg-slate-900/50 flex justify-evenly">
                <SummaryOutput placeholder={"Current Location"} value={routeSummary.currentLocation} icon={<Navigation />} />
                <SummaryOutput placeholder={"Pickup Location"} value={routeSummary.pickupLocation} icon={<Navigation />} />
                <SummaryOutput placeholder={"Dropoff Location"} value={routeSummary.dropoffLocation} icon={<Navigation />} />
                <SummaryOutput placeholder={"Estimated Trip Duration"} value={routeSummary.estimatedTripDuration} icon={<Timer />} />
            </div>
            {!routeSummary.isPossible && <div className="py-2 px-1 bg-red-400 w-full text-lg flex items-center justify-center gap-2"><span><LucideMessageCircleWarning size={20} /></span>Unfortunately this trip is not HOS complaint. Please create an HOS complaint </div>}
            {routeSummary.isPossible}
        </div>
    </div>)
}
const SummaryOutput = ({ placeholder, value, icon }) => {
    return (<div className="flex flex-col gap-2 w-50">
        <div className="text-white gap-1 items-center text-xl font-bold flex"><span className="text-blue-500">{icon}</span><h2>{placeholder}</h2></div>
        <p>{value}</p>
    </div>)
}
const DisplayEldLogs = ({ eldLogs = [] }) => {
    return (<div>
        {eldLogs && eldLogs.length > 0 && eldLogs.map((data) => (
            <DisplayELDGraph eldLog={data}/>
        ))}
    </div>)
}
const DisplayELDGraph = ({ eldLog }) => {
    return (<svg
        width="100%"
        height="260"
        viewBox="0 0 1200 260"
        className="border rounded-xl bg-white"
    >
    </svg>)
}
export default TripResultPage;