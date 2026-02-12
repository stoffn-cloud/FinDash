import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Prisma vertaalt 'OHLCV_history' naar 'oHLCV_history' (let op de kleine 'o')
    // of soms 'ohlcv_history' afhankelijk van de interne generatie.
    // We gebruiken 'findMany' met een limit (take) en sortering (orderBy).
    
    const history = await prisma.oHLCV_history.findMany({
      take: 100, // De 'LIMIT 100' uit je SQL voorbeeld
      orderBy: {
        date_id: 'desc' // Nieuwste data eerst
      },
      include: {
        assets: {
          select: {
            ticker: true,
            full_name: true
          }
        }
      }
    });

    return NextResponse.json(history);
  } catch (error: any) {
    console.error("Fout bij ophalen OHLCV data:", error);
    return NextResponse.json(
      { error: error.message || "Kon OHLCV geschiedenis niet ophalen" }, 
      { status: 500 }
    );
  }
}