import { NextResponse, NextRequest } from "next/server";
import { adminDb } from "../../../../firebaseAdmin";

const CHECK_INTERVAL = 12 // hours

const countriesRes = await fetch("https://countries.dev/countries");
const countries = await countriesRes.json();
const currencies = countries
                   .filter((c: any) => c.currencies && c.name !== "Western Sahara")
                   .map((c: any) => c.currencies[0].code);

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const currency = (searchParams.get("currency") || "USD").toUpperCase();

  if (!currencies.includes(currency)) {
    return NextResponse.json(
      { message: `invalid currency` },
      { status: 400 }
    );
  }
  
  const cacheRef = adminDb.collection("cached_rates").doc(currency);

  try {
    const cacheSnap = await cacheRef.get();
  
    /* reminder to myself: cached currency rates are cached like this:
    {
      apiData: fetched directly from MetalPriceAPI
      cachedAt: Date.now()
    }
    */
  
    if (cacheSnap.exists) {
      const cacheData = cacheSnap.data();
      
      const CHECK_INTERVAL_ms = CHECK_INTERVAL * 3600 * 1000;
      const now = Date.now();
      const cacheAge = now - cacheData?.cachedAt || 0; // gemini: "What if someone manually
      // created a document in the Firebase Console named USD, but forgot to add any 
      // fields to it? cacheSnap.exists will be true. cacheSnap.data() will return an 
      // empty object: {}. cacheData.cachedAt will be undefined". cacheAge could've been NaN
  
      if (cacheAge <= CHECK_INTERVAL_ms) {
        return NextResponse.json(cacheData.apiData);
      }
      // otherwise, pass directly to the next step after this "if"
    }
  } catch (dbError) {
    console.error("something unexpected happened tryna get() the referenced document")
  }

  const apiKey = process.env.METAL_PRICE_API_KEY;
  const CURRENCIES_URL = `https://api.metalpriceapi.com/v1/latest?api_key=${apiKey}&currencies=${currency},XAU`;
  
  try {
    const response = await fetch(CURRENCIES_URL);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error("something unexpected happened... try again later")
    }

    await cacheRef.set({
      apiData: data,
      cachedAt: Date.now(),
    });
    return NextResponse.json(data);

  } catch (err) {
    console.error("error:", err)
    return NextResponse.json(
      { message: "something unexpected happened fetching metal prices" },
      { status: 500 }
    );
  }

}