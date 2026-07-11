"use client";

import { useEffect, useState } from "react";

// apparently this abomination of a gibberish removes the spinners...
const remove_arrow_spinners = "[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]";

// premium stylizing by GEMINI
const premium_style = "bg-[#2a2a2a] text-white p-2.5 px-4 rounded-lg border border-neutral-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all";

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

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();

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
  return (
    <div className="p-4 text-center flex flex-col items-center justify-center">
      <meta name="google-site-verification" content="hy8z4ThqyODSslQuKlkpX-d2q9H13HQJ6CZMehYGiD8" />
      
      <div className="p-8 bg-[#121212] rounded-2xl border border-neutral-800 shadow-2xl max-w-xl w-full">
        
        {/* Replace from your <h1> down to your second error block with this: */}
        <h1 className="text-3xl font-black text-emerald-400 tracking-tight mb-2">
          Zakat Calculator</h1>
        {loading ? (
          <p className="text-neutral-500 text-xs animate-pulse mb-4">Fetching countries...</p>
        ) : (
          <div className="h-4" />
        )}

        {countryError && (
          <div className="text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-xs font-semibold mb-4 text-left">
            You forgot to fill in the country field properly!<br/>
            <span className="text-neutral-400 font-normal">
              Example: instead of writing just "Morocco" or just "MAD", select "Morocco - MAD".</span>
          </div>
        )}
        {amountError && (
          <div className="text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-xs font-semibold mb-4 text-left">
            You forgot to fill in the total amount field!
          </div>
        )}

        <br/>
        <div className="grid grid-cols-[auto_auto] gap-4 items-center justify-center text-right">          
          <label className="pr-4">Which country are you from? </label>
          <div className="pl-4 text-left">
            <input
              className={`${premium_style}`}
              list="countries_list"
              disabled={loading}
              placeholder={loading ? "Wait..." : "Enter your country..."}
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
          
          <label className="pr-4">total money / wealth? </label>
          <div className="pl-4 text-left">
            <input
              className={`${premium_style} ${remove_arrow_spinners}`}
              type='number'
              disabled={loading}
              placeholder={loading ? "Wait..." : "Enter your TOTAL..."}
              value={amount} onChange={(e) => setAmount(e.target.value)}/>
          </div>
          
          <label className="pr-4">What nisab weight value do you use? </label>
          <div className="pl-4 text-left">
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
        
        <button 
          onClick={handleCalculate}
          disabled={calculating}
          className={`mt-6 p-3 rounded-lg font-semibold transition-all ${
            calculating 
              ? "bg-neutral-600 text-neutral-300 cursor-not-allowed" 
              : "bg-emerald-600 text-white hover:bg-emerald-500 active:scale-95"
          }`}
        >
          {calculating ? "Fetching live market data..." : "Calculate Zakat"}
        </button>
      </div>
      
      {/*-------- RESULTS !!! ---------*/}

      { results && (
        
        <div
          className="p-6 mt-6 max-w-xl w-full border text-center flex flex-col items-center justify-center shadow-2xl transition-all duration-500 rounded-2xl backdrop-blur-md scale-100 animate-[fadeIn_0.2s_ease-out]" 
          style={{
            backgroundColor: `${results.colorCode}a0`, 
            borderColor: `${results.colorCode}bb`
          }}
        >
          <h2>Your Zakat Result</h2>
          { results.eligible ? (
            <div>
              <label>Your amount of money exceeds the current nisab of {results.nisabThreshold} {results.currency} as of today</label>
              <br/>
              <label>Your zakat due is: {results.zakat} {results.currency}</label>
            </div>
          ) : (
            <div>
              <label>Your amount of money does NOT exceed the current nisab of {results.nisabThreshold} {results.currency} as of today</label>
              <br/>
              <label>You are exempt from paying Zakat at the moment</label>
            </div>
          ) }
        </div>
      ) }
    </div>
  )
}