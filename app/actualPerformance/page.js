"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Box, Typography, CircularProgress, Switch, FormControlLabel } from "@mui/material";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function ActualPerformanceContent() {
  const searchParams = useSearchParams();
  const predictedPerformance = searchParams.get("predicted");
  const actualPerformance = searchParams.get("actual");

  const [showAllResults, setShowAllResults] = useState(false);

  // Ensure values are valid numbers
  const predictedValue = predictedPerformance ? parseFloat(predictedPerformance) : 0;
  const actualValue = actualPerformance ? parseFloat(actualPerformance) : 0;

  // Chart data
  const chartData = {
    labels: ["Performance"],
    datasets: [
      {
        label: "Your Guess",
        data: [predictedValue],
        backgroundColor: "orange",
      },
      {
        label: "Actual Model Performance",
        data: [actualValue],
        backgroundColor: "#29D1C4",
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, position: "top" },
      tooltip: { enabled: true },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: "Performance (%)",
        },
      },
    },
  };

  return (
    <Box sx={{ p: 4, textAlign: "center", mt: 12 }}>
      <Typography variant="h4" gutterBottom>
        Performance Comparison
      </Typography>

      {/* User's Prediction Box */}
      <Box
        sx={{
          display: "inline-block",
          padding: "20px",
          background: "#FFD699",
          borderRadius: "10px",
          fontSize: "24px",
          minWidth: "250px",
          marginBottom: "50px",
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
          display: "inline-block",
          padding: "20px",
          background: "#29D1C4",
          borderRadius: "10px",
          fontSize: "24px",
          minWidth: "250px",
          marginBottom: "30px",
        }}
      >
        <Typography variant="h6" sx={{ mb: 1 }}>
          Actual Model Performance
        </Typography>
        <Typography variant="h5" sx={{ color: "black" }}>
          {actualPerformance ? `${actualPerformance}%` : "N/A"}
        </Typography>
      </Box>

      {/* Graph Visualization */}
      <Box sx={{ mt: 4, width: "80%", maxWidth: "600px", mx: "auto" }}>
        <Typography variant="h6" gutterBottom>
          Performance Graph
        </Typography>
        <Bar data={chartData} options={chartOptions} />
      </Box>

      {/* Toggle Switch - Now Smaller */}
      <Box sx={{ mt: 4 }}>
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
          sx={{ mt: 2 }}
        />
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

export default function ActualPerformance() {
  return (
    <Suspense fallback={<Box sx={{ textAlign: "center", mt: 12 }}><CircularProgress /></Box>}>
      <ActualPerformanceContent />
    </Suspense>
  );
}
