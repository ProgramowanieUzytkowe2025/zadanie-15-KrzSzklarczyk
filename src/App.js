import React, { useState, useEffect, useRef } from "react";
import "./App.css";

// Import komponentów
import MapComponent from "./MapComponent";
import SolutionDisplay from "./SolutionDisplay";
import ControlPanel from "./ControlPanel";
import ProgressChart from "./ProgressChart";

// --- Funkcje pomocnicze ---
const calculateDistance = (p1, p2) =>
  Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));

const calculateTotalDistance = (points, order) => {
  if (!points.length || !order.length) return 0;
  let sum = 0;
  for (let i = 0; i < order.length - 1; i++) {
    const p1 = points.find((p) => p.id === order[i]);
    const p2 = points.find((p) => p.id === order[i + 1]);
    if (p1 && p2) sum += calculateDistance(p1, p2);
  }
  const pLast = points.find((p) => p.id === order[order.length - 1]);
  const pFirst = points.find((p) => p.id === order[0]);
  if (pLast && pFirst) sum += calculateDistance(pLast, pFirst);
  return sum;
};

const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

function App() {
  // --- STAN APLIKACJI ---
  const [points, setPoints] = useState([]);

  // path: Aktualnie wyświetlana ścieżka (zmienia się co iterację)
  const [path, setPath] = useState([]);

  // currentDistance: Dystans aktualnej ścieżki (do wyświetlania pod mapą)
  const [currentDistance, setCurrentDistance] = useState(0);

  // bestDistance: REKORD - najlepszy znaleziony dystans (do logiki algorytmu i wykresu)
  const [bestDistance, setBestDistance] = useState(0);

  const [isRunning, setIsRunning] = useState(false);
  const [iterations, setIterations] = useState(0);
  const [history, setHistory] = useState([]);

  const intervalRef = useRef(null);

  // W refie trzymamy bestDistance, żeby algorytm wiedział, co jest aktualnym rekordem
  const stateRef = useRef({ points, bestDistance });

  useEffect(() => {
    stateRef.current = { points, bestDistance };
  }, [points, bestDistance]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target.result;
      const lines = content.split("\n");
      const newPoints = [];

      lines.forEach((line) => {
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 3) {
          const id = parseInt(parts[0]);
          const x = parseFloat(parts[1]);
          const y = parseFloat(parts[2]);
          if (!isNaN(id) && !isNaN(x) && !isNaN(y))
            newPoints.push({ id, x, y });
        }
      });

      if (newPoints.length > 0) {
        setPoints(newPoints);

        // Inicjalizacja
        const initialPath = shuffleArray(newPoints.map((p) => p.id));
        const initialDist = calculateTotalDistance(newPoints, initialPath);

        setPath(initialPath);
        setCurrentDistance(initialDist); // Ustawiamy widoczny dystans
        setBestDistance(initialDist); // Ustawiamy rekord

        setIterations(0);
        setHistory([{ iteration: 0, distance: initialDist }]);
      }
    };
    reader.readAsText(file);
  };

  const toggleSimulation = () => {
    if (isRunning) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsRunning(false);
    } else {
      if (points.length === 0) return alert("Najpierw wczytaj dane!");

      setIsRunning(true);

      intervalRef.current = setInterval(() => {
        // Pobieramy aktualny REKORD (bestDistance) z refa
        const { points: currentPoints, bestDistance: currentRecord } =
          stateRef.current;

        // 1. Losuj nową trasę
        const candidatePath = shuffleArray(currentPoints.map((p) => p.id));
        const candidateDist = calculateTotalDistance(
          currentPoints,
          candidatePath,
        );

        // --- ZMIANA: ZAWSZE aktualizuj widok mapy i tekstu ---
        setPath(candidatePath);
        setCurrentDistance(candidateDist);

        setIterations((prevIter) => {
          const nextIter = prevIter + 1;
          let newRecord = currentRecord;

          // 2. Sprawdź, czy pobiliśmy rekord (logika biznesowa)
          if (candidateDist < currentRecord) {
            setBestDistance(candidateDist); // Zapisz nowy rekord
            newRecord = candidateDist;
            // console.log(`Nowy rekord: ${newRecord}`);
          }

          // 3. Wykres: Zazwyczaj na wykresie chcemy widzieć postęp optymalizacji (czyli rekordy),
          // a nie szum losowych prób. Dlatego do historii dodajemy 'newRecord'.
          setHistory((prevHist) => [
            ...prevHist,
            { iteration: nextIter, distance: newRecord },
          ]);

          return nextIter;
        });
      }, 5000); // Co 5 sekund
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="App">
      <header>
        <h1>TSP Optymalizator</h1>
        <div className="file-input-wrapper">
          <input type="file" onChange={handleFileUpload} />
        </div>
      </header>

      <main className="layout-grid">
        <div className="left-panel">
          {/* Mapa pokazuje zawsze AKTUALNĄ iterację */}
          <MapComponent points={points} path={path} />
        </div>

        <div className="right-panel">
          <ControlPanel
            isRunning={isRunning}
            iterations={iterations}
            onToggle={toggleSimulation}
            disabled={points.length === 0}
          />

          {/* Wyświetlacz pokazuje dystans AKTUALNEJ iteracji (zgodny z mapą) */}
          <SolutionDisplay path={path} distance={currentDistance} />

          {/* Wykres pokazuje historię REKORDÓW (zgodnie z logiką optymalizacji) */}
          <ProgressChart history={history} />
        </div>
      </main>
    </div>
  );
}

export default App;
