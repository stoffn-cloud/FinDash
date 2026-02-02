import express from 'express';
import cors from 'cors';
import yahooFinance from 'yahoo-finance2';

const app = express();

// CORS voor je Vite app (poort 5173)
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET'],
  credentials: true
}));

// 1. DYNAMISCHE PRIJZEN
app.get('/api/prices', async (req, res) => {
  try {
    const querySymbols = req.query.symbols;
    const symbols = querySymbols ? querySymbols.split(',') : ['AAPL', 'MSFT', 'BTC-USD'];

    const results = await Promise.all(
      symbols.map(symbol => 
        yahooFinance.quote(symbol.trim().toUpperCase())
          .catch(e => {
            console.log(`Fout bij ophalen ${symbol}:`, e.message);
            return null;
          })
      )
    );

    const prices = {};
    results.forEach(quote => {
      if (quote && quote.symbol) {
        prices[quote.symbol] = quote.regularMarketPrice;
      }
    });

    res.json(prices);
  } catch (error) {
    console.error("General prices error:", error);
    res.status(500).json({ error: "Server kon de prijzen niet verwerken." });
  }
});

// 2. LIVE SEARCH
app.get('/api/search', async (req, res) => {
  try {
    const query = req.query.q;
    if (!query || query.length < 2) return res.json([]);

    console.log(`Zoeken naar: ${query}`);
    const searchResults = await yahooFinance.search(query);
    
    const suggestions = searchResults.quotes
      .filter(q => ['EQUITY', 'ETF', 'CRYPTOCURRENCY'].includes(q.quoteType))
      .map(q => ({
        ticker: q.symbol,
        name: q.shortname || q.longname || q.symbol,
        exchange: q.exchange,
        type: q.quoteType
      }))
      .slice(0, 8);

    res.json(suggestions);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Zoekfunctie tijdelijk niet beschikbaar." });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 QUANT BACKEND ACTIEF OP POORT ${PORT}`);
});