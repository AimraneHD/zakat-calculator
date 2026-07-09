import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const apiKey = process.env.METAL_PRICE_API_KEY;

  const { searchParams } = request.nextUrl;
  const currency = searchParams.get("currency") || "USD";

  try {
    const CURRENCY_URL = `https://api.metalpriceapi.com/v1/latest?api_key=${apiKey}&currencies=${currency},XAU`;

    const response = await fetch(CURRENCY_URL);
    const data = await response.json();

    return NextResponse.json(data);
  }
  catch (err) {
    console.error("Backend fetching error:", err);
    return NextResponse.json({error: "Backend fetching error", status: 500})
  }
}