// src/ControlPanel.js
import React from "react";

const ControlPanel = ({ isRunning, iterations, onToggle, disabled }) => {
  return (
    <div className="component-box control-panel">
      {/* Przycisk uruchamiający/zatrzymujący */}
      <button
        className={`control-btn ${isRunning ? "stop" : "start"}`}
        onClick={onToggle}
        disabled={disabled}
      >
        {isRunning ? "Przerwa" : "Szukaj rozwiązania"}
      </button>

      {/* Licznik iteracji */}
      <div className="stats">
        <strong>Liczba iteracji: </strong> {iterations}
      </div>
    </div>
  );
};

export default ControlPanel;
