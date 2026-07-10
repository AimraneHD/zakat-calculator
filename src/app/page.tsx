"use client";

import { useEffect, useState } from "react";

// apparently this abomination of a gibberish removes the spinners...
const remove_arrow_spinners = "[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]";

export default function ZakatCalculator() {
  
  const [country, setCountry] = useState("");
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  const [countryError, setCountryError] = useState(false);

  const [amount, setAmount] = useState("");
  const [nisab, setNisab] = useState("85.00");

  const COUNTRIES_URL = "https://countries.dev/countries";

  const [calculating, setCalculating] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!country.includes(" - ")) {
      setCountryError(true);
      setResults(null)
      return; // idk how to stop here
    }

    setCalculating(true);
    setCountryError(false);

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
          colorCode: '#528852'
        });
      } else {
        // Save an object showing they are exempt
        setResults({
          eligible: false,
          zakat: "0.00",
          nisabThreshold: current_nisab_CUR.toFixed(2),
          currency: currencyCode,
          colorCode: '#9a4949'
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
      
      <div className="p-4 bg-[#222222] rounded-md">
        <h1>Zakat Calculator</h1>
        {loading ? (<p>Fetching countries and live market data...</p>) : (<br/>)}
        
        {countryError && (
          <div className="text-[#9a4949] font-bold mb-4">
            Fill in the fields properly!<br/>
            Example: Don't write just "Morocco" or just "MAD", select instead "Morocco - MAD"
          </div>
        )}

        <br/>
        <div className="grid grid-cols-[auto_auto] gap-4 items-center justify-center text-right">          
          <label className="pr-4">Which country are you from? </label>
          <div className="pl-4 text-left">
            <input
              className="bg-[#333333] text-white"
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
          
          <label className="pr-4">How much money do you have at the moment TOTALLY? </label>
          <div className="pl-4 text-left">
            <input
              className={`bg-[#333333] text-white ${remove_arrow_spinners}`}
              type='number'
              disabled={loading}
              placeholder={loading ? "Wait..." : "Enter your TOTAL..."}
              value={amount} onChange={(e) => setAmount(e.target.value)}/>
          </div>
          
          <label className="pr-4">What nisab weight value do you use? </label>
          <div className="pl-4 text-left">
            <select
              className="bg-[#333333] text-white"
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
          {calculating ? "Fetching live data..." : "Calculate Zakat"}
        </button>
      
        
      </div>
      
      { results && (
        
        <div className="p-5 m-10" style={{backgroundColor: results.colorCode, borderRadius: 5, display: 'flex', flexDirection: 'column', alignItems:'center', justifyContent: 'center'}}>
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