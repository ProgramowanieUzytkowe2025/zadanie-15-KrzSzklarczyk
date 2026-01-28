// src/SolutionDisplay.js
import React from "react";

const SolutionDisplay = ({ path, distance }) => {
  return (
    <div className="component-box">
      {}
      <h3>Rozwiązanie</h3>

      {}
      <div className="solution-path">
        {path.length > 0 ? (
          path.join(" -> ")
        ) : (
          <span style={{ color: "#aaa" }}>
            Wczytaj dane, aby wylosować trasę początkową...
          </span>
        )}
      </div>

      
      <div className="solution-stats">
        <strong>Długość trasy: </strong>
        {distance ? distance.toFixed(2) : "0.00"}
      </div>
    </div>
  );
};

export default SolutionDisplay;
