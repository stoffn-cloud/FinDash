// src/api/prices/route.ts (of waar hij nu ook staat)
import yf from 'yahoo-finance2';

// We gebruiken de standaard Web 'Request' type, die is universeel beschikbaar
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { symbols } = body as { symbols: string[] };

    if (!symbols || !Array.isArray(symbols)) {
      return new Response(JSON.stringify({ error: "Invalid symbols" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const results = await Promise.all(
      symbols.map(async (symbol: string) => {
        try {
          // 'any' voorkomt de 'never' types van de library
          const quote: any = await yf.quote(symbol);
          
          return {
            symbol,
            price: quote?.regularMarketPrice || 0,
            lastClose: quote?.regularMarketPreviousClose || 0,
            monthAgo: quote?.regularMarketPrice ? quote.regularMarketPrice * 0.95 : 0,
            yearAgo: quote?.regularMarketPrice ? quote.regularMarketPrice * 0.85 : 0,
          };
        } catch (e) {
          return { symbol, price: 0, lastClose: 0, monthAgo: 0, yearAgo: 0 };
        }
      })
    );

    // Gebruik de standaard Response constructor in plaats van NextResponse
    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Handig voor lokale dev
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}