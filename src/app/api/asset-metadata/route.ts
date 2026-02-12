import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [sectors, countries, markets] = await Promise.all([
      // In jouw schema heet de kolom 'GICS_name'
      prisma.asset_sectors.findMany({ 
        orderBy: { GICS_name: 'asc' } 
      }),
      // In jouw schema heet de kolom 'full_name'
      prisma.countries.findMany({ 
        orderBy: { full_name: 'asc' } 
      }),
      // Jouw tabel heet 'markets', niet 'exchanges'
      prisma.markets.findMany({ 
        orderBy: { full_name: 'asc' } 
      }),
    ]);

    return NextResponse.json({
      sectors,
      countries,
      markets
    });
  } catch (error) {
    console.error("Fout bij ophalen metadata:", error);
    return NextResponse.json(
      { error: "Database verbinding mislukt" }, 
      { status: 500 }
    );
  }
}