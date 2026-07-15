// lets see if i remember how to do this
import { NextResponse, NextRequest } from "next/server";
import { adminDb } from "../../../../firebaseAdmin";

export async function POST(request: NextRequest) {
  const body = await request.json(); 

  const { name, opinion, suggestion } = body; 

  if (!opinion || opinion.trim() === "") {
    return NextResponse.json(
      { message: "your opinion is required to submit an opinion... -_-"},
      { status: 400 }
    );
  }

  const current_time_ms = Date.now().toString();
  const feedbackRef = adminDb.collection("feedback").doc(current_time_ms);

  await feedbackRef.set({
    createdAt: current_time_ms,
    submittedAt: new Date().toLocaleString(),
    user_name: (!name || name.trim() === "") ? "Anonymous" : name,
    user_opinion: opinion,
    user_suggestion: (!suggestion || suggestion.trim() === "") ? "No opinion" : suggestion
  });

  return NextResponse.json(
    { message: "Thank you for your feedback :)"},
    { status: 200 }
  );
}