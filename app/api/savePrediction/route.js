import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Load existing data
    const filePath = path.join(process.cwd(), "public", "datahold1.json");
    let existingData = [];

    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, "utf8");
      existingData = JSON.parse(fileContent);
    }

    // Append new prediction
    existingData.push(data);

    // Save to file
    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2), "utf8");

    return NextResponse.json({ message: "Prediction saved successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error saving prediction:", error);
    return NextResponse.json({ error: "Failed to save prediction" }, { status: 500 });
  }
}
