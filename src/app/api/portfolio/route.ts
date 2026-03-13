import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const TARGET_DATE = "2025-12-31";

    // 1. Haal alle Assets op (niet alleen de defaults, want de gebruiker kan alles toevoegen)
    const assets = await prisma.assets.findMany({
      include: {
        asset_industries: true,
        countries: true,
        // Voeg hier de rest van je relaties toe (classes, sectors, etc.)
      },
    });

    // 2. Haal de prijzen op voor de specifieke datum
    const prices = await prisma.oHLCV_history.findMany({
      where: {
        date_id: {
          gte: new Date(`${TARGET_DATE}T00:00:00Z`),
          lte: new Date(`${TARGET_DATE}T23:59:59Z`),
        },
      },
      select: {
        ticker_id: true,
        date_id: true,
        close_price: true,
      }
    });

    // 3. Haal de ECHTE holdings van de gebruiker op uit de nieuwe tabel
    // Als deze tabel leeg is, stuurt hij [], wat in de store de Demo triggert.
    const userHoldings = await prisma.userHolding.findMany();

    // 4. Stuur de RUWE data naar de frontend
    return NextResponse.json({
      assets,
      prices,
      userHoldings, // De 'User Override'
      // Stuur ook de overige tabellen mee die je engineOrchestrator verwacht:
      classes: await prisma.asset_classes.findMany(),
      sectors: await prisma.asset_sectors.findMany(),
      industries: await prisma.asset_industries.findMany(),
      currencies: await prisma.currencies.findMany(),
      regions: await prisma.regions.findMany(),
      countries: await prisma.countries.findMany(),
      markets: await prisma.markets.findMany(),
    });
    
  } catch (error: any) {
    console.error("🔴 API Route Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}