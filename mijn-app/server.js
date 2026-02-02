import express from 'express';
import cors from 'cors';
import yahooFinance from 'yahoo-finance2';

const app = express(); // <--- Deze MOET eerst komen!
const port = 5000;

// 1. CORS Configuratie
const corsOptions = {
  origin: 'http://localhost:5173', // Jouw Vite frontend
  methods: ['GET', 'POST'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// 2. Route voor prijzen (gebruikt door Dashboard overview)
app.get('/api/prices', async (req, res) => {
  try {
    const { symbols } = req.query;
    if (!symbols) return res.json({});

    const symbolArray = symbols.split(',').filter(s => s.trim() !== "");
    if (symbolArray.length === 0) return res.json({});

    const results = {};
    
    // We halen de quotes op
    const quotes = await Promise.all(
      symbolArray.map(symbol => 
        yahooFinance.quote(symbol).catch(err => ({ symbol, regularMarketPrice: 0 }))
      )
    );

    quotes.forEach(quote => {
      if (quote) {
        results[quote.symbol] = quote.regularMarketPrice;
      }
    });

    res.json(results);
  } catch (error) {
    console.error("Price fetch error:", error);
    res.status(500).json({ error: "Failed to fetch prices" });
  }
});

// 3. Route voor zoeken (gebruikt door PortfolioEditor)
app.get('/api/search', async (req, res) => {
  try {
    const query = req.query.q;
    if (!query || query.length < 2) return res.json([]);

    const result = await yahooFinance.search(query);
    const suggestions = result.quotes
      .filter(quote => quote.isYahooFinance) // Alleen echte assets
      .map(quote => ({
        ticker: quote.symbol,
        name: quote.longname || quote.shortname,
        exchange: quote.exchange
      }));

    res.json(suggestions);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Search failed" });
  }
});

app.listen(port, () => {
  console.log(`🚀 QUANT BACKEND ACTIEF OP POORT ${port}`);
});