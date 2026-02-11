import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Vervang 'portfolio_data' door de echte naam van je tabel
    const [rows] = await db.query('SELECT * FROM portfolio_data ORDER BY date DESC');
    
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Kon de portfolio data niet ophalen' },
      { status: 500 }
    );
  }
}