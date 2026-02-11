import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ticker, amount, buy_price, asset_class_id } = body;

    const sql = `INSERT INTO holdings (ticker, amount, buy_price, asset_class_id) VALUES (?, ?, ?, ?)`;
    const [result]: any = await db.execute(sql, [ticker, amount, buy_price, asset_class_id]);

    return NextResponse.json({ message: "Succes!", id: result.insertId }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}