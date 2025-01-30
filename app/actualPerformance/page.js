"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect, useRef } from "react";
import { Box, Typography, CircularProgress, Switch, FormControlLabel } from "@mui/material";
import { Chart as ChartJS, CategoryScale, LinearScale, BarController, BarElement, LineController, LineElement, PointElement, Title, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarController, BarElement, LineController, LineElement, PointElement, Title, Tooltip, Legend);

function ActualPerformanceContent() {
  const searchParams = useSearchParams();
  const predictedPerformance = searchParams.get("predicted");
  const actualPerformance = searchParams.get("actual");
  const dataString = searchParams.get("data");

  const [showAllResults, setShowAllResults] = useState(false);
  const [originalUserErrors, setOriginalUserErrors] = useState([]);
  const [filteredUserErrors, setFilteredUserErrors] = useState([]);
  const [allTrueFilteredErrors, setAllTrueFilteredErrors] = useState([]);
  const dataSaved = useRef(false); // Prevent duplicate saves

  const predictedValue = predictedPerformance ? parseFloat(predictedPerformance) : 0;
  const actualValue = actualPerformance ? parseFloat(actualPerformance) : 0;
  const errorValue = predictedValue - actualValue;

  // Parse datasets from query string
  let datasets = {};
  try {
    datasets = dataString ? JSON.parse(decodeURIComponent(dataString)) : {};
  } catch (error) {
    console.error("Error parsing datasets:", error);
  }

  // Save data to MongoDB on first render
  useEffect(() => {
    if (!dataSaved.current) {
      const userData = {
        predicted_performance: predictedValue,
        actual_performance: actualValue,
        error_in_accuracy: errorValue,
        timestamp: new Date().toISOString(),
        selected_subsets: datasets, // Save datasets object
      };

      fetch("/api/saveUserData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      })
        .then((res) => res.json())
        .then((data) => console.log("Data saved to MongoDB:", data))
        .catch((error) => console.error("Error saving data:", error));

      dataSaved.current = true;
    }
  }, []);

  useEffect(() => {
    fetch("/api/getAllUserErrors")
      .then((res) => res.json())
      .then((data) => {
        if (data.errors) {
          setOriginalUserErrors(data.errors);
          console.log("Original User Errors:", data.errors);

          const allTrueData = data.errors.filter((doc) => {
            const subsets = doc.selected_subsets;
            return Object.values(subsets).every((d) => d.training === true && d.testing === true);
          });

          setAllTrueFilteredErrors(allTrueData);
          console.log("All-True Filtered User Errors:", allTrueData);

          const filteredErrors = data.errors.filter((doc) => {
            const subsets = doc.selected_subsets;
            return Object.values(subsets).some((d) => d.training === false || d.testing === false);
          });

          console.log("Filtered User Errors:", filteredErrors);
          setFilteredUserErrors(filteredErrors);
        }
      })
      .catch((error) => console.error("Error fetching user data:", error));
  }, []);

  // Process user errors into histogram bins (3% width)
  const binWidth = 3;
  const histogramBins = new Array(27).fill(0);
  const allTrueHistogramBins = new Array(27).fill(0);

  filteredUserErrors.forEach((err) => {
    const binIndex = Math.floor((err.error_in_accuracy + 40) / binWidth);
    if (binIndex >= 0 && binIndex < histogramBins.length) {
      histogramBins[binIndex]++;
    }
  });

  allTrueFilteredErrors.forEach((err) => {
    const binIndex = Math.floor((err.error_in_accuracy + 40) / binWidth);
    if (binIndex >= 0 && binIndex < allTrueHistogramBins.length) {
      allTrueHistogramBins[binIndex]++;
    }
  });

  const histogramLabels = Array.from({ length: histogramBins.length }, (_, i) => -40 + i * binWidth);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { 
        display: showAllResults,  // Legend is only displayed if showAllResults is true
        position: "top",
        labels: {
          font: { size: 14 },
          color: "#333",
        },
      },
      tooltip: { enabled: true },
    },
    scales: {
      x: {
        type: "linear",
        position: "bottom",
        min: -40,
        max: 40,
        beginAtZero: false,
        ticks: { stepSize: 5 },
        title: { display: true, text: "Calculate the Error in Accuracy Estimation" },
      },
      y: {
        display: true,
        beginAtZero: true,
      },
    },
  };

  const chartData = {
    labels: histogramLabels,
    datasets: [
      ...(showAllResults
        ? [
            { type: "bar", label: "Non-overlapping Data", data: histogramBins, backgroundColor: "#FFE5B4" },
            { type: "bar", label: "Overlapping Data", data: allTrueHistogramBins, backgroundColor: "#29B6F6" },
          ]
        : []),
      { type: "line", label: "Actual Model Performance", data: [{ x: 0, y: 0 }, { x: 0, y: Math.max(...histogramBins, 1) }], borderColor: "#29D1C4" },
      { type: "line", label: "Your Guess", data: [{ x: errorValue, y: 0 }, { x: errorValue, y: Math.max(...histogramBins, 1) }], borderColor: "orange" },
    ],
  };

  return (
    <Box sx={{ p: 4, textAlign: "center", mt: 12 }}>
      <Typography variant="h4" gutterBottom>
        Performance Comparison
      </Typography>

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
  return <Suspense fallback={<Box sx={{ textAlign: "center", mt: 12 }}><CircularProgress /></Box>}><ActualPerformanceContent /></Suspense>;
}
