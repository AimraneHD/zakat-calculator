"use client";

import Link from "next/link";
import Image from "next/image";
import arrow_kinda from "./../arrow_kinda.png";

// apparently this abomination of a gibberish removes the spinners...
const remove_arrow_spinners = "[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]";

const practice_mode = true;

// premium stylizing by GEMINI
const premium_style = "box-border max-w-full min-w-0 w-full bg-[#2a2a2a] text-white p-2.5 px-4 rounded-lg border border-neutral-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all";
const premium_div = `box-border p-5 max-w-xl w-11/12 md:w-full border text-center flex flex-col items-center justify-center shadow-2xl transition-all duration-500 rounded-2xl backdrop-blur-md scale-100 animate-[fadeIn_0.2s_ease-out]`;
const premium_div_2 = `p-5 mb-5 md:p-8 bg-[#121212] rounded-2xl border border-neutral-800 shadow-2xl max-w-xl w-11/12 flex flex-col items-center`;

/* i dont wanna remove the first premium_div because sometimes one of them works very well
 and the other doesnt and sometimes the opposite */
const premium_button = "p-3 w-full md:w-auto md:px-12 rounded-lg font-bold transition-all";

const lorem_ipsum = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum";


export default function AboutPage() {
  return (
    <main className="p-5 pt-30 flex flex-col items-center text-center">
      <label className="text-white/60 mb-5 text-sm">
        work in progress...
      </label>
      <div className={`${premium_div_2}`}>
        <h1 className="text-2xl text-emerald-500 text-shadow-lg text-shadow-white/20">
          About Zakat calculations...
        </h1>
      </div>
      <div className={`${premium_div_2}`}>
        <p>
          you can see more information <Link target="_blank" rel="noopener noreferrer" className="text-emerald-500 text-shadow-md text-shadow-emerald-700" href="https://cdn.zakat.org/wp-content/uploads/zakat-book-1.pdf">
            here
          </Link>
        </p>
        <h1 className="text-xl text-shadow-lg text-shadow-white/10">When does zakat become obligatory?</h1>
        <p>
          Let's say for example the current gold nisab today is 12000 USD
        </p>
        <p>Zakat becomes obligatory on a person once THREE conditions are ALL satisfied. Not one of them, not two of them, but ALL of them:</p>
        <div className="flex flex-col md:flex-row md:w-full gap-3 mb-3">
          <div className="md:w-1/3 md:content-center bg-emerald-700 p-4 rounded-md border border-emerald-500">1. The person is a Muslim</div>
          <div className="md:w-1/3 md:content-center bg-emerald-700 p-4 rounded-md border border-emerald-500">2. The person's total wealth exceeds the nisab threshold<span className="text-white/80">, in this example, has more than a total of 12000 USD</span></div>
          <div className="md:w-1/3 md:content-center bg-emerald-700 p-4 rounded-md border border-emerald-500">3. The person's total wealth sustained the nisab threshold for a whole lunar year<span className="text-white/80">, in this example, has had more than a total of 12000 USD for a whole lunar year</span></div>
        </div>
        <Image src={arrow_kinda} alt="down_arrow_kinda" className="w-full h-auto"/>

        <p>If all these conditions are true, then Zakat becomes obligatory and falls due</p>
        
        <h1 className="text-xl text-shadow-lg text-shadow-white/10">How is Zakat calculated?</h1>
        <p>Simple. You multiply 2.5% by your current total wealth. That's it :)</p>
      </div>
    </main>
  );
}