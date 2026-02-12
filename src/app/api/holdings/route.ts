import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// 1. GET: Haalt holdings op met metadata (land, sector, markt) via JOINS
export async function GET() {
  try {
    const sql = `
      SELECT 
        a.ticker, 
        a.full_name, 
        a.ISIN,
        m.markets_abbreviation as market,
        c.full_name as country,
        s.GICS_name as sector
      FROM assets a
      LEFT JOIN markets m ON a.markets_id = m.markets_id
      LEFT JOIN countries c ON a.countries_id = c.countries_id
      LEFT JOIN asset_industries i ON a.asset_industries_id = i.asset_industries_id
      LEFT JOIN asset_sectors s ON i.asset_sectors_id = s.asset_sectors_id
    `;
    
    const [rows] = await db.execute(sql);
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error('Database error in GET holdings:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 2. POST: Voegt een nieuw aandeel toe aan de 'assets' tabel
export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Let op: in jouw model zijn deze IDs verplicht (NOT NULL)!
    const { 
      ticker, 
      full_name, 
      ISIN, 
      markets_id, 
      asset_classes_id, 
      currencies_id, 
      asset_industries_id, 
      countries_id 
    } = body;

    const sql = `
      INSERT INTO assets 
      (ticker, full_name, ISIN, markets_id, asset_classes_id, currencies_id, asset_industries_id, countries_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const [result]: any = await db.execute(sql, [
      ticker, full_name, ISIN, markets_id, asset_classes_id, currencies_id, asset_industries_id, countries_id
    ]);

    return NextResponse.json({ message: "Asset succesvol toegevoegd!", id: result.insertId }, { status: 201 });
  } catch (error: any) {
    console.error('Database error in POST assets:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}