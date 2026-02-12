import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  // Optioneel: limiet ophalen uit de URL (standaard 100)
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '100');

  try {
    const performance = await prisma.performance_history.findMany({
      take: limit,
      orderBy: {
        date_id: 'desc',
      },
      include: {
        assets: {
          select: {
            ticker: true,
            full_name: true,
          },
        },
      },
    });

    return NextResponse.json(performance);
  } catch (error: any) {
    console.error("Fout bij ophalen performance data:", error);
    return NextResponse.json(
      { error: error.message || "Kon performance geschiedenis niet ophalen" },
      { status: 500 }
    );
  }
}