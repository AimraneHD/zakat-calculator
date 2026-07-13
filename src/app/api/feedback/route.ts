import { NextResponse, NextRequest } from "next/server";
import { db } from "../../../../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { opinion, name } = body;

  const timestampID = Date.now().toString();
  const feedbackRef = doc(db, "feedbacks", timestampID);

  await setDoc(feedbackRef, {
    userName: name || "Anonymous",
    userOpinion: opinion,
    submittedAt: timestampID
  });

  return NextResponse.json({
    message: "Feedback received successfully!",
    status: 200
  });

}