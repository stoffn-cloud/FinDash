/**
 * De interface voor je handmatige invoer.
 * We gebruiken hier camelCase omdat dit prettiger typt in JS/TS constants.
 */
export interface DefaultHolding {
  ticker: string;
  quantity: number;
  purchaseDate: string;
  purchasePrice: number; // Verwijder de '?' als je wilt dat elke aankoop een prijs MOET hebben
}

/**
 * Jouw start-portfolio. 
 * Let op: De tickers moeten EXACT overeenkomen met de tickers in je database 
 * (meestal hoofdletters, bijv. 'AAPL' en niet 'aapl').
 */
export const DEFAULT_HOLDINGS: DefaultHolding[] = [
  { ticker: 'AAPL', quantity: 15, purchaseDate: '2016-01-02', purchasePrice: 26.33 },
  { ticker: 'ASML', quantity: 5, purchaseDate: '2016-01-20', purchasePrice: 82.50 },
  { ticker: 'MSFT', quantity: 18, purchaseDate: '2016-02-18', purchasePrice: 52.10 },
  { ticker: 'NVDA', quantity: 30, purchaseDate: '2016-01-12', purchasePrice: 6.25 },
];