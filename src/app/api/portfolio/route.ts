import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const TARGET_DATE = "2025-12-31";

    // 1. Haal de holdings van de gebruiker op
    // We doen dit eerst, zodat we weten voor welke aandelen we prijzen moeten zoeken
    const userHoldings = await prisma.userHolding.findMany();
    
    // Maak een lijst van unieke ticker_id's die de gebruiker bezit
    const tickerIds = Array.from(new Set(userHoldings.map(h => h.ticker_id)));

    // 2. Haal de prijzen op (VOLLEDIGE HISTORIE)
    // We halen nu alle prijzen op tot en met de TARGET_DATE voor de relevante tickers
    const prices = await prisma.oHLCV_history.findMany({
      where: {
        ticker_id: {
          in: tickerIds.length > 0 ? tickerIds : undefined // Filter op bezittingen
        },
        date_id: {
          // We halen alles op tot de target date om de historie op te bouwen
          lte: new Date(`${TARGET_DATE}T23:59:59Z`),
        },
      },
      select: {
        ticker_id: true,
        date_id: true,
        close_price: true,
      },
      orderBy: {
        date_id: 'asc', // Sorteer chronologisch voor de grafiek-engine
      }
    });

    // 3. Haal alle Assets en ondersteunende tabellen op
    const assets = await prisma.assets.findMany({
      include: {
        asset_industries: true,
        countries: true,
        // Voeg hier eventueel andere relaties toe
      },
    });

    // 4. Verzamel alle data voor de frontend
    const responseData = {
      assets,
      prices,          // Bevat nu honderden datapunten ipv 10
      userHoldings,
      classes: await prisma.asset_classes.findMany(),
      sectors: await prisma.asset_sectors.findMany(),
      industries: await prisma.asset_industries.findMany(),
      currencies: await prisma.currencies.findMany(),
      regions: await prisma.regions.findMany(),
      countries: await prisma.countries.findMany(),
      markets: await prisma.markets.findMany(),
    };

    // DEBUG LOG (zichtbaar in je terminal, niet in de browser)
    console.log(`✅ API: ${prices.length} prijspunten opgehaald voor ${tickerIds.length} tickers.`);

    return NextResponse.json(responseData);
    
  } catch (error: any) {
    console.error("🔴 API Route Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}