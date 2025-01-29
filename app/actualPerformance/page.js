"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect, useRef } from "react";
import { Box, Typography, CircularProgress, Switch, FormControlLabel } from "@mui/material";
import { Chart as ChartJS, CategoryScale, LinearScale, LineController, LineElement, PointElement, Title, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, LineController, LineElement, PointElement, Title, Tooltip, Legend);

function ActualPerformanceContent() {
  const searchParams = useSearchParams();
  const dataString = searchParams.get("data");
  const predictedPerformance = searchParams.get("predicted");
  const actualPerformance = searchParams.get("actual");

  const [showAllResults, setShowAllResults] = useState(false);
  const dataSaved = useRef(false); // Prevent multiple saves

  const predictedValue = predictedPerformance ? parseFloat(predictedPerformance) : 0;
  const actualValue = actualPerformance ? parseFloat(actualPerformance) : 0;
  const errorValue = predictedValue - actualValue;

  useEffect(() => {
    if (!dataSaved.current && dataString && predictedPerformance && actualPerformance) {
      const parsedData = JSON.parse(decodeURIComponent(dataString));
      const userData = {
        timestamp: new Date().toISOString(),
        selected_subsets: parsedData,
        your_guess: predictedValue,
        actual_performance: actualValue,
        error_in_accuracy: errorValue,
      };

      fetch("/api/saveUserData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      })
        .then((response) => response.json())
        .then(() => {
          dataSaved.current = true; // Mark as saved
        })
        .catch((error) => console.error("Error saving user data:", error));
    }
  }, [dataString, predictedPerformance, actualPerformance]);

  // Chart Data for Number Line
  const chartData = {
    datasets: [
      {
        label: "",
        data: [{ x: 0, y: 0 }, { x: 0, y: 1 }],
        borderColor: "#29D1C4",
        borderWidth: 2,
        pointRadius: 0,
      },
      {
        label: "",
        data: [{ x: errorValue, y: 0 }, { x: errorValue, y: 1 }],
        borderColor: "orange",
        borderWidth: 2,
        pointRadius: 0,
      },
    ],
  };

  // Chart Options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      x: {
        type: "linear",
        position: "bottom",
        min: -30,
        max: 30,
        ticks: { stepSize: 10 },
        title: { display: true, text: "Calculate the Error in Accuracy Estimation" },
      },
      y: { display: false },
    },
  };

  return (
    <Box sx={{ p: 4, textAlign: "center", mt: 12 }}>
      <Typography variant="h4" gutterBottom>
        Performance Comparison
      </Typography>

      {/* User's Prediction and Actual Performance Box */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 6, mb: 3 }}>
        <Box sx={{ padding: "20px", background: "#FFD699", borderRadius: "10px", fontSize: "24px", minWidth: "250px" }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Your Guess</Typography>
          <Typography variant="h5" sx={{ color: "black" }}>{predictedPerformance ? `${predictedPerformance}%` : "N/A"}</Typography>
        </Box>

        <Box sx={{ padding: "20px", background: "#29D1C4", borderRadius: "10px", fontSize: "24px", minWidth: "250px" }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Actual Model Performance</Typography>
          <Typography variant="h5" sx={{ color: "black" }}>{actualPerformance ? `${actualPerformance}%` : "N/A"}</Typography>
        </Box>
      </Box>

      {/* Toggle Switch */}
      <Box sx={{ mb: 3 }}>
        <FormControlLabel
          control={
            <Switch
              checked={showAllResults}
              onChange={() => setShowAllResults((prev) => !prev)}
              color="primary"
              sx={{ transform: "scale(1.2)", mr: 1 }}
            />
          }
          label={<Typography variant="h6">Show Results From All Users</Typography>}
        />
      </Box>

      {/* Horizontal Number Line Graph */}
      <Box sx={{ width: "80%", maxWidth: "700px", mx: "auto", mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Performance Error Graph
        </Typography>
        <Line data={chartData} options={chartOptions} />
      </Box>

      {showAllResults && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">All User Results Coming Soon...</Typography>
        </Box>
      )}
    </Box>
  );
}

export default function ActualPerformance() {
  return (
    <Suspense fallback={<Box sx={{ textAlign: "center", mt: 12 }}><CircularProgress /></Box>}>
      <ActualPerformanceContent />
    </Suspense>
  );
}
