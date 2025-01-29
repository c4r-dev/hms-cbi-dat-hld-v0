"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect, useRef } from "react";
import { Box, Typography, CircularProgress, Switch, FormControlLabel } from "@mui/material";
import { Chart as ChartJS, CategoryScale, LinearScale, BarController, BarElement, LineController, LineElement, PointElement, Title, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarController, BarElement, LineController, LineElement, PointElement, Title, Tooltip, Legend);

function ActualPerformanceContent() {
  const searchParams = useSearchParams();
  const dataString = searchParams.get("data");
  const predictedPerformance = searchParams.get("predicted");
  const actualPerformance = searchParams.get("actual");

  const [showAllResults, setShowAllResults] = useState(false);
  const [userErrors, setUserErrors] = useState([]);
  const dataSaved = useRef(false);

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
          dataSaved.current = true;
        })
        .catch((error) => console.error("Error saving user data:", error));
    }
  }, [dataString, predictedPerformance, actualPerformance]);

  // Fetch last 1000 user errors when the toggle is turned ON
  useEffect(() => {
    if (showAllResults) {
      fetch("/api/getAllUserErrors")
        .then((res) => res.json())
        .then((data) => {
          if (data.errors) {
            setUserErrors(data.errors);
          }
        })
        .catch((error) => console.error("Error fetching user data:", error));
    }
  }, [showAllResults]);

  // Process user errors into histogram bins (3% width)
  const binWidth = 3;
  const histogramBins = new Array(27).fill(0); // Bins from -40 to 40, step 3

  userErrors.forEach((err) => {
    const binIndex = Math.floor((err + 40) / binWidth);
    if (binIndex >= 0 && binIndex < histogramBins.length) {
      histogramBins[binIndex]++;
    }
  });

  // Generate labels for bins (-40 to 40, step 3)
  const histogramLabels = Array.from({ length: histogramBins.length }, (_, i) => -40 + i * binWidth);

  // Chart Data (Both Line Chart and Bar Chart Combined)
  const chartData = {
    labels: histogramLabels,
    datasets: [
      // Bar chart for User Errors (Only shown when showAllResults is ON)
      ...(showAllResults
        ? [
            {
              type: "bar",
              label: "User Errors",
              data: histogramBins,
              backgroundColor: "#FFE5B4", // **Lighter Orange**
              barPercentage: 0.9, // Keeps bars properly sized
              categoryPercentage: 1.0,
              order: 1,
            },
          ]
        : []),
      // Line for Actual Model Performance
      {
        type: "line",
        label: "Actual Model Performance",
        data: [{ x: 0, y: 0 }, { x: 0, y: Math.max(...histogramBins, 1) }],
        borderColor: "#29D1C4",
        borderWidth: 2,
        pointRadius: 0,
        order: 0,
      },
      // Line for User's Guess
      {
        type: "line",
        label: "Your Guess",
        data: [{ x: errorValue, y: 0 }, { x: errorValue, y: Math.max(...histogramBins, 1) }],
        borderColor: "orange",
        borderWidth: 2,
        pointRadius: 0,
        order: 0,
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
        min: -40, // 🔹 Fully locks x-axis from -40 to 40
        max: 40, 
        suggestedMin: -40, // 🔹 Prevents auto-scaling
        suggestedMax: 40,
        beginAtZero: false, // 🔹 Stops stretching beyond fixed range
        ticks: { stepSize: 5 }, 
        title: { display: true, text: "Calculate the Error in Accuracy Estimation" },
      },
      y: {
        display: true,
        beginAtZero: true, // Ensures bars start from zero
      },
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

      {/* Combined Chart */}
      <Box sx={{ width: "80%", maxWidth: "700px", mx: "auto", mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Performance Error Distribution
        </Typography>
        <Line data={chartData} options={chartOptions} />
      </Box>
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
