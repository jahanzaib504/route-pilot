const routeSummaryData = {
  currentLocation: "Dallas, TX",
  pickupLocation: "Austin Warehouse, TX",
  dropoffLocation: "Denver Distribution Center, CO",

  distance: "1,250 mi",
  estimatedDrivingTime: "20h 15m",
  estimatedTripDuration: "28h 30m",

  currentCycleUsed: 38,
  cycleRemaining: 32,

  totalFuelStops: 2,
  totalRestBreaks: 3,

  averageSpeed: "62 mph",

  routeStatus: "HOS Compliant",
  isPossible: false
};
const eldLogsData = [
  {
    day: 1,
    date: "2026-07-22",

    logs: [
      {
        status: "Off Duty",
        start: "06:00",
        end: "07:00",
      },

      {
        status: "Driving",
        start: "07:00",
        end: "11:00",
      },

      {
        status: "Break",
        start: "11:00",
        end: "11:30",
      },

      {
        status: "Driving",
        start: "11:30",
        end: "16:30",
      },

      {
        status: "On Duty",
        start: "16:30",
        end: "17:00",
      },

      {
        status: "Sleeper Berth",
        start: "17:00",
        end: "11:59",
      },
    ],
  },

  {
    day: 2,
    date: "2026-07-23",

    logs: [
      {
        status: "Driving",
        start: "12:00",
        end: "08:00",
      },

      {
        status: "Fuel Stop",
        start: "08:00",
        end: "08:20",
      },

      {
        status: "Driving",
        start: "08:20",
        end: "01:00",
      },

      {
        status: "Delivered",
        start: "01:00",
        end: "02:00",
      },
    ],
  },
];
export {routeSummaryData, eldLogsData}