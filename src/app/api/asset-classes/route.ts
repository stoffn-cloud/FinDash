import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // We halen alle asset classes op en sorteren ze alfabetisch op naam
    const assetClasses = await prisma.asset_classes.findMany({
      orderBy: {
        asset_class: 'asc',
      },
    });

    return NextResponse.json(assetClasses);
  } catch (error) {
    console.error("Fout bij ophalen asset classes:", error);
    return NextResponse.json(
      { error: "Kon asset classes niet ophalen uit de database" },
      { status: 500 }
    );
  }
}