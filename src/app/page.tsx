"use client";

import { useEffect, useState, useRef } from "react";

// apparently this abomination of a gibberish removes the spinners...
const remove_arrow_spinners = "[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]";

// premium stylizing by GEMINI
const premium_style = "box-border max-w-full min-w-0 w-full bg-[#2a2a2a] text-white p-2.5 px-4 rounded-lg border border-neutral-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all";
const premium_div = "box-border p-5 max-w-xl w-11/12 md:w-full border text-center flex flex-col items-center justify-center shadow-2xl transition-all duration-500 rounded-2xl backdrop-blur-md scale-100 animate-[fadeIn_0.2s_ease-out]";
const premium_div_2 = "p-5 md:p-8 bg-[#121212] rounded-2xl border border-neutral-800 shadow-2xl max-w-xl w-11/12 md:w-full flex flex-col items-center";
const premium_dropdown = "overflow-y-auto max-h-60 list-none text-left bg-[#2a2a2a] p-3 text-white border border-emerald-500 rounded-lg";
const premium_dropdown_option = "transition-all hover:bg-emerald-500 cursor-pointer pt-2 pb-2 rounded-sm w-full";

/* i dont wanna remove the first premium_div because sometimes one of them works very well
 and the other doesnt and sometimes the opposite */
