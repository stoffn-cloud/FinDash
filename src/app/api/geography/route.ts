import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // We halen de regio's op en joinen de landen er direct aan vast
    const geography = await prisma.regions.findMany({
      include: {
        countries: {
          orderBy: {
            full_name: 'asc'
          }
        }
      },
      orderBy: {
        description: 'asc' // Sorteert op Region naam (bijv. Africa, Americas, Asia)
      }
    });

    return NextResponse.json(geography);
  } catch (error) {
    console.error("Fout bij ophalen geography data:", error);
    return NextResponse.json(
      { error: "Kon de geografische data niet ophalen" },
      { status: 500 }
    );
  }
}