import clientPromise from "../../../lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("c4r"); // Ensure correct database
    const collection = db.collection("datahold1");

    // Fetch last 1000 records where -30 <= error_in_accuracy <= 30
    const results = await collection
      .find(
        { error_in_accuracy: { $gte: -30, $lte: 30 } }, // 🔹 Filter: Only errors in range [-30, 30]
        { projection: { error_in_accuracy: 1, _id: 0 } } // 🔹 Select only the error values
      )
      .sort({ timestamp: -1 }) // Sort by most recent
      .limit(1000)
      .toArray();

    // Debugging: Log results
    // console.log("Filtered Data:", results);

    // Extract error values
    const errors = results.map((doc) => doc.error_in_accuracy).filter((val) => val !== undefined);

    return NextResponse.json({ errors }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 });
  }
}
