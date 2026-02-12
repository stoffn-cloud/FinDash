import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // We gebruiken de exacte tabelnaam uit je EER-model
    const [rows] = await db.execute('SELECT * FROM OHLCV_history ORDER BY date_id DESC LIMIT 100');
    return NextResponse.json(rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}