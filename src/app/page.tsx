"use client";

import { useEffect, useState } from "react";

// apparently this abomination of a gibberish removes the spinners...
const remove_arrow_spinners = "[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]";

// premium stylizing by GEMINI
const premium_style = "box-border max-w-full min-w-0 w-full bg-[#2a2a2a] text-white p-2.5 px-4 rounded-lg border border-neutral-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all";
const premium_div = "box-border p-5 mt-6 max-w-xl w-11/12 md:w-full border text-center flex flex-col items-center justify-center shadow-2xl transition-all duration-500 rounded-2xl backdrop-blur-md scale-100 animate-[fadeIn_0.2s_ease-out]";
const premium_button = "mt-8 p-3 w-full md:w-auto md:px-12 rounded-lg font-bold transition-all";

const lorem_ipsum = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum";

const practice_mode = false;

export default function ZakatCalculator() {
  
  const [country, setCountry] = useState("");
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  const [countryError, setCountryError] = useState(false);
  const [amountError, setAmountError] = useState(false);

  const [amount, setAmount] = useState("");
  const [nisab, setNisab] = useState("85.00");

  const COUNTRIES_URL = "https://countries.dev/countries";

  const [calculating, setCalculating] = useState(false);
  const [results, setResults] = useState<any>(null);

  const [opinion, setOpinion] = useState("");
  const [username, setUsername] = useState("");
  const [submitError, setSubmitError] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);

  const sendOpinion = async (e: React.FormEvent) => {
    e.preventDefault();

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
          opinion: opinion
        })
      });

      if (!res.ok) {
        throw new Error(`Server threw an eror or soemthing idk ${res.status}`);
      }

      setFeedbackSent(true);

    } catch (err) {
      console.log(`sum happened, idk: ${err}`);
      setSubmitError(true);
    }
  }

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault(); // this prevented the website reloading before even finishing
                        // calculating zakat, i dont even remember-
                        // -what would happen,
                        // i should've commented what this does

    setCountryError(false);
    setAmountError(false);

    if (amount === "" || !country.includes(" - ")) {
      if (amount === "") { setAmountError(true); }
      if (!country.includes(" - ")) { setCountryError(true); }
      return;
    }

    setCalculating(true);
    setCountryError(false);
    setAmountError(false);

    try {
      // get the chosen currency
      const parts = country.split(" - ");
      const currencyCode = parts[1];

      // fetch metal price exchange rate
      const res = await fetch(`/api/prices/?currency=${currencyCode}`);
      
      if (!res.ok) {
        throw new Error(`Server returned a ${res.status} error!`);
      }
      
      const data = await res.json();
      
      // example:
      // 1 troy ounce of gold = 4103 usd = USDXAU
      const ounce_gold_USD = data.rates['USDXAU'];

      // 1 troy ounce = 31 grams
      // 1 gram of gold = 4103 / 31 = 132.53 usd
      const gram_gold_USD = ounce_gold_USD / 31.10348;
      
      // nisab * gram of gold = nisab_usd
      const current_nisab_USD = gram_gold_USD * parseFloat(nisab);

      // nisab_mad = nisab_usd * MAD
      const current_nisab_CUR = current_nisab_USD * data.rates[currencyCode];
      
      // eligible = amount >= nisab_mad
      // if eligible: zakat = amount * 0.025
      if (parseFloat(amount) >= current_nisab_CUR) {
        // 1. Calculate the 2.5% Zakat fee
        const zakatDue = parseFloat(amount) * 0.025;

        // 2. Save a custom object into your state
        setResults({
          eligible: true,
          zakat: zakatDue.toFixed(2), // .toFixed(2) rounds it to 2 decimal places
          nisabThreshold: current_nisab_CUR.toFixed(2),
          currency: currencyCode,
          colorCode: '#10b981'
        });
      } else {
        // Save an object showing they are exempt
        setResults({
          eligible: false,
          zakat: "0.00",
          nisabThreshold: current_nisab_CUR.toFixed(2),
          currency: currencyCode,
          colorCode: '#ef4444'
        });
      }
    } catch (err) {
      console.error("Failed to fetch market data: ", err);
      alert("Sorry, there was an error connecting to the live market data")
    } finally {
      setCalculating(false);
    }
  };

  useEffect(() => {
    fetch(COUNTRIES_URL)
    .then((response) => response.json())
    .then((data) => {
      setCountries(data);
      setLoading(false);
    })
  }, []);

  if (practice_mode) {
    const i_just_wanna_see_something = 21;
    let stringthingy = "";
    for(let i = 0; i < i_just_wanna_see_something; i++) {
      stringthingy += "-";
    }
    stringthingy += "|";
    for(let i = 0; i < i_just_wanna_see_something; i++) {
      stringthingy += "-";
    }
    stringthingy += "|";
    for(let i = 0; i < i_just_wanna_see_something; i++) {
      stringthingy += "-";
    }
  }

  return (
    <div className="p-4 min-h-screen text-center flex flex-col items-center justify-center overflow-x-hidden">
      <meta name="google-site-verification" content="hy8z4ThqyODSslQuKlkpX-d2q9H13HQJ6CZMehYGiD8" />
      
      <div className="p-5 md:p-8 bg-[#121212] rounded-2xl border border-neutral-800 shadow-2xl max-w-xl w-11/12 md:w-full flex flex-col items-center">
        
        {/* ----------- TITLE OF THE PAGE ---------- */}
        <h1 className="text-2xl md:text-3xl font-black text-emerald-400 tracking-tight mb-2">
          Zakat Calculator</h1>
        
        {loading ? (
          <p className="text-neutral-500 text-xs animate-pulse mb-4">Fetching countries...</p>
        ) : (
          <div className="h-4" />
        )}

        {/* ----------- ERROR MESSAGES ------------- */}
        {countryError && (
          <div className="box-border text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-10 text-xs font-semibold mb-4 text-left w-full">
            You forgot to fill in the country field properly!<br/>
            <span className="text-neutral-400 font-normal">
              Example: instead of writing just "Morocco" or just "MAD", select "Morocco - MAD".</span>
          </div>
        )}
        
        {amountError && (
          <div className="box-border text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-10 text-xs font-semibold mb-4 text-left w-full">
            You forgot to fill in the total amount field!
          </div>
        )}

        {/* ----------- QUESTIONS AND INPUTS -------------- */}
        <div className="w-full flex flex-col gap-6 mt-2">
          
          {/* -------------- CURRENCY INPUT ------------------- */}
          <div className="flex flex-col md:flex-row md:items-center w-full min-w-0">
            <label className="mb-2 md:mb-0 md:w-1/2 md:pr-4 text-center md:text-right font-medium">
              Which currency do you use?
            </label>
            <div className="w-full md:w-1/2 min-w-0">
              <input
                className={`${premium_style}`}
                list="countries_list"
                disabled={loading}
                placeholder={loading ? "Wait..." : "Enter your currency..."}
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
              <datalist id="countries_list">
                {countries.filter((country: any) => country.currencies && country.name !== "Western Sahara" )
                .map((country: any) => {
                  const countryString = `${country.name} - ${country.currencies[0].code}`;
                  return (
                    <option key={country.name} value={countryString}>
                      {countryString}
                    </option>
                  );
                })}
              </datalist>
            </div>
          </div>
          
          {/* ------------ AMOUNT INPUT -------------- */}
          <div className="flex flex-col md:flex-row md:items-center w-full min-w-0">
            <label className="mb-2 md:mb-0 md:w-1/2 md:pr-4 text-center md:text-right font-medium">
              Total money / wealth?
            </label>
            <div className="w-full md:w-1/2 min-w-0">
              <input
                className={`${premium_style} ${remove_arrow_spinners}`}
                type='number'
                disabled={loading}
                placeholder={loading ? "Wait..." : "Enter your TOTAL..."}
                value={amount} onChange={(e) => setAmount(e.target.value)}/>
            </div>
          </div>
          
          {/* -------------- NISAB INPUT ------------- */}
          <div className="flex flex-col md:flex-row md:items-center w-full min-w-0">
            <label className="mb-2 md:mb-0 md:w-1/2 md:pr-4 text-center md:text-right font-medium">
              What nisab weight value do you use?
            </label>
            <div className="w-full md:w-1/2 min-w-0">
              <select
                className={`${premium_style}`}
                disabled={loading}
                value={nisab}
                onChange={(e) => setNisab(e.target.value)}
              >
                <option value="87.48">87.48g of pure gold (Hanafi)</option>
                <option value="85.00">85.00g of pure gold (Maliki, Shafi'i, Hanbali)</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* --------- CALCULATE BUTTON ------------ */}
        <button 
          onClick={handleCalculate}
          disabled={calculating || loading}
          className={`mt-8 p-3 w-full md:w-auto md:px-12 rounded-lg font-bold transition-all ${
            calculating || loading
              ? "bg-neutral-600 text-neutral-300 cursor-not-allowed" 
              : "bg-emerald-600 text-white hover:bg-emerald-500 active:scale-95"
          }`}
        >
          { loading ? "Wait..." : (calculating ? "Fetching live data..." : "Calculate Zakat") }
        </button>
      </div>
      

      {/*-------- RESULTS !!! ---------*/}

      { results && (
        <div
        className="p-5 mt-6 max-w-xl w-11/12 md:w-full border text-center flex flex-col items-center justify-center shadow-2xl transition-all duration-500 rounded-2xl backdrop-blur-md scale-100 animate-[fadeIn_0.2s_ease-out]" 
        style={{
          backgroundColor: `${results.colorCode}a0`, 
          borderColor: `${results.colorCode}bb`
        }}
        >
          <h2 className="font-bold mb-2">Your Zakat Result</h2>
          { results.eligible ? (
            <div className="text-sm md:text-base">
              <label>Your amount of money exceeds the current nisab of {results.nisabThreshold} {results.currency} as of today</label>
              <br/><br/>
              <label className="font-bold text-lg">Your zakat due is: {results.zakat} {results.currency}</label>
            </div>
          ) : (
            <div className="text-sm md:text-base">
              <label>Your amount of money does NOT exceed the current nisab of {results.nisabThreshold} {results.currency} as of today</label>
              <br/><br/>
              <label className="font-bold text-lg">You are exempt from paying Zakat at the moment</label>
            </div>
          ) }
        </div>
      ) }

      {/* ------------- USER'S HONEST OPINION ---------------- */}
      {!feedbackSent ? (
        <div className={`${premium_div} bg-[#121212] border-[#232323]`}>
          <h2 className="font-medium mb-5 text-xl text-emerald-300">
            What is your honest opinion about this website?
          </h2>
          <input
            id="honest_opinion"
            type='text'
            value={opinion}
            placeholder="Your honest opinion..."
            className={`${premium_style}`}
            onChange={(e) => setOpinion(e.target.value)}
          />
          <input
            id="username"
            type='text'
            value={username}
            placeholder="Your name..."
            className={`m-3 ${premium_style}`}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label className="text-s text-[#bbbbbb]">
            if you DON'T want to share your name, just leave the field empty
          </label>
          <button
            className={`${premium_button} ${
              (opinion === "") ? "cursor-not-allowed" : "cursor-pointer"
            } ${
              (opinion === "")
                ? "bg-neutral-600 text-neutral-300 cursor-not-allowed" 
                : "bg-emerald-600 text-white hover:bg-emerald-500 active:scale-95"
            }`}
            onClick={sendOpinion}
            disabled={opinion === ""}
          >
            submit
          </button>
          {submitError && (
            <div className="box-border text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-5 m-5 text-xs font-semibold mb-4 text-left w-full">
              Error: something unexpected happened submitting this message :(<br/>
              Try again later...
            </div>
          )}
        </div>
      ) : (
        <div className={`${premium_div} bg-[#121212] border-[#232323] text-center`}>
          <h2 className="font-medium text-xl text-emerald-400">
            Thank you for your feedback! 🚀
          </h2>
          <p className="text-sm text-neutral-400 mt-2">Your review was saved directly to the database.</p>
        </div>
      )}

      { practice_mode && (
        <>
        {/* our practice bookshelf */}
        <div className="p-5 mt-6 max-w-xl md:w-full border text-center flex flex-col md:flex-row items-center justify-center rounded-2xl bg-[#121212] border-[#232323]">
          <div className="md:w-1/4">
            <h1 className="text-[#23ea83] text-center">💡 Did you know?</h1>
          </div>
          <div className="md:max-w-3/4">
            <span className="text-xl">{lorem_ipsum.slice(0, 100)}</span>
          </div>
        </div>
        </>
      )}
    </div>
  )
}