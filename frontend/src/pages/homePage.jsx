import { MapPinned, Truck, Clock3, Route, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";

const HomePage = () => {
  const navigate = useNavigate()
  const redirect = ()=>{
    navigate('/plan-trip')
  }
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-blue-500/20 blur-[120px]" />
        <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-cyan-500/20 blur-[120px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-10 py-6">
        <h1 className="text-2xl font-bold tracking-wide">
          RoutePilot
        </h1>

        <button className="rounded-xl bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-700" onClick={redirect}>
          Plan Trip
        </button>
      </nav>

      {/* Hero */}
      <section className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-6 pt-20 text-center">

        <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-5 py-2 text-sm text-blue-300">
          Smart ELD Trip Planning
        </span>

        <h1 className="mt-8 max-w-5xl text-6xl font-extrabold leading-tight">
          Plan Smarter Routes.
          <br />
          Stay <span className="text-blue-400">HOS Compliant.</span>
        </h1>

        <p className="mt-8 max-w-3xl text-lg text-slate-300 leading-8">
          RoutePilot helps commercial truck drivers calculate optimized
          routes, generate compliant ELD logs, schedule mandatory rest
          breaks, and visualize every stop before hitting the road.
        </p>

        <div className="mt-12 flex gap-5">
          <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-lg font-semibold transition hover:bg-blue-700" onClick={redirect}>
            Plan Your Trip
            <ArrowRight size={20} />
          </button>

          <button className="rounded-xl border border-slate-700 px-8 py-4 text-lg transition hover:bg-slate-800">
            Learn More
          </button>
        </div>

        {/* Hero Card */}
        <div className="mt-20 w-full max-w-6xl rounded-3xl border border-slate-800 bg-slate-900/60 p-10 backdrop-blur-xl shadow-2xl">

          <div className="grid gap-8 md:grid-cols-4">

            <div className="rounded-2xl bg-slate-800/70 p-8">
              <Truck className="text-blue-400" size={40} />
              <h3 className="mt-5 text-xl font-bold">
                Trip Planning
              </h3>
              <p className="mt-3 text-slate-400">
                Calculate efficient routes for long-haul trucking.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-800/70 p-8">
              <Clock3 className="text-green-400" size={40} />
              <h3 className="mt-5 text-xl font-bold">
                HOS Rules
              </h3>
              <p className="mt-3 text-slate-400">
                Automatically schedule mandatory breaks and rest periods.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-800/70 p-8">
              <Route className="text-orange-400" size={40} />
              <h3 className="mt-5 text-xl font-bold">
                Route Optimization
              </h3>
              <p className="mt-3 text-slate-400">
                Visualize your complete journey on an interactive map.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-800/70 p-8">
              <MapPinned className="text-purple-400" size={40} />
              <h3 className="mt-5 text-xl font-bold">
                ELD Logs
              </h3>
              <p className="mt-3 text-slate-400">
                Generate daily electronic logging sheets automatically.
              </p>
            </div>

          </div>
        </div>

      </section>

      {/* Footer */}
      <footer className="relative z-10 mt-24 border-t border-slate-800 py-8 text-center text-slate-500">
        © 2026 RoutePilot • Built with React & Django
      </footer>
    </div>
  );
};

export default HomePage;