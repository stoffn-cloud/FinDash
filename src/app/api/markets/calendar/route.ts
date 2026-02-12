import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '100');

  try {
    const calendar = await prisma.markets_calendar.findMany({
      take: limit,
      orderBy: {
        date: 'desc',
      },
      include: {
        // JOIN met de markets tabel om de naam van de beurs te zien
        markets: {
          select: {
            full_name: true,
            markets_abbreviation: true
          }
        },
        // JOIN met date_dim voor extra info zoals month_name of is_weekend
        date_dim: {
          select: {
            day_name: true,
            month_name: true,
            is_weekend: true
          }
        }
      }
    });

    return NextResponse.json(calendar);
  } catch (error: any) {
    console.error("Fout bij ophalen markt kalender:", error);
    return NextResponse.json(
      { error: error.message || "Kon kalendergegevens niet ophalen" },
      { status: 500 }
    );
  }
}