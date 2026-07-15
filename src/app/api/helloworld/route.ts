import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "../../../../firebaseAdmin";

export async function POST(request: NextRequest) {
    /* this unpacks whatever is packed inside inputs in the main page */
    const body = await request.json();

    /* this extracts whatever we wanna extract */
    const { name, opinion } = body; // "name" and "opinion" are declared in the main page
    
    // it took me a couple of lines to realize we're remaking the feedback route
    // this is the "bouncer", gemini says
    if (!opinion || opinion.trim() === "") {
        return NextResponse.json(
            { message: "You can't send an empty opinion, though idk how you even got here, i made sure to stop sending empty submission in the front end" },
            { status: 400 } // 400 means user error apparently
        );
    }
    
    const current_time_ms = Date.now().toString();
    const feedbackRef = adminDb.collection("feedbacks_test").doc(current_time_ms);
    
    await feedbackRef.set({
        createdAt: current_time_ms,
        submittedAt: new Date().toLocaleString(), 
        user_name: (name && name.trim() !== "") ? name : "Anonymous", 
        user_opinion: opinion
    })
    
    // if we reach here, that means the submission went successfully
    return NextResponse.json(
        { message: "Message received, thank you for your feedback" },
        { status: 200 } // 200 = yay
    );
}