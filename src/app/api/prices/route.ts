import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "../../../../firebaseAdmin"; // Using the VIP Admin connection!

const CHECK_INTERVAL = 12; // hours

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const apiKey = process.env.METAL_PRICE_API_KEY;
  const { searchParams } = request.nextUrl;
  const currency = searchParams.get("currency") || "USD";

  // 1. Reference the cached document using Admin SDK
  // Instead of doc(db, ...), we use adminDb.collection(...).doc(...)
  const cacheRef = adminDb.collection("cached_rates").doc(currency);

  try {
    // 2. Fetch the document using the Admin SDK
    const cacheSnap = await cacheRef.get();

    // 3. Check if the document exists in the cache
    // Note: In the Admin SDK, 'exists' is a boolean PROPERTY (cacheSnap.exists), 
    // NOT a function (cacheSnap.exists()) like in the client SDK!
    if (cacheSnap.exists) {
      const cachedData = cacheSnap.data();

      if (cachedData) {
        const now = Date.now();
        const CHECK_INTERVAL_ms = CHECK_INTERVAL * 3600 * 1000;
        const cacheAge = now - cachedData.cachedAt;
        
        if (cacheAge < CHECK_INTERVAL_ms) {
          console.log(`last ${currency} cache is less than ${CHECK_INTERVAL} hours old. serving from Firebase`);
          
          // Return the cached data instead of making a new API call
          return NextResponse.json(cachedData.apiData);
        }
      }
    }
  } catch (dbError) {
    // If Firebase reading fails for some reason, log it but don't crash 
    // — we will just proceed to fetch fresh data below.
    console.error("Database cache read failed, falling back to live fetch:", dbError);
  }

  /* If we exceeded the cache or it doesn't exist, fetch fresh data and cache it */
  try {
    const CURRENCY_URL = `https://api.metalpriceapi.com/v1/latest?api_key=${apiKey}&currencies=${currency},XAU`;
    const response = await fetch(CURRENCY_URL);
    
    if (!response.ok) {
      throw new Error(`Metal Price API returned status ${response.status}`);
    }
    
    const data = await response.json();

    // 4. Save the new data using Admin SDK
    // Bypasses all security rules so you don't get "PERMISSION_DENIED"!
    await cacheRef.set({
      apiData: data,
      cachedAt: Date.now()
    });

    return NextResponse.json(data);

  } catch (err) {
    console.error("Backend fetching error:", err);
    return NextResponse.json({ error: "Backend fetching error", status: 500 });
  }
}