import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 1. GET: Haalt de volledige database-lijst van Assets op (voor beheer/selectie)
export async function GET() {
  try {
    const assets = await prisma.assets.findMany({
      include: {
        markets: { select: { markets_abbreviation: true } },
        countries: { select: { full_name: true } },
        asset_industries: {
          include: {
            asset_sectors: { select: { GICS_name: true } }
          }
        }
      },
      orderBy: { ticker: 'asc' }
    });

    const flattenedAssets = assets.map(asset => ({
      ticker_id: asset.ticker_id, // Belangrijk: stuur de ID mee voor selectie!
      ticker: asset.ticker,
      full_name: asset.full_name,
      ISIN: asset.ISIN,
      market: asset.markets?.markets_abbreviation,
      country: asset.countries?.full_name,
      sector: asset.asset_industries?.asset_sectors?.GICS_name
    }));

    return NextResponse.json(flattenedAssets);
  } catch (error: any) {
    console.error('🔴 Database error in GET assets:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 2. POST: Voegt een nieuw aandeel toe aan de 'assets' bibliotheek
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validatie: Check of de verplichte velden er zijn
    if (!body.ticker || !body.full_name) {
      return NextResponse.json({ error: "Ticker en Naam zijn verplicht" }, { status: 400 });
    }

    const newAsset = await prisma.assets.create({
      data: {
        ticker: body.ticker,
        full_name: body.full_name,
        ISIN: body.ISIN || "",
        // Gebruik Number() en fallback naar 1 (of een andere default) om crashes te voorkomen
        markets_id: Number(body.markets_id) || 1,
        asset_classes_id: Number(body.asset_classes_id) || 1,
        currencies_id: Number(body.currencies_id) || 1,
        asset_industries_id: Number(body.asset_industries_id) || 1,
        countries_id: Number(body.countries_id) || 1,
      }
    });

    return NextResponse.json({ 
      message: "Asset succesvol toegevoegd aan de bibliotheek!", 
      id: newAsset.ticker_id 
    }, { status: 201 });
  } catch (error: any) {
    console.error('🔴 Database error in POST assets:', error);
    return NextResponse.json({ error: "Kon asset niet toevoegen. Check of alle ID's bestaan." }, { status: 500 });
  }
}