import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const CHECK_INTERVAL = 12 // hours; i prefer it this way

interface CachedRatesData {
  apiData: any;
  cachedAt: number;
}

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const apiKey = process.env.METAL_PRICE_API_KEY;
  const { searchParams } = request.nextUrl;
  const currency = searchParams.get("currency") || "USD";

  // 1. cacheRef first visits the database db, my firebase project, 
  // then points to the folder "cached_rates", if it doesnt exist, it creates one, 
  // then creates a document named the same string as currency, 
  // for example "cached_rates/MAD"
  const cacheRef = doc(db, "cached_rates", currency);

  // 2. we use our hand (getDoc) to physically grab the document
  const cacheSnap = await getDoc(cacheRef);

  // 3. check if the folder exists in the first place
  if (cacheSnap.exists()) {
    // i. turn received response into readable data
    const cachedData = cacheSnap.data();

    // ii. what time is it right now?
    const now = Date.now();

    // iii. CHECK_INTERVAL in ms
    const CHECK_INTERVAL_ms = CHECK_INTERVAL * 3600 * 1000;

    const cacheAge = now - cachedData.cachedAt; // im concerned here a lit bit cause the 
                                                // cachedat method wasnt highlighted in the suggestion dropdown menu
    
    if (cacheAge < CHECK_INTERVAL_ms) {
      console.log(`last ${currency} cache is less than ${CHECK_INTERVAL} hours old. serving from Firebase`);
      
      // return the cached data instead of the newly fetched data
      return NextResponse.json(cachedData.apiData); // same concern here, apiData didnt pop up or auto fill by pressing TAB
    }
  }

  /* if we exceeded the first return statement, that means the cached_rates folder
     doesnt exist. we'll fetch new fresh data, cache it, then return it */
  try {
    const CURRENCY_URL = `https://api.metalpriceapi.com/v1/latest?api_key=${apiKey}&currencies=${currency},XAU`;
    const response = await fetch(CURRENCY_URL);
    const data = await response.json();

    await setDoc(cacheRef, {
      apiData: data,
      cachedAt: Date.now() // alright, now i understand why the previous apiData 
                          // and cachedAt methods didnt pop up earlier
    });

    return NextResponse.json(data);

  } catch (err) {
    console.error("Backend fetching error:", err);
    return NextResponse.json({error: "Backend fetching error", status: 500})
  }

}