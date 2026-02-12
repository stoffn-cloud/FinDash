import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const markets = await prisma.markets.findMany({
      include: {
        // Hiermee kunnen we zien hoeveel assets gekoppeld zijn aan deze markt
        _count: {
          select: { assets: true }
        }
      },
      orderBy: {
        full_name: 'asc',
      }
    });

    return NextResponse.json(markets);
  } catch (error: any) {
    console.error("Fout bij ophalen markt entiteiten:", error);
    return NextResponse.json(
      { error: "Kon de marktgegevens niet ophalen" },
      { status: 500 }
    );
  }
}