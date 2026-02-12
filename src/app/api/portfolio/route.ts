import { NextResponse } from "next/server";
import { getFullPortfolioData } from "@/lib/api/portfolioService";
import { DEFAULT_HOLDINGS } from "@/data/constants/defaultHolding"; // Map waar ze thuishoren

export async function GET() {
  try {
    // We halen de data op en voeren de engine berekening uit op de server
    const data = await getFullPortfolioData(DEFAULT_HOLDINGS);
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("🔴 API Route Error:", error.message);
    return NextResponse.json(
      { error: "Failed to calculate portfolio snapshot", details: error.message },
      { status: 500 }
    );
  }
}