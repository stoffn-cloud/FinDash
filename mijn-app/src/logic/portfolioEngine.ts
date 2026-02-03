// src/logic/portfolioEngine.ts
import { Portfolio, AssetClass, Holding } from "../types/schemas";

/**
 * De statische rekenmotor van Quantum Alpha.
 * Deze functie voert een volledige aggregatie uit van de portfolio:
 * 1. Bereken de marktwaarde per holding (price * quantity).
 * 2. Sommeer holdings naar Asset Class niveau.
 * 3. Bereken het totale portfolio vermogen.
 * 4. Bereken alle relatieve gewichten (weights) op basis van het nieuwe totaal.
 */
export const calculatePortfolioTotals = (rawPortfolio: Portfolio): Portfolio => {
  // We maken een diepe kopie om de originele mockData (baseline) niet te vervuilen
  const updatedPortfolio: Portfolio = JSON.parse(JSON.stringify(rawPortfolio));

  let totalPortfolioValue = 0;

  // STAP 1 & 2: Bereken waarden op Holding niveau en aggregeer naar Asset Class
  updatedPortfolio.assetClasses = updatedPortfolio.assetClasses.map((ac: AssetClass) => {
    let classTotalValue = 0;

    if (ac.holdings && ac.holdings.length > 0) {
      ac.holdings = ac.holdings.map((h: Holding) => {
        // Bereken de actuele waarde van de positie
        const marketValue = h.quantity * h.price;
        classTotalValue += marketValue;

        return {
          ...h,
          value: marketValue,
        };
      });
    }

    // Update de totale waarde van de asset class zelf
    totalPortfolioValue += classTotalValue;
    
    return {
      ...ac,
      current_value: classTotalValue,
    };
  });

  // STAP 3: Zet het berekende totaal in het portfolio object
  updatedPortfolio.totalValue = totalPortfolioValue;

  // STAP 4: Bereken de relatieve gewichten (Allocatie %)
  // Nu we het totaal (totalPortfolioValue) weten, kunnen we de percentages bepalen.
  updatedPortfolio.assetClasses = updatedPortfolio.assetClasses.map((ac) => {
    // Allocatie van de klasse t.o.v. het totaal
    const classAllocation = totalPortfolioValue > 0 
      ? (ac.current_value / totalPortfolioValue) * 100 
      : 0;

    if (ac.holdings) {
      ac.holdings = ac.holdings.map((h) => ({
        ...h,
        // Gewicht van de individuele holding t.o.v. het GEHELE portfolio
        weight: totalPortfolioValue > 0 
          ? (h.value / totalPortfolioValue) * 100 
          : 0,
      }));
    }

    return {
      ...ac,
      allocation_percent: classAllocation,
    };
  });

  return updatedPortfolio;
};