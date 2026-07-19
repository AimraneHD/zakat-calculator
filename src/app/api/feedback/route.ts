// lets see if i remember how to do this
import { NextResponse, NextRequest } from "next/server";
import { adminDb } from "../../../../firebaseAdmin";

export async function POST(request: NextRequest) {
  const body = await request.json(); 

  const { name, opinion, suggestion, token } = body; 

  // check if the token exists in the first place
  if (!token) {
    return NextResponse.json(
      { message: "Security token missing. Are you a bot ? "},
      { status: 403 }
    );
  }

  // ask cloudflare if the token is legit
  const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `secret=${process.env.TURNSTILE_SECRET_KEY}&response=${token}`,
  });

  const verifyData = await verifyRes.json();

  // reject if Cloudflare says it's fake or already used
  if (!verifyData.success) {
    return NextResponse.json(
      { message: "Bot detected. Request blocked. 🛑" },
      { status: 403 }
    );
  }

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

/*
export async function GET() {
  try {
    // 1. Point directly to the feedback collection
    const feedbackRef = adminDb.collection("feedback");
    
    // 2. Query documents created at or after the spam timestamp
    const snapshot = await feedbackRef.where("createdAt", ">=", "1784495964481").get();
    
    if (snapshot.empty) {
      return NextResponse.json({ message: "No spam files found! Database is already clean." });
    }

    // 3. Create a batch process to delete them all at once
    const batch = adminDb.batch();
    let count = 0;

    snapshot.forEach((doc) => {
      batch.delete(doc.ref); // Admin SDK lets us reference doc.ref directly!
      count++;
    });

    // 4. Fire the deletion command
    await batch.commit();

    return NextResponse.json({ 
      success: true, 
      message: `Successfully nuked ${count} spam entries using Admin privileges! 🚀` 
    });

  } catch (error: any) {
    console.error("Cleanup failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}*/