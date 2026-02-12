import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 1. GET: Haalt holdings op met alle relaties (de "Prisma JOIN")
export async function GET() {
  try {
    const holdings = await prisma.assets.findMany({
      include: {
        markets: {
          select: { markets_abbreviation: true }
        },
        countries: {
          select: { full_name: true }
        },
        asset_industries: {
          include: {
            asset_sectors: {
              select: { GICS_name: true }
            }
          }
        }
      },
      orderBy: {
        ticker: 'asc'
      }
    });

    // We mappen de data even om exact dezelfde platte structuur te krijgen als je SQL query
    const flattenedHoldings = holdings.map(asset => ({
      ticker: asset.ticker,
      full_name: asset.full_name,
      ISIN: asset.ISIN,
      market: asset.markets?.markets_abbreviation,
      country: asset.countries?.full_name,
      sector: asset.asset_industries?.asset_sectors?.GICS_name
    }));

    return NextResponse.json(flattenedHoldings);
  } catch (error: any) {
    console.error('Database error in GET holdings:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 2. POST: Voegt een nieuw aandeel toe aan de 'assets' tabel
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Prisma voert automatisch type-checks uit op deze velden
    const newAsset = await prisma.assets.create({
      data: {
        ticker: body.ticker,
        full_name: body.full_name,
        ISIN: body.ISIN,
        markets_id: Number(body.markets_id),
        asset_classes_id: Number(body.asset_classes_id),
        currencies_id: Number(body.currencies_id),
        asset_industries_id: Number(body.asset_industries_id),
        countries_id: Number(body.countries_id),
      }
    });

    return NextResponse.json({ 
      message: "Asset succesvol toegevoegd!", 
      id: newAsset.ticker_id 
    }, { status: 201 });
  } catch (error: any) {
    console.error('Database error in POST assets:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}