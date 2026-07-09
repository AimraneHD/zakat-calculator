"use client";

import { useEffect, useState } from "react";

export default function ZakatCalculator() {
  
  const [country, setCountry] = useState("");
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  const [amount, setAmount] = useState("");
  const [nisab, setNisab] = useState("85.00");

  const COUNTRIES_URL = "https://countries.dev/countries";

  const [calculating, setCalculating] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();

    setCalculating(true);

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
          colorCode: '#aaffaa'
        });
      } else {
        // Save an object showing they are exempt
        setResults({
          eligible: false,
          zakat: "0.00",
          nisabThreshold: current_nisab_CUR.toFixed(2),
          currency: currencyCode,
          colorCode: '#ffaaaa'
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
  
  return (
    <div className="p-4 text-center" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
      <div className=" p-4 bg-[#222222]" style={{borderRadius: 5}}>
        <h1>Zakat Calculator</h1>
        <br/>
        <ul>
          <li>
            <label className="mr-10">Which country are you from? </label>
            <input
              list="countries_list"
              placeholder="Enter your country..."
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
          </li>
          <li>
            <label className='mr-10'>How much money do you have at the moment? </label>
            <input type='number' value={amount} onChange={(e) => setAmount(e.target.value)}/>
          </li>
          <li>
            <label className="mr-10">What nisab weight value do you use? </label>
            <select value={nisab} onChange={(e) => setNisab(e.target.value)}>
              <option value="87.48">87.48g of pure gold (Hanafi)</option>
              <option value="85.00">85.00g of pure gold (Maliki, Shafi'i, Hanbali)</option>
            </select>
          </li>
        </ul>
        
        <button 
          onClick={handleCalculate}
          disabled={calculating}
          className="mt-4 p-2" 
          style={{
            borderRadius: 5,
            backgroundColor: calculating ? '#696969' : '#353535',
            color: calculating ? '#dbebe3' : '#96cca1'
          }}
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