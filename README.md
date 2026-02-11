# FinDash | Quantum Alpha Terminal

Een full-stack financieel dashboard gebouwd met **Next.js**, **TypeScript**, en **Tailwind CSS**. Dit project haalt data op van een eigen MySQL-server om portfolio-prestaties te visualiseren.

## Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Taal:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** MySQL (via `mysql2/promise`)
- **API:** Next.js Route Handlers

## Project Structuur
- `src/app`: De pagina's en API routes.
- `src/lib`: Database configuratie (`db.ts`).
- `src/services`: Business logica voor portfolio berekeningen.
- `src/components`: Herbruikbare UI elementen.

## Lokaal Starten

1. **Installatie:**
   ```bash
   npm install