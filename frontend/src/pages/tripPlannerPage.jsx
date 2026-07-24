import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Navigation,
  Truck,
  Clock3,
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { getLocationLatLng, getLocationName } from "../services/map";
import routeContext from "../contexts/routeContext";
import { useNavigate } from "react-router"
import api from "../axios";
const EMPTY_LOCATION = { name: "", lat: null, lng: null };

const TripPlannerPage = () => {
  const [currentLoc, setCurrentLoc] = useState(EMPTY_LOCATION);
  const [pickupLoc, setPickupLoc] = useState(EMPTY_LOCATION);
  const [dropoffLoc, setDropoffLoc] = useState(EMPTY_LOCATION);
  const [cycleHours, setCycleHours] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const { setEldLogs, setRoutePath, setPoints, setLoading } = useContext(routeContext);
  const navigate = useNavigate()
  const isComplete =
    currentLoc.lat != null &&
    pickupLoc.lat != null &&
    dropoffLoc.lat != null &&
    cycleHours !== "";

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");

    if (!isComplete) {
      setFormError(
        "Pick a location from the suggestions for each field and enter your cycle hours."
      );
      return;
    }

    const hours = Number(cycleHours);
    if (Number.isNaN(hours) || hours < 0 || hours > 70) {
      setFormError("Cycle hours must be a number between 0 and 70.");
      return;
    }

    setSubmitting(true);
    try {
      // Hand off to your route-planning logic / API call here.
      const now = new Date();

      const decimalHour =
        now.getHours() +
        now.getMinutes() / 60 +
        now.getSeconds() / 3600;
      const response = await api.post("/trip_planner/post_data", {
        current: currentLoc,
        pickup: pickupLoc,
        dropoff: dropoffLoc,
        cycle_hour: hours,
        current_time: decimalHour,
      });

      const data = response.data
      setRoutePath(data['mapData'])
      setEldLogs(data['eldLogs'])
      let points = []
      await [currentLoc, pickupLoc, dropoffLoc].forEach(element => {
        points.push([element.lat, element.lng])
      });
      setPoints(points)
      navigate('/trip-results')
    } catch (e) {
      const errorData = e.response?.data;

      console.log(errorData);

      setFormError(errorData.error);
    }
    finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* Background Blur */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-blue-500/20 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-cyan-500/20 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl backdrop-blur-xl sm:p-10"
        >
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold">
              Plan Your <span className="text-blue-400">Trip</span>
            </h1>

            <p className="mt-3 text-slate-400">
              Enter your trip details to generate an optimized route and
              HOS-compliant ELD logs.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <InputField
              id="current-location"
              icon={<Navigation size={18} />}
              label="Current Location"
              placeholder="e.g Dallas, TX"
              value={currentLoc}
              onChange={setCurrentLoc}
            />

            <InputField
              id="pickup-location"
              icon={<Truck size={18} />}
              label="Pickup Location"
              placeholder="e.g Austin, TX"
              value={pickupLoc}
              onChange={setPickupLoc}
            />

            <InputField
              id="dropoff-location"
              icon={<MapPin size={18} />}
              label="Dropoff Location"
              placeholder="e.g Denver, CO"
              value={dropoffLoc}
              onChange={setDropoffLoc}
            />

            {/* Cycle Hours */}
            <div>
              <label
                htmlFor="cycle-hours"
                className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300"
              >
                <Clock3 className="text-blue-400" size={18} />
                Current Cycle Used (Hours)
              </label>

              <input
                id="cycle-hours"
                type="number"
                min="0"
                max="70"
                inputMode="numeric"
                placeholder="e.g 38"
                value={cycleHours}
                onChange={(e) => setCycleHours(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-5 py-4 text-white outline-none transition duration-300 placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
              />

              <p className="mt-2 text-sm text-slate-500">
                Total on-duty hours already used in the current 8-day cycle.
              </p>
            </div>

            <AnimatePresence>
              {formError && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  role="alert"
                  className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                >
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  {formError}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={{ scale: submitting ? 1 : 1.02 }}
              whileTap={{ scale: submitting ? 1 : 0.97 }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 text-lg font-semibold transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  Generate Trip
                  <ArrowRight size={20} />
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

const InputField = ({ id, label, placeholder, icon, value, onChange }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const wrapperRef = useRef(null);

  function handleChange(e) {
    const name = e.target.value;
    onChange({ name, lat: null, lng: null });
    setOpen(true);
  }

  function handleSelect(place) {
    onChange({
      name: place.display_name,
      lat: Number(place.lat),
      lng: Number(place.lon),
    });
    setSuggestions([]);
    setOpen(false);
  }

  // Close the dropdown on outside click.
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (value.name.trim().length < 3 || value.lat != null) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getLocationLatLng(value.name, controller.signal)
        setSuggestions(data);
        setOpen(true);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError("Couldn't look up that location. Try again.");
          setSuggestions([]);
        }
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [value.name, value.lat]);

  return (
    <div ref={wrapperRef}>
      <label
        htmlFor={id}
        className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300"
      >
        <span className="text-blue-400">{icon}</span>
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          type="text"
          autoComplete="off"
          placeholder={placeholder}
          value={value.name}
          onChange={handleChange}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          className="w-full rounded-xl border border-slate-700 bg-slate-800 px-5 py-4 pr-28 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
        />

        {value.lat != null && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-emerald-400">
            Selected
          </span>
        )}

        {loading && (
          <span className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-1 text-sm text-slate-400">
            <Loader2 size={14} className="animate-spin" />
            Searching
          </span>
        )}

        {open && suggestions.length > 0 && (
          <div className="absolute z-50 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-slate-700 bg-slate-900 shadow-xl">
            {suggestions.map((place) => (
              <button
                key={place.place_id}
                type="button"
                onClick={() => handleSelect(place)}
                className="w-full border-b border-slate-800 px-4 py-3 text-left text-sm last:border-b-0 hover:bg-slate-800"
              >
                {place.display_name}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  );
};

export default TripPlannerPage;