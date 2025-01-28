"use client";

import React, { useState } from "react";
import { Box, Checkbox, Typography, Grid, Button } from "@mui/material";

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

  // Check if at least one Training and one Testing subset are selected
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
    <Box sx={{ p: 4, textAlign: "center", mt: 10 }}>
      <Typography variant="h4" gutterBottom sx={{ textWrap: "balance" }}>
        Select subsets of the data to be used for training and testing the model
      </Typography>

      <Grid container spacing={2} justifyContent="center" alignItems="center">
        {/* Training Tube */}
        <Grid item xs={4} sx={{ display: "flex", flexDirection: "column", alignItems: "center" }} className="training-container">
          <Typography mb={1} variant="h6" sx={{ textWrap: "balance" }}>Training</Typography>
          <Box className="tube">
            {/* Liquid Fill */}
            <Box
              className="tube-fill training-fill"
              sx={{ height: calculateFill("training") }}
            />
          </Box>
        </Grid>

        {/* Dataset Selection (Centered between Training & Testing) */}
        <Grid item xs={4} className="dataset-section">
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 10 }}>
            <Typography variant="h6" mb={1} sx={{ textWrap: "balance" }}>Data Subsets</Typography>
            {Object.keys(datasets).map((dataset, index) => (
              <Box key={dataset} className="subset-container">
                <Checkbox checked={datasets[dataset].training} onChange={() => handleChange(dataset, "training")} />
                <Box className="subset-box">{index + 1}</Box>
                <Checkbox checked={datasets[dataset].testing} onChange={() => handleChange(dataset, "testing")} />
              </Box>
            ))}
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

        {/* Testing Tube */}
        <Grid item xs={4} sx={{ display: "flex", flexDirection: "column", alignItems: "center" }} className="testing-container">
          <Typography mb={1} variant="h6" sx={{ textWrap: "balance" }}>Testing</Typography>
          <Box className="tube">
            <Box className="tube-fill testing-fill" sx={{ height: calculateFill("testing") }} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
