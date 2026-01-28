// src/ProgressChart.js
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
} from "recharts";

const ProgressChart = ({ history }) => {
  return (
    <div className="component-box">
      <h3>Jakość rozwiązania (Postęp)</h3>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={history}
            margin={{ top: 5, right: 20, bottom: 20, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="iteration">
              <Label value="Iteracje" offset={-5} position="insideBottom" />
            </XAxis>

             <YAxis domain={["auto", "auto"]}>
              <Label
                value="Długość trasy"
                angle={-90}
                position="insideLeft"
                style={{ textAnchor: "middle" }}
              />
            </YAxis>

            <Tooltip
              formatter={(value) => [value.toFixed(2), "Dystans"]}
              labelFormatter={(label) => `Iteracja: ${label}`}
            />

            <Line
              type="monotone"
              dataKey="distance"
              stroke="#8884d8"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProgressChart;
