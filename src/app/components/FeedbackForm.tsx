"use client";

import { useState } from "react";

const premium_style = "box-border max-w-full min-w-0 w-full bg-[#2a2a2a] text-white p-2.5 px-4 rounded-lg border border-neutral-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all";
const premium_div_2 = "p-5 md:p-8 bg-[#121212] rounded-2xl border border-neutral-800 shadow-2xl max-w-xl w-11/12 md:w-full flex flex-col items-center";
const premium_button = "p-3 w-full md:w-auto md:px-12 rounded-lg font-bold transition-all";

export default function FeedbackForm() {
  
  const [opinion, setOpinion] = useState("");
  const [username, setUsername] = useState("");
  const [suggestion, setSuggestion] = useState("");
  
  const [submitError, setSubmitError] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [sending, setSending] = useState(false);
  
  const sendOpinion = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setSending(true);
    setSubmitError(false);
    setFeedbackSent(false);
  
    try {
      const res = await fetch('/api/feedback/', {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          name: username,
          opinion: opinion,
          suggestion: suggestion
        })
      });
  
      if (!res.ok) {
        throw new Error(`Server threw an eror or soemthing idk ${res.status}`);
      }
  
      setFeedbackSent(true);
  
    } catch (err) {
      console.log(`sum happened, idk: ${err}`);
      setSubmitError(true);
    } finally {
      setSending(false);
    }
  }
  
  return (
    <>
      {!feedbackSent ? (
        <div className="p-5 mb-5 md:p-8 bg-[#121212] rounded-2xl border border-neutral-800 shadow-2xl max-w-xl w-11/12 md:w-full flex flex-col items-center">
          <h2 className="font-medium mb-5 text-2xl text-emerald-300">
            Your honest opinion
          </h2>
          <label className="mb-5">
            What do you think I should add, remove, or change in this website?
          </label>
          {/* --------------- SUGGESTION INPUT ------------------- */}
          <input
            className={`${premium_style} mb-5`}
            placeholder="(optional) Any suggestions... ?"
            type='text'
            id="user_suggestion"
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
            />
          {/* --------------- HONEST OPINION INPUT ---------------- */}
          <label className="mb-5">
            What is your honest opinion about this website?
          </label>
          <input
            id="honest_opinion"
            type='text'
            value={opinion}
            placeholder="Your honest opinion..."
            className={`${premium_style}`}
            onChange={(e) => setOpinion(e.target.value)}
            />
          {/* --------------- USER NAME INPUT ---------------- */}
          <input
            id="username"
            type='text'
            value={username}
            placeholder="(optional) Your name..."
            className={`m-3 ${premium_style}`}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label className="text-s text-[#bbbbbb] mb-3">
            if you DON'T want to share your name, just leave the field empty
          </label>
          <button
            className={`${premium_button} ${
              (opinion === "" || sending) ? "cursor-not-allowed" : "cursor-pointer"
            } ${
              (opinion === "" || sending)
                ? "bg-neutral-600 text-neutral-300 cursor-not-allowed" 
                : "bg-emerald-600 text-white hover:bg-emerald-500 active:scale-95"
            }`}
            onClick={sendOpinion}
            disabled={opinion === "" || sending}
          >
            {sending ? "Submitting..." : "Submit"}
          </button>
          {submitError && (
            <div className="box-border text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-5 m-5 text-xs font-semibold mb-4 text-left w-full">
              Error: something unexpected happened submitting this message :(<br/>
              Try again later...
            </div>
          )}
        </div>
      ) : (
        <div className={`${premium_div_2} mb-5 bg-[#121212] border-[#232323] text-center`}>
          <h2 className="font-medium text-xl text-emerald-400">
            Thank you for your feedback! :D
          </h2>
          <p className="text-sm text-neutral-400 mt-2">Your review was saved directly to the database.</p>
        </div>
      )}
    </>
  );
}