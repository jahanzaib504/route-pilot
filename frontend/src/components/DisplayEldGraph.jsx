const STATUS_INDEX = {
  OFF: 0,
  SB: 1,
  D: 2,
  ON: 3,
};

const DisplayELDGraph = ({ eldLog }) => {
  // Sample Data
  eldLog = [
    { start: 0, end: 2.5, status: "OFF" },
    { start: 2.5, end: 5, status: "D" },
    { start: 5, end: 7, status: "ON" },
    { start: 7, end: 11, status: "SB" },
    { start: 11, end: 16, status: "D" },
    { start: 16, end: 24, status: "OFF" },
  ];

  const width = 1200;
  const height = 260;

  const margin = {
    top: 30,
    right: 30,
    bottom: 30,
    left: 80,
  };

  const graphWidth = width - margin.left - margin.right;
  const graphHeight = height - margin.top - margin.bottom;

  const statuses = ["OFF", "SB", "D", "ON"];
  const rowHeight = graphHeight / statuses.length;

  const getY = (status) =>
    margin.top + STATUS_INDEX[status] * rowHeight + rowHeight / 2;

  const getX = (hour) => margin.left + (hour / 24) * graphWidth;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <svg
        width="100%"
        height="260"
        viewBox={`0 0 ${width} ${height}`}
        className="overflow-visible"
      >
        {/* Background */}
        <rect
          x={margin.left}
          y={margin.top}
          width={graphWidth}
          height={graphHeight}
          rx="10"
          fill="#fafafa"
        />

        {/* Status Labels */}
        {statuses.map((status, index) => {
          const y = margin.top + index * rowHeight + rowHeight / 2;

          return (
            <text
              key={status}
              x={margin.left - 15}
              y={y + 4}
              textAnchor="end"
              className="fill-slate-600 text-xs font-semibold select-none"
            >
              {status}
            </text>
          );
        })}

        {/* Horizontal Grid */}
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

        <line
          x1={margin.left}
          y1={margin.top + graphHeight}
          x2={width - margin.right}
          y2={margin.top + graphHeight}
          stroke="#e5e7eb"
        />

        {/* Vertical Hour Grid */}
        {Array.from({ length: 25 }).map((_, hour) => {
          const x = getX(hour);

          return (
            <g key={hour}>
              <line
                x1={x}
                y1={margin.top}
                x2={x}
                y2={margin.top + graphHeight}
                stroke={hour % 6 === 0 ? "#94a3b8" : "#f1f5f9"}
                strokeWidth={hour % 6 === 0 ? 1.5 : 1}
              />

              <text
                x={x}
                y={margin.top - 10}
                textAnchor="middle"
                className="fill-slate-500 text-[10px] font-mono"
              >
                {hour === 0
                  ? "M"
                  : hour === 12
                  ? "N"
                  : hour === 24
                  ? "M"
                  : hour}
              </text>
            </g>
          );
        })}
        {/* ELD Path */}
        {eldLog.map((log, index) => {
          const currentY = getY(log.status);

          const next = eldLog[index + 1];

          return (
            <g key={index}>
              {/* Horizontal Duty Line */}
              <line
                x1={getX(log.start)}
                y1={currentY}
                x2={getX(log.end)}
                y2={currentY}
                stroke="#2563eb"
                strokeWidth={5}
                strokeLinecap="round"
              />

              {/* Transition Line */}
              {next && (
                <line
                  x1={getX(log.end)}
                  y1={currentY}
                  x2={getX(log.end)}
                  y2={getY(next.status)}
                  stroke="#2563eb"
                  strokeWidth={5}
                  strokeLinecap="round"
                />
              )}

              {/* Start Marker */}
              <circle
                cx={getX(log.start)}
                cy={currentY}
                r={4}
                fill="#2563eb"
              />

              {/* End Marker */}
              <circle
                cx={getX(log.end)}
                cy={currentY}
                r={4}
                fill="#2563eb"
              />
            </g>
          );
        })}
        
      </svg>
    </div>
  );
};
export default DisplayELDGraph