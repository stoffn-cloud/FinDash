import { prisma } from "@/lib/prisma";

export const OHLCVService = {
  async getClosingPriceAtDate(tickerSymbol: string, date: Date) {
    const record = await prisma.oHLCV_history.findFirst({
      where: {
        assets: {
          ticker: tickerSymbol, // Zoek op de naam (bijv. "AAPL")
        },
        date_id: {
          lte: date, // Zoek op jouw date_id veld
        },
      },
      orderBy: {
        date_id: 'desc', // Pak de meest recente tot die datum
      },
      select: {
        close_price: true, // Jouw veldnaam uit het schema
      },
    });

    // Prisma Decimal omzetten naar nummer
    return record?.close_price ? Number(record.close_price) : 0;
  }
};