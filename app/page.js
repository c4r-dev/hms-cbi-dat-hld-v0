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
    <Box sx={{ p: 4, textAlign: "center", mt: 12 }}>
      <Typography variant="h4" gutterBottom sx={{ textWrap: "balance" }}>
        Select subsets of the data to be used for training and testing the model
      </Typography>

      <Grid container spacing={4} justifyContent="center" alignItems="center">
        {/* Training Section */}
        <Grid xs={12} md={3} className="training-container">
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Typography mb={1} variant="h6" sx={{ textWrap: "balance" }}>Training</Typography>
            <Box className="tube">
              <Box className="tube-fill training-fill" sx={{ height: calculateFill("training") }} />
            </Box>
          </Box>
        </Grid>

        {/* Dataset Selection */}
        <Grid xs={12} md={4} className="dataset-section">
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 6 }}>
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
        </Grid>

        {/* Testing Section */}
        <Grid xs={12} md={3} className="testing-container">
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Typography mb={1} variant="h6" sx={{ textWrap: "balance" }}>Testing</Typography>
            <Box className="tube">
              <Box className="tube-fill testing-fill" sx={{ height: calculateFill("testing") }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
