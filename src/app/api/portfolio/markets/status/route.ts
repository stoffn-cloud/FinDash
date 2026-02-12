import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  // We pakken de datum uit de URL, of de dag van vandaag als backup
  const targetDate = searchParams.get('date') || new Date().toISOString().split('T')[0];

  try {
    const sql = `
      SELECT 
        m.markets_abbreviation, 
        m.full_name, 
        mc.is_open, 
        mc.market_status, 
        mc.reason
      FROM markets m
      INNER JOIN markets_calendar mc ON m.markets_id = mc.markets_id
      WHERE mc.date = ?
    `;
    
    const [rows] = await db.execute(sql, [targetDate]);

    // Als er geen data is voor die specifieke datum, geven we een lege lijst
    // of een vriendelijke melding terug in plaats van een 500 error.
    return NextResponse.json(rows);
    
  } catch (error: any) {
    console.error('Database error in Markets Status:', error);
    return NextResponse.json(
      { error: 'Kon marktstatus niet ophalen', details: error.message }, 
      { status: 500 }
    );
  }
}