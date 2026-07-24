import { useContext } from "react";
import { Navigate } from "react-router";
import routeContext from "../contexts/routeContext";
import { Loader2, Navigation } from "lucide-react";
import { motion } from "framer-motion";

const TripResultRoute = ({ children }) => {
    const { loading, routePath } = useContext(routeContext);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4 rounded-2xl border border-slate-700 bg-slate-900/80 p-8">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    >
                        <Loader2 className="h-8 w-8 text-blue-400" />
                    </motion.div>

                    <div className="text-center">
                        <h2 className="text-lg font-semibold text-white">
                            Planning Your Route
                        </h2>
                        <p className="text-sm text-slate-400">
                            Calculating the best route...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (!routePath) {
        return <Navigate to="/plan-trip" replace />;
    }

    return children;
};

export default TripResultRoute;