import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const assets = await prisma.assets.findMany({
      include: {
        // JOIN met landen
        countries: true,
        // JOIN met asset_classes (Equity, Fixed Income, etc.)
        asset_classes: true,
        // JOIN met de markten/beurzen
        markets: true,
        // NESTED JOIN: Asset -> Industry -> Sector
        asset_industries: {
          include: {
            asset_sectors: true
          }
        }
      },
      orderBy: {
        full_name: 'asc'
      }
    });

    return NextResponse.json(assets);
  } catch (error) {
    console.error("Fout bij ophalen assets:", error);
    return NextResponse.json(
      { error: "Kon de assets inclusief relaties niet ophalen" },
      { status: 500 }
    );
  }
}