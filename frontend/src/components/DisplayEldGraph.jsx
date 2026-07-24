const STATUS_INDEX = {
  OFF: 0,
  SB: 1,
  D: 2,
  ON: 3,
};

const STATUS_COLORS = {
  OFF: "#94a3b8", // slate — off duty
  SB: "#8b5cf6",  // violet — sleeper berth
  D: "#2563eb",   // blue — driving (the status that matters most)
  ON: "#f59e0b",  // amber — on duty, not driving
};

const STATUS_LABELS = {
  OFF: "Off Duty",
  SB: "Sleeper Berth",
  D: "Driving",
  ON: "On Duty",
};

const DisplayELDGraph = ({ eldLog }) => {
  const width = 1200;
  const height = 280;

  const margin = {
    top: 34,
    right: 30,
    bottom: 46,
    left: 90,
  };

  const graphWidth = width - margin.left - margin.right;
  const graphHeight = height - margin.top - margin.bottom;

  const statuses = ["OFF", "SB", "D", "ON"];
  const rowHeight = graphHeight / statuses.length;

  const getY = (status) =>
    margin.top + STATUS_INDEX[status] * rowHeight + rowHeight / 2;

  const getX = (hour) => margin.left + (hour / 24) * graphWidth;

  // Build a flat list of quarter-hour ticks (0, 0.25, 0.5, 0.75, 1, ...)
  const ticks = [];
  for (let h = 0; h <= 24; h += 0.25) ticks.push(h);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="overflow-visible"
      >
        <defs>
          <filter id="dutyShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#1e293b" floodOpacity="0.18" />
          </filter>
        </defs>

        {/* Row shading */}
        {statuses.map((_, index) => (
          <rect
            key={index}
            x={margin.left}
            y={margin.top + index * rowHeight}
            width={graphWidth}
            height={rowHeight}
            fill={index % 2 === 0 ? "#ffffff" : "#f8fafc"}
          />
        ))}

        {/* Outer frame */}
        <rect
          x={margin.left}
          y={margin.top}
          width={graphWidth}
          height={graphHeight}
          rx="10"
          fill="none"
          stroke="#e2e8f0"
        />

        {/* Status Labels */}
        {statuses.map((status, index) => {
          const y = margin.top + index * rowHeight + rowHeight / 2;
          return (
            <g key={status}>
              <circle cx={margin.left - 58} cy={y} r={4} fill={STATUS_COLORS[status]} />
              <text
                x={margin.left - 15}
                y={y + 4}
                textAnchor="end"
                className="fill-slate-600 text-xs font-semibold select-none"
              >
                {status}
              </text>
            </g>
          );
        })}

        {/* Horizontal row dividers */}
        {statuses.map((_, index) => {
          const y = margin.top + index * rowHeight;
          return (
            <line
              key={index}
              x1={margin.left}
              y1={y}
              x2={width - margin.right}
              y2={y}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          );
        })}

        {/* Ruler-style tick marks: quarter / half / hour, like a logbook scale */}
        {ticks.map((h) => {
          const x = getX(h);
          const isHour = h % 1 === 0;
          const isSixHour = h % 6 === 0;
          const isHalf = h % 1 === 0.5;

          const tickLen = isSixHour ? 14 : isHour ? 10 : isHalf ? 7 : 4;
          const strokeColor = isSixHour ? "#475569" : isHour ? "#94a3b8" : "#cbd5e1";
          const strokeW = isSixHour ? 1.5 : 1;

          return (
            <line
              key={h}
              x1={x}
              y1={margin.top - tickLen}
              x2={x}
              y2={margin.top}
              stroke={strokeColor}
              strokeWidth={strokeW}
            />
          );
        })}

        {/* Faint vertical guides through the body, only at each hour */}
        {Array.from({ length: 25 }).map((_, hour) => {
          const x = getX(hour);
          return (
            <line
              key={hour}
              x1={x}
              y1={margin.top}
              x2={x}
              y2={margin.top + graphHeight}
              stroke={hour % 6 === 0 ? "#cbd5e1" : "#f1f5f9"}
              strokeWidth={hour % 6 === 0 ? 1 : 1}
            />
          );
        })}

        {/* Baseline of the ruler */}
        <line
          x1={margin.left}
          y1={margin.top}
          x2={width - margin.right}
          y2={margin.top}
          stroke="#475569"
          strokeWidth="1.5"
        />

        {/* Hour numerals — sit above the ruler ticks */}
        {Array.from({ length: 25 }).map((_, hour) => {
          const x = getX(hour);
          return (
            <text
              key={hour}
              x={x}
              y={margin.top - 20}
              textAnchor="middle"
              className="fill-slate-500 text-[10px] font-mono"
            >
              {hour === 0 ? "M" : hour === 12 ? "N" : hour === 24 ? "M" : hour}
            </text>
          );
        })}

        {/* ELD Path, colored by status */}
        {eldLog.map((log, index) => {
          const currentY = getY(log.status);
          const next = eldLog[index + 1];
          const color = STATUS_COLORS[log.status];

          return (
            <g key={index} filter="url(#dutyShadow)">
              <line
                x1={getX(log.start)}
                y1={currentY}
                x2={getX(log.end)}
                y2={currentY}
                stroke={color}
                strokeWidth={5}
                strokeLinecap="round"
              />
              {next && (
                <line
                  x1={getX(log.end)}
                  y1={currentY}
                  x2={getX(log.end)}
                  y2={getY(next.status)}
                  stroke={color}
                  strokeWidth={3}
                  strokeLinecap="round"
                  opacity={0.6}
                />
              )}
              <circle cx={getX(log.start)} cy={currentY} r={3.5} fill={color} />
              <circle cx={getX(log.end)} cy={currentY} r={3.5} fill={color} />
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="mt-2 flex flex-wrap gap-4 pl-[90px]">
        {statuses.map((status) => (
          <div key={status} className="flex items-center gap-1.5">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: STATUS_COLORS[status] }}
            />
            <span className="text-xs text-slate-500">{STATUS_LABELS[status]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DisplayELDGraph;