import express from 'express';
import cors from 'cors';
import yahooFinance from 'yahoo-finance2';

const app = express();
const port = 5000;

// 1. CORS Configuratie
// Zorg dat deze exact overeenkomt met je frontend poort
const corsOptions = {
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// 2. Route voor prijzen
app.get('/api/prices', async (req, res) => {
  try {
    const { symbols } = req.query;
    if (!symbols) return res.json({});

    const symbolArray = String(symbols).split(',').map(s => s.trim()).filter(Boolean);
    if (symbolArray.length === 0) return res.json({});

    const results = {};
    const quotes = await Promise.all(
      symbolArray.map(symbol => 
        yahooFinance.quote(symbol).catch(() => null)
      )
    );

    quotes.forEach(quote => {
      if (quote && quote.symbol) {
        results[quote.symbol] = quote.regularMarketPrice;
      }
    });

    res.json(results);
  } catch (error) {
    console.error("Price fetch error:", error);
    res.status(500).json({ error: "Failed to fetch prices" });
  }
});

// 3. Route voor zoeken
app.get('/api/search', async (req, res) => {
  try {
    const query = req.query.q;
    if (!query || query.length < 2) return res.json([]);

    const result = await yahooFinance.search(String(query));
    const suggestions = result.quotes
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

// 4. Server Start
app.listen(port, () => {
  console.log(`🚀 QUANT BACKEND ACTIEF OP POORT ${port}`);
});