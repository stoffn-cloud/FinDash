import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

  try {
    const sql = `
      SELECT m.markets_abbreviation, m.full_name, mc.is_open, mc.market_status, mc.reason
      FROM markets m
      JOIN markets_calendar mc ON m.markets_id = mc.markets_id
      WHERE mc.date = ?`;
    
    const [rows] = await db.execute(sql, [date]);
    return NextResponse.json(rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}