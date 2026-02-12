import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // We halen de ruwe assets op uit jouw 'assets' tabel
    const [rows] = await db.execute('SELECT * FROM assets');
    return NextResponse.json(rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}