"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

export default function ResultPage() {
  const searchParams = useSearchParams();
  const dataString = searchParams.get("data");

  const [matchedData, setMatchedData] = useState(null);

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

        setMatchedData(matchedObject || "No matching dataset found.");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [dataString]);

  return (
    <Box sx={{ p: 4, textAlign: "center", mt: 12 }}>
      <Typography variant="h4" gutterBottom>
        Selected Data Subsets
      </Typography>
      {matchedData ? (
        typeof matchedData === "string" ? (
          <Typography variant="h6" color="error">
            {matchedData}
          </Typography>
        ) : (
          <Box sx={{ textAlign: "left", maxWidth: "600px", margin: "auto" }}>
            <Typography variant="h6">Matched Dataset:</Typography>
            <pre style={{ background: "#f4f4f4", padding: "10px", borderRadius: "5px" }}>
              {JSON.stringify(matchedData, null, 2)}
            </pre>
          </Box>
        )
      ) : (
        <Typography>Loading...</Typography>
      )}
    </Box>
  );
}
