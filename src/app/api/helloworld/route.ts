import { NextResponse, NextRequest } from "next/server";
import { adminDb } from "../../../../firebaseAdmin";

const CHECK_INTERVAL = 12; // hours

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const apiKey = process.env.METAL_PRICE_API_KEY;
  const { searchParams } = request.nextUrl;
  const currency = searchParams.get("currency") || "USD";

  const cacheRef = adminDb.collection("cached_rates_test").doc(currency);

  try {
    const cacheSnap = await cacheRef.get();
    
    if (cacheSnap.exists) {
      const cachedData = cacheSnap.data();
      
      if (cachedData && cachedData.cachedAt) {
        const now = Date.now();
        const CHECK_INTERVAL_ms = CHECK_INTERVAL * 3600 * 1000;
        const cacheAge = now - cachedData.cachedAt;

        if (cacheAge < CHECK_INTERVAL_ms) {
          return NextResponse.json(cachedData.apiData);
        }
      }
    }
  } catch (err) {
    console.log("sum happened in the first try (caching):", err)
  }

  try {
    const CURRENCY_URL = `https://api.metalpriceapi.com/v1/latest?api_key=${apiKey}&currencies=${currency},XAU`;
    const response = await fetch(CURRENCY_URL);

    if (!response.ok) {
      throw new Error("sum happened with api fetching idk");
    }

    const data = await response.json();

    await cacheRef.set({
      apiData: data,
      cachedAt: Date.now()
    });

    return NextResponse.json(data);
  
  } catch (err) {

    console.log("sum happened in the firebase, idk tho:", err);
    return NextResponse.json(
      {message: "sum happened in firebase idk"},
      {status: 500}
    );
  }
}