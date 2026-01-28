import React, { useState, useMemo } from "react";

const MapComponent = ({ points, path }) => {
  const [showSolutionLines, setShowSolutionLines] = useState(false);

  const limits = useMemo(() => {
    if (points.length === 0) return { minX: 0, maxX: 100, minY: 0, maxY: 100 };
    const xs = points.map((p) => p.x);
    const ys = points.map((p) => p.y);
    return {
      minX: Math.min(...xs),
      maxX: Math.max(...xs),
      minY: Math.min(...ys),
      maxY: Math.max(...ys),
    };
  }, [points]);

  const padding = 50;
  const width = limits.maxX - limits.minX + padding * 2;
  const height = limits.maxY - limits.minY + padding * 2;
  const viewBox = `${limits.minX - padding} ${limits.minY - padding} ${width} ${height}`;


  const handleToggleLines = () => {
    setShowSolutionLines(!showSolutionLines);
  };

  return (
    <div className="component-box map-container">
      {/* Wymagany podpis (Wymóg 2) */}
      <h3>Wizualizacja problemu</h3>

      <div className="svg-wrapper">
        {points.length > 0 ? (
          <svg viewBox={viewBox} className="tsp-svg">
            {/* Rysowanie połączeń (LINIE) - Wymóg 6 */}
            {showSolutionLines &&
              path.length > 0 &&
              path.map((pointId, index) => {
                // 1. Znajdź współrzędne punktu startowego linii
                const p1 = points.find((p) => p.id === pointId);

                // 2. Znajdź współrzędne punktu końcowego linii
                // Jeśli to ostatni element, łączymy go z pierwszym (pętla)
                const nextIndex = (index + 1) % path.length;
                const p2Id = path[nextIndex];
                const p2 = points.find((p) => p.id === p2Id);

                // Zabezpieczenie, gdyby dane były niespójne
                if (!p1 || !p2) return null;

                return (
                  <line
                    key={`line-${index}`}
                    x1={p1.x}
                    y1={p1.y}
                    x2={p2.x}
                    y2={p2.y}
                    stroke="#3498db"
                    strokeWidth={width / 300} // Grubość linii skalowana względem mapy
                    strokeOpacity="0.6"
                  />
                );
              })}

            {/* Rysowanie punktów (KROPKI) - Wymóg 2 */}
            {points.map((p) => (
              <g key={p.id}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={width / 150} // Promień kropki skalowany
                  fill="black"
                />
                {/* Opcjonalnie: numer punktu */}
                <text
                  x={p.x}
                  y={p.y - width / 120}
                  fontSize={width / 100}
                  textAnchor="middle"
                  fill="#555"
                >
                  {p.id}
                </text>
              </g>
            ))}
          </svg>
        ) : (
          <p className="placeholder">Wczytaj plik, aby zobaczyć mapę.</p>
        )}
      </div>

      {/* Przycisk sterujący widocznością - Wymóg 6 */}
      <button
        onClick={handleToggleLines}
        disabled={points.length === 0}
        style={{ marginTop: "10px" }}
      >
        {showSolutionLines ? "Ukryj rozwiązanie" : "Pokaż rozwiązanie"}
      </button>
    </div>
  );
};

export default MapComponent;
