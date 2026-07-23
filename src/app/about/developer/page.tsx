"use client";

// apparently this abomination of a gibberish removes the spinners...
const remove_arrow_spinners = "[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]";

const practice_mode = false;

// premium stylizing by GEMINI
const premium_style = "box-border max-w-full min-w-0 w-full bg-[#2a2a2a] text-white p-2.5 px-4 rounded-lg border border-neutral-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all";
const premium_div = `box-border p-5 max-w-xl w-11/12 md:w-full border text-center flex flex-col items-center justify-center shadow-2xl transition-all duration-500 rounded-2xl backdrop-blur-md scale-100 animate-[fadeIn_0.2s_ease-out]`;
const premium_div_2 = `p-5 md:p-8 bg-[#121212] rounded-2xl border border-neutral-800 shadow-2xl max-w-xl w-11/12 md:w-full flex flex-col items-center`;

/* i dont wanna remove the first premium_div because sometimes one of them works very well
 and the other doesnt and sometimes the opposite */
const premium_button = "p-3 w-full md:w-auto md:px-12 rounded-lg font-bold transition-all";

const lorem_ipsum = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum";

export default function AboutDev() {
  return (
    <main className="pt-30 items-center flex flex-col p-4 text-center">
      <label className="mb-5 text-white/30">idk if im gonna keep this page, but here it is for now i guess</label>
      <div className={`${premium_div_2}`}>
        <h1 className="text-2xl text-emerald-500 text-shadow-lg text-shadow-white/20">About me...</h1>
      </div>
    </main>
  );
}