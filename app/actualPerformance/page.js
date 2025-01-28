"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Box, Typography, CircularProgress, Switch, FormControlLabel } from "@mui/material";
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend);

function ActualPerformanceContent() {
  const searchParams = useSearchParams();
  const predictedPerformance = searchParams.get("predicted");
  const actualPerformance = searchParams.get("actual");

  const [showAllResults, setShowAllResults] = useState(false);

  // Ensure values are valid numbers
  const predictedValue = predictedPerformance ? parseFloat(predictedPerformance) : 0;
  const actualValue = actualPerformance ? parseFloat(actualPerformance) : 0;

  // Calculate error in accuracy estimation
  const errorValue = predictedValue - actualValue; // Difference between guess and actual
  const actualReference = 0; // Actual Model Performance is set at 0

  // Ensure errorValue stays within -30 to 30 range to prevent Chart.js crashes
  const limitedErrorValue = Math.max(-30, Math.min(30, errorValue));

  // Create dataset for thin vertical lines at "Your Guess" and "Actual Model Performance"
  const createVerticalLineDataset = (xValue, color) => ({
    label: "",
    data: [
      { x: xValue, y: 0 },
      { x: xValue, y: 1 },
    ],
    borderColor: color,
    borderWidth: 2,
    pointRadius: 0,
  });

  // Chart data
  const chartData = {
    datasets: [
      createVerticalLineDataset(actualReference, "#29D1C4"), // Actual Performance at 0
      createVerticalLineDataset(limitedErrorValue, "orange"), // Your Guess - Actual
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false }, // Hides legend
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
      y: {
        display: false, // Hides the y-axis
      },
    },
  };

  return (
    <Box sx={{ p: 4, textAlign: "center", mt: 12 }}>
      <Typography variant="h4" gutterBottom>
        Performance Comparison
      </Typography>

      {/* User's Prediction and Actual Performance Box - With White Space */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 6, mb: 3 }}>
        {/* User's Prediction Box */}
        <Box
          sx={{
            padding: "20px",
            background: "#FFD699",
            borderRadius: "10px",
            fontSize: "24px",
            minWidth: "250px",
          }}
        >
          <Typography variant="h6" sx={{ mb: 1 }}>
            Your Guess
          </Typography>
          <Typography variant="h5" sx={{ color: "black" }}>
            {predictedPerformance ? `${predictedPerformance}%` : "N/A"}
          </Typography>
        </Box>

        {/* Actual Performance Box */}
        <Box
          sx={{
            padding: "20px",
            background: "#29D1C4",
            borderRadius: "10px",
            fontSize: "24px",
            minWidth: "250px",
          }}
        >
          <Typography variant="h6" sx={{ mb: 1 }}>
            Actual Model Performance
          </Typography>
          <Typography variant="h5" sx={{ color: "black" }}>
            {actualPerformance ? `${actualPerformance}%` : "N/A"}
          </Typography>
        </Box>
      </Box>

      {/* Toggle Switch - Moved Closer to Boxes */}
      <Box sx={{ mb: 3 }}>
        <FormControlLabel
          control={
            <Switch
              checked={showAllResults}
              onChange={() => setShowAllResults((prev) => !prev)}
              color="primary"
              sx={{ transform: "scale(1.2)", mr: 1 }} // Reduced size
            />
          }
          label={
            <Typography variant="h6">
              Show Results From All Users
            </Typography>
          }
        />
      </Box>

      {/* Horizontal Number Line */}
      <Box sx={{ width: "80%", maxWidth: "700px", mx: "auto", mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Performance Error Graph
        </Typography>
        <Line data={chartData} options={chartOptions} />
      </Box>

      {/* Placeholder for future user results */}
      {showAllResults && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">All User Results Coming Soon...</Typography>
        </Box>
      )}
    </Box>
  );
}

