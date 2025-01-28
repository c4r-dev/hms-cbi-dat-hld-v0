"use client";

import React, { useState } from "react";
import { Box, Checkbox, Typography, Button } from "@mui/material";
import Grid from "@mui/material/Grid2"; // Correct Grid2 import

export default function Home() {
  const [datasets, setDatasets] = useState({
    dataset1: { training: false, testing: false },
    dataset2: { training: false, testing: false },
    dataset3: { training: false, testing: false },
    dataset4: { training: false, testing: false },
  });

  const handleChange = (dataset, type) => {
    setDatasets((prev) => ({
      ...prev,
      [dataset]: {
        ...prev[dataset],
        [type]: !prev[dataset][type],
      },
    }));
  };

  const handleRunModel = () => {
    alert("Model is running!"); // Replace with actual model execution logic
  };

  const isButtonDisabled = () => {
    const hasTraining = Object.values(datasets).some((d) => d.training);
    const hasTesting = Object.values(datasets).some((d) => d.testing);
    return !(hasTraining && hasTesting);
  };

  const calculateFill = (type) => {
    const selectedCount = Object.values(datasets).filter((d) => d[type]).length;
    return `${(selectedCount / 4) * 100}%`;
  };

  return (
    <Box sx={{ p: 4, textAlign: "center", mt: 12, position: "relative" }}>
      <Typography variant="h4" gutterBottom sx={{ textWrap: "balance" }}>
        Select subsets of the data to be used for training and testing the model
      </Typography>

      <Box sx={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center", height: "auto" }}>
        {/* Training Section (Far Left) */}
        <Box className="training-container">
          <Typography mb={1} variant="h6" sx={{ textWrap: "balance" }}>Training</Typography>
          <Box className="tube">
            <Box className="tube-fill training-fill" sx={{ height: calculateFill("training") }} />
          </Box>
        </Box>

        {/* Dataset Selection (Center) */}
        <Box className="dataset-section">
          <Typography variant="h6" mb={2} sx={{ textWrap: "balance" }}>Data Subsets</Typography>
          {Object.keys(datasets).map((dataset, index) => (
            <Box key={dataset} className="subset-container">
              <Checkbox checked={datasets[dataset].training} onChange={() => handleChange(dataset, "training")} />
              <Box className="subset-box">{index + 1}</Box>
              <Checkbox checked={datasets[dataset].testing} onChange={() => handleChange(dataset, "testing")} />
            </Box>
          ))}
          
          {/* Run Model Button */}
          <Button 
            variant="contained" 
            className="run-model-button"
            onClick={handleRunModel}
            disabled={isButtonDisabled()}
          >
            Run Model
          </Button>
        </Box>

        {/* Testing Section (Far Right) */}
        <Box className="testing-container">
          <Typography mb={1} variant="h6" sx={{ textWrap: "balance" }}>Testing</Typography>
          <Box className="tube">
            <Box className="tube-fill testing-fill" sx={{ height: calculateFill("testing") }} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