const premium_button = "p-3 w-full md:w-auto md:px-12 rounded-lg font-bold transition-all";

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
  const [suggestion, setSuggestion] = useState("");

  const [submitError, setSubmitError] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [sending, setSending] = useState(false);

  // ----------- MAKING A FAKE DROP DOWN MENUs --------------
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [nisabOpen, setNisabOpen] = useState(false);

  // 1. create a gps tracker (?????)
  // useref basically is used to associate javascript variable with an html element
  // "Hey, this tracker is specifically designed to be attached to a <div>, 
  // and right now, before the screen loads, it is attached to null (nothing)."
  const dropdownRef = useRef<HTMLDivElement>(null);
  const NisabDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
      if (NisabDropdownRef.current && !NisabDropdownRef.current.contains(event.target as Node)) {
        setNisabOpen(false);
      }
    };

    // this tells the browser to "start listening!"
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // this tells the browser to "stop listening!"
      document.removeEventListener("mousedown", handleClickOutside);
    };

  }, []);

  const nisabValues = [
    { value: "85.00", nisabStr: "85.00g of pure gold" },
    { value: "87.48", nisabStr: "87.48g of pure gold" }
  ];

  const filteredCountries = countries.filter((country: any) => {
    if (!country.currencies || country.name === "Western Sahara") return false;

    const searchLower = searchTerm.toLowerCase();
    const nameLower = country.name.toLowerCase();
    const codeLower = country.currencies[0].code.toLowerCase();

    return nameLower.includes(searchLower) || codeLower.includes(searchLower);
  });

  /* --------------- HANDLE OPINION SUBMISSION --------------- */
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

  /* ---------- HANDLE ZAKAT CALCULATION ------------- */
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
      
      <label className="text-[#888888] text-s md:w-2/5 mb-5">
        experienced devs, don't bully me or this wbesite please, im still learning lol
      </label>
      { practice_mode && (
        <label className="text-[#888888] text-s md:w-2/5 mb-5">
          test
        </label>
      )}

      {/* ------------ ZAKAT CALCULATOR --------------- */}
      <>
      <div className="mb-5 p-5 md:p-8 bg-[#121212] rounded-2xl border border-neutral-800 shadow-2xl max-w-xl w-11/12 md:w-full flex flex-col items-center">
        
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
              What is your local currency?
            </label>
            <div ref={dropdownRef} className="relative w-full md:w-1/2 md:text-left md:mb-0">
              <input
                className={`${premium_style}`}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsOpen(true);
                }}
                onFocus={() => setIsOpen(true)}
                placeholder="type your country or your currency..."
              />

              {isOpen && filteredCountries.length > 0 && (
                <ul className={`w-full box-border absolute z-50 ${premium_dropdown}`}>
                  {filteredCountries.map((country: any) => {
                    const countryString = `${country.name} - ${country.currencies[0].code}`;

                    return (
                      <li 
                        key={countryString}
                        className={`${premium_dropdown_option}`}
                        onClick={() => {
                          setSearchTerm(countryString);
                          setCountry(countryString);
                          setIsOpen(false);
                        }}
                      >
                        {countryString}
                      </li>
                    );
                  })}
                </ul>
              )}
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
            <div 
                className="relative w-full md:w-1/2 md:text-left"
                ref={NisabDropdownRef}
              >
                <button
                  className={`${premium_style} text-left`}
                  onClick={() => {
                    setNisabOpen(!nisabOpen);
                  }}
                >
                  { nisab === "85.00" ?
                    "85.00g of pure gold (Maliki, Shafi'i, Hanbali)"
                  : "87.48g of pure gold (Hanafi)" }
                </button>

                { nisabOpen && (
                  <ul
                    className={`box-border w-full absolute z-50 ${premium_dropdown}`}
                  >
                    {
                      nisabValues.map((nisabValue: any) => {
                        return (
                          <li
                            key={nisabValue.nisabStr}
                            className={`${premium_dropdown_option}`}
                            onClick={() => {
                              setNisabOpen(false);
                              setNisab(nisabValue.value);
                            }}
                          >
                            {nisabValue.nisabStr}
                          </li>
                        )
                      })
                    }
                  </ul>
                ) }

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
        className={`${premium_div_2} mb-5`}
        style={{
          backgroundColor: `${results.colorCode}a0`, 
          borderColor: `${results.colorCode}bb`
        }}
        >
          <h2 className="font-bold mb-2">Your Zakat Result</h2>
          { results.eligible ? (
            <div className="text-sm md:text-base">
              <label>Your amount of money exceeds the current gold nisab of {results.nisabThreshold} {results.currency} as of today</label>
              <br/><br/>
              <label className="font-bold text-lg">Your zakat due is: {results.zakat} {results.currency}</label>
            </div>
          ) : (
            <div className="text-sm md:text-base">
              <label>Your amount of money does NOT exceed the current gold nisab of {results.nisabThreshold} {results.currency} as of today</label>
              <br/><br/>
              <label className="font-bold text-lg">You are exempt from paying Zakat at the moment</label>
            </div>
          ) }
        </div>
      ) }

      {/* ------------- USER'S HONEST OPINION ---------------- */}
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
      
      {/* ============== PRACTICE MODE ================= */}
      { practice_mode && (
        <>
          <div className={`${premium_div_2}`}>
            
            {/* GEMINI'S WAY */}
            <div className="text-[#343434] mb-5">gemini's way</div>
            <div className="flex flex-col gap-3 w-full">
              {/* row 1 */}
              <div className="flex flex-col items-center md:flex-row w-full">
                <div className="md:w-1/2 md:pr-4 md:text-right mb-3 md:mb-0">
                  <label>
                    what is your local currency?
                  </label>
                </div>
                <div className="w-full md:w-1/2 md:text-left">
                  <input
                    className={`${premium_style}`}
                    placeholder="type your country or your currency..."
                  />  
                </div>
              </div>

              {/* row 2 */}
              <div className="flex flex-col items-center md:flex-row w-full">
                <div className="md:w-1/2 md:pr-4 md:text-right mb-3 md:mb-0">
                  <label>
                    total money?
                  </label>
                </div>
                <div className="w-full md:w-1/2 md:text-left">
                  <input
                    className={`${premium_style}`}
                    placeholder="total..."
                  />
                </div>
              </div>
            </div>

            {/* MY WAY */}
            <div className="text-[#343434] mb-5 mt-5 md:max-w-3/5">my way (manually adding mb-3 on each div (except for the last one))</div>
            {/* row 1 */}
            <div className="mb-3 flex flex-col items-center md:flex-row w-full">
              <div className="md:w-1/2 md:pr-4 md:text-right mb-3 md:mb-0">
                <label>
                  what is your local currency?
                </label>
              </div>
                <div className="w-full md:w-1/2 md:text-left">
                  <input
                    className={`${premium_style}`}
                    placeholder="type your country or your currency..."
                  />  
                </div>
            </div>
            {/* row 2 */}
            <div className="mb-3 flex flex-col items-center md:flex-row w-full">
              <div className="md:w-1/2 md:pr-4 md:text-right mb-3 md:mb-0">
                <label>
                  your total money?
                </label>
              </div>
              <div className="w-full md:w-1/2 md:text-left">
                <input
                  className={`${premium_style}`}
                  placeholder="total..."
                />
              </div>
            </div>
            {/* row 3 */}
            <div className="flex flex-col items-center md:flex-row w-full">
              <div className="md:w-1/2 md:pr-4 md:text-right mb-3 md:mb-0">
                <label>
                  Nisab?
                </label>
              </div>
              <div className="w-full md:w-1/2 md:text-left">
                <input
                  className={`${premium_style}`}
                  placeholder="nisab..."
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}