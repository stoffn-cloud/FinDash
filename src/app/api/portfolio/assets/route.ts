import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // We halen de ticker, naam en de meest recente slotkoers op
    const sql = `
      SELECT 
        a.ticker, 
        a.full_name, 
        h.date_id as last_update,
        h.close_price as current_price
      FROM assets a
      JOIN OHLCV_history h ON a.ticker_id = h.ticker_id
      WHERE h.date_id = (
        SELECT MAX(date_id) 
        FROM OHLCV_history 
        WHERE ticker_id = a.ticker_id
      )
      ORDER BY h.date_id DESC
    `;

    const [rows] = await db.execute(sql);
    
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error('Database error in portfolio assets:', error);
    return NextResponse.json(
      { error: 'Kon de portfolio data niet ophalen uit OHLCV_history', details: error.message },
      { status: 500 }
    );
  }
}