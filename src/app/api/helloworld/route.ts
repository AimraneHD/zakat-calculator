// just a low bearing file where i practice api routing on...

import { NextResponse, NextRequest } from "next/server";
import { adminDb } from "../../../../firebaseAdmin";
import { z } from "zod";

const feedbackSchema = z.object({
  // optional inputs
  name: z.string().trim().max(100, "Name too long").optional(),
  suggestion: z.string().trim().max(2000, "Suggestion too long").optional(),

  // required inputs
  opinion: z.string().trim().min(1, "Opinion required").max(2000, "Opinion too long"),

  token: z.string().min(1, "security token required")
});

export async function POST(request: NextRequest) {
  let body;

  try {
    body = await request.json();
  } catch (err) {
    console.log("=========== something happened here, line 22");
    return NextResponse.json(
      { message: "invalid json payload" },
      { status: 400 }
    );
  }

  const validation = feedbackSchema.safeParse(body);

  if (!validation.success) {
    console.log("============== something happened here, line 32");
    return NextResponse.json(
      { message: "invalid input data", errors: validation.error.format() },
      { status: 403 }
    );
  }

  const { name, suggestion, opinion, token } = validation.data;

  const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: {"Content-type" : "application/x-www-form-urlencode"},
    body: `secret=${process.env.TURNSTILE_SECRET_KEY}&response=${token}`
  });

  const verifyData = await verifyRes.json();

  if (!verifyData.success) {
    return NextResponse.json(
      { message: "you a bot?" },
      { status: 403 }
    );
  }

  const current_time_ms = Date.now().toString();

  const feedbackRef = adminDb.collection("feedback").doc(current_time_ms);

  await feedbackRef.set({

  });

}