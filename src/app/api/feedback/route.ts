import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "../../../../firebaseAdmin"; // Using the VIP Admin connection!

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // 1. Grab the feedback data sent from page.tsx
    const body = await request.json();
    const { name, opinion } = body;

    // Validation: make sure they actually typed an opinion
    if (!opinion || opinion.trim() === "") {
      return NextResponse.json(
        { error: "Opinion is required" }, 
        { status: 400 }
      );
    }

    // 2. Reference the "feedback" collection in Firestore
    // Calling .doc() with no arguments tells Firestore to auto-generate a unique ID for this feedback
    const feedbackRef = adminDb.collection("feedback").doc();

    // 3. Save the feedback securely
    // This bypasses all public write restrictions!
    await feedbackRef.set({
      userName: name ? name.trim() : "Anonymous", // Defaults to Anonymous if they left it blank
      userOpinion: opinion.trim(),
      createdAt: Date.now(), // Numeric timestamp (great for sorting later)
      submittedAt: new Date().toLocaleString() // Readable date/time string
    });

    // 4. Return success response to the client
    return NextResponse.json(
      { message: "Feedback saved successfully!" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error saving feedback:", error);
    return NextResponse.json(
      { error: "Internal Server Error" }, 
      { status: 500 }
    );
  }
}