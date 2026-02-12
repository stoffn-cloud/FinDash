import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await db.execute('SELECT * FROM asset_classes');
    return NextResponse.json(rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}