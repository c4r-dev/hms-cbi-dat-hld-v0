"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";

function ActualPerformanceContent() {
  const searchParams = useSearchParams();
  const predictedPerformance = searchParams.get("predicted");
  const actualPerformance = searchParams.get("actual");

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
          background: "#f4f4f4",
          borderRadius: "10px",
          fontSize: "24px",
          fontWeight: "bold",
          minWidth: "250px",
          marginBottom: "20px",
        }}
      >
        <Typography variant="h6" sx={{ mb: 1 }}>
          Your Guess
        </Typography>
        <Typography variant="h5" color="primary">
          {predictedPerformance ? `${predictedPerformance}%` : "N/A"}
        </Typography>
      </Box>

      {/* Actual Performance Box */}
      <Box
        sx={{
          display: "inline-block",
          padding: "20px",
          background: "#f4f4f4",
          borderRadius: "10px",
          fontSize: "24px",
          fontWeight: "bold",
          minWidth: "250px",
          marginTop: "20px",
        }}
      >
        <Typography variant="h6" sx={{ mb: 1 }}>
          Actual Model Performance
        </Typography>
        <Typography variant="h5" color="secondary">
          {actualPerformance ? `${actualPerformance}%` : "N/A"}
        </Typography>
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
