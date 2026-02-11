import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

// --- 1. METADATA ROUTES (Voor dropdowns in je formulier) ---

// Asset Classes
app.get('/api/metadata/asset-classes', async (req, res) => {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM asset_classes ORDER BY asset_classes_id');
    res.json(rows);
  } catch (error) { res.status(500).json({ error: error.message }); }
  finally { if (connection) await connection.end(); }
});

// Sectoren & Industrieën (Gecombineerd voor gemak)
app.get('/api/metadata/industries', async (req, res) => {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const sql = `
      SELECT i.*, s.GICS_name as sector_name 
      FROM asset_industries i 
      JOIN asset_sectors s ON i.asset_sectors_id = s.asset_sectors_id
      ORDER BY s.GICS_name, i.description`;
    const [rows] = await connection.execute(sql);
    res.json(rows);
  } catch (error) { res.status(500).json({ error: error.message }); }
  finally { if (connection) await connection.end(); }
});

// Currencies
app.get('/api/metadata/currencies', async (req, res) => {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM currencies ORDER BY ISO_code');
    res.json(rows);
  } catch (error) { res.status(500).json({ error: error.message }); }
  finally { if (connection) await connection.end(); }
});

// Regions
app.get('/api/metadata/regions', async (req, res) => {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM regions ORDER BY description');
    res.json(rows);
  } catch (error) { res.status(500).json({ error: error.message }); }
  finally { if (connection) await connection.end(); }
});


// --- 2. DE "MASTER" PORTFOLIO ROUTE (De Grote Join) ---

app.get('/api/portfolio/assets', async (req, res) => {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const sql = `
      SELECT 
        a.ticker, 
        a.full_name, 
        a.ISIN as isin,
        ac.asset_class, 
        s.GICS_name as sector, 
        i.description as industry,
        m.markets_abbreviation as market,
        cur.ISO_code as currency,
        c.full_name as country,
        r.region_code as region
      FROM assets a
      JOIN asset_classes ac ON a.asset_classes_id = ac.asset_classes_id
      JOIN asset_industries i ON a.asset_industries_id = i.asset_industries_id
      JOIN asset_sectors s ON i.asset_sectors_id = s.asset_sectors_id
      JOIN markets m ON a.markets_id = m.markets_id
      JOIN currencies cur ON a.currencies_id = cur.currencies_id
      JOIN countries c ON a.countries_id = c.countries_id
      JOIN regions r ON c.regions_id = r.regions_id
      ORDER BY a.ticker ASC
    `;
    const [rows] = await connection.execute(sql);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) await connection.end();
  }
});



// Voorbeeld: Koersverloop per kwartaal-einde
app.get('/api/performance/quarterly', async (req, res) => {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const sql = `
      SELECT 
        d.quarter_abbreviation, 
        d.year, 
        h.close_price, 
        a.ticker
      FROM OHLCV_history h
      JOIN date_dim d ON h.date_id = d.date_id
      JOIN assets a ON h.ticker_id = a.ticker_id
      WHERE d.is_quarter_end = 1
      ORDER BY d.date_id ASC
    `;
    const [rows] = await connection.execute(sql);
    res.json(rows);
  } catch (error) { res.status(500).json({ error: error.message }); }
  finally { if (connection) await connection.end(); }
});

// Route: Check status van alle beurzen voor een specifieke datum (default vandaag)
app.get('/api/markets/status', async (req, res) => {
  const date = req.query.date || new Date().toISOString().split('T')[0];
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const sql = `
      SELECT 
        m.markets_abbreviation, 
        m.full_name, 
        mc.is_open, 
        mc.market_status, 
        mc.reason
      FROM markets m
      JOIN markets_calendar mc ON m.markets_id = mc.markets_id
      WHERE mc.date = ?
    `;
    const [rows] = await connection.execute(sql, [date]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) await connection.end();
  }
});


// --- 3. DATA INPUT ROUTES ---

app.post('/api/holdings', async (req, res) => {
  const { ticker, amount, buy_price, asset_class_id } = req.body;
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const sql = `INSERT INTO holdings (ticker, amount, buy_price, asset_class_id) VALUES (?, ?, ?, ?)`;
    const [result] = await connection.execute(sql, [ticker, amount, buy_price, asset_class_id]);
    res.status(201).json({ message: "Succes!", id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) await connection.end();
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 FinDash Backend actief op http://localhost:${PORT}`);
});