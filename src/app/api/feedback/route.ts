import { NextResponse, NextRequest } from "next/server";
import { adminDb } from "../../../../firebaseAdmin";
import { z } from "zod";
import { checkRateLimit } from "@vercel/firewall";

const feedbackSchema = z.object({
  // optional inputs
  name: z.string().trim().max(100, "Name too long").optional(),
  suggestion: z.string().trim().max(2000, "Suggestion too long").optional(),

  // required inputs
  opinion: z.string().trim().min(1, "Opinion required").max(2000, "Opinion too long"),
  token: z.string().min(1, "security token required")
});

export async function POST(request: NextRequest) {

  // its important that the rate limit code should be at the TOP
  const { rateLimited } = await checkRateLimit('feedback-limit', { request });

  if (rateLimited) {
    return NextResponse.json(
      { message : "Too many requests, slow down and try again later"},
      { status: 429 }
    );
  }

  // 1. declare the body
  let body;

  // 2. get inputs and handle errors
  try {
    body = await request.json();
  } catch (err) {
    console.log("======== something happened, line 23")
    return NextResponse.json(
      { message: "invalid json payload" },
      { status: 400 }
    );
  }
  
  // 3. validate
  const validation = feedbackSchema.safeParse(body);

  if (!validation.success) {
    console.log("======== something happened, line 34")
    return NextResponse.json(
      { message: "invalid input data", errors: validation.error.format() },
      { status: 400 }
    );
  }
  
  const { name, suggestion, opinion, token } = validation.data;
  
  // 4. verify token first
  // 4.1 ask cloudflare
  const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: {"Content-type": "application/x-www-form-urlencoded"},
    body: `secret=${process.env.TURNSTILE_SECRET_KEY}&response=${token}`
  })
  
  const verifyData = await verifyRes.json();
  
  if (!verifyData.success) {
    console.log("======== something happened, line 54")
    return NextResponse.json(
      { message: "You a bot or sumn?"},
      { status: 403 }
    );
  }
  
  const current_time_ms = Date.now().toString();
  const feedbackRef = adminDb.collection("feedback").doc(current_time_ms);
  
  await feedbackRef.set({
    createdAt: current_time_ms,
    submittedAt: new Date().toLocaleString(),
    user_name: !name ? "Anonymous" : name,
    user_opinion: opinion,
    user_suggestion: !suggestion ? "No suggestions" : suggestion,
  });
  
  console.log("============ should work by here by now, line 72")
  return NextResponse.json(
    { message: "Thank you for your feedback :D" },
    { status: 200 }
  );
}