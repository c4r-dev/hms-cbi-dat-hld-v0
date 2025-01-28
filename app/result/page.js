"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { Box, Typography, CircularProgress, Slider, Button } from "@mui/material";

function ResultContent() {
  const searchParams = useSearchParams();
  const dataString = searchParams.get("data");

  const [testPerformance, setTestPerformance] = useState(null);
  const [predictedPerformance, setPredictedPerformance] = useState(50);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!dataString) return;

      try {
        const response = await fetch("/datahold.json");
        const jsonData = await response.json();
        const selectedData = JSON.parse(dataString);

        // Convert the selected dataset into a filter criteria
        const filterCriteria = {
          training_1: selectedData.dataset1.training ? 1 : 0,
          training_2: selectedData.dataset2.training ? 1 : 0,
          training_3: selectedData.dataset3.training ? 1 : 0,
          training_4: selectedData.dataset4.training ? 1 : 0,
          testing_1: selectedData.dataset1.testing ? 1 : 0,
          testing_2: selectedData.dataset2.testing ? 1 : 0,
          testing_3: selectedData.dataset3.testing ? 1 : 0,
          testing_4: selectedData.dataset4.testing ? 1 : 0,
        };

        // Find the first matching object in datahold.json
        const matchedObject = jsonData.find((entry) =>
          Object.keys(filterCriteria).every(
            (key) => entry[key] === filterCriteria[key]
          )
        );

        // Convert test_performance to a percentage (2 decimal places)
        if (matchedObject?.test_performance !== undefined) {
          setTestPerformance((matchedObject.test_performance * 100).toFixed(2) + "%");
        } else {
          setTestPerformance("No results found");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [dataString]);

  const handleSubmit = () => {
    setSubmitted(true);
  };

  return (
    <Box sx={{ p: 4, textAlign: "center", mt: 12 }}>
      <Typography variant="h4" gutterBottom>
        Here are the testing results
      </Typography>
      <Box
        sx={{
          display: "inline-block",
          padding: "20px",
          background: "#f4f4f4",
          borderRadius: "10px",
          fontSize: "24px",
          fontWeight: "bold",
          minWidth: "150px",
        }}
      >
        {testPerformance !== null ? testPerformance : <CircularProgress />}
      </Box>

      {/* Predict Performance Slider */}
      <Box sx={{ mt: 6, width: "80%", maxWidth: "500px", mx: "auto" }}>
        <Typography variant="h6" gutterBottom>
          Predict how well the model will perform on new data
        </Typography>
        <Slider
          value={predictedPerformance}
          onChange={(event, newValue) => setPredictedPerformance(newValue)}
          min={0}
          max={100}
          step={1}
          marks={[
            { value: 0, label: "0" },
            { value: 25, label: "25" },
            { value: 50, label: "50" },
            { value: 75, label: "75" },
            { value: 100, label: "100" },
          ]}
          sx={{ color: "#9932cc" }}
        />
        <Typography sx={{ mt: 2, fontSize: "18px" }}>
          Your Prediction: <b>{predictedPerformance}%</b>
        </Typography>
      </Box>

      {/* Submit Button */}
      <Box sx={{ mt: 4 }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#9932cc",
            color: "white",
            fontSize: "16px",
            fontWeight: "bold",
            textTransform: "none",
            padding: "10px 20px",
            "&:hover": { backgroundColor: "#800080" },
          }}
          onClick={handleSubmit}
        >
          Submit Prediction
        </Button>
      </Box>

      {/* Submission Confirmation */}
      {submitted && (
        <Typography variant="h6" sx={{ mt: 3, color: "green" }}>
          Prediction Submitted: {predictedPerformance}%
        </Typography>
      )}
    </Box>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<Box sx={{ textAlign: "center", mt: 12 }}><CircularProgress /></Box>}>
      <ResultContent />
    </Suspense>
  );
}
