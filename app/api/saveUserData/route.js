import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request) {
  try {
    const data = await request.json();
    const filePath = path.join(process.cwd(), "public", "datahold1.json");

    let existingData = [];
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, "utf8");
      existingData = JSON.parse(fileContent);
    }

    existingData.push(data);

    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2), "utf8");

    return NextResponse.json({ message: "User data saved successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error saving user data:", error);
    return NextResponse.json({ error: "Failed to save user data" }, { status: 500 });
  }
}
