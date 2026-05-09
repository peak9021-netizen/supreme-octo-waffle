# FormPeak — Weight Tracker

A modern, Gen Alpha-approved weight tracking app with AI-powered food journaling.

## Features

- **Onboarding** — Captures name, age, gender, height, current & goal weight, activity level
- **BMI calculator** — Live BMI with color-coded health range bar
- **Dashboard** — Weight chart (area graph with goal line), progress ring, history log
- **Stats** — Current vs goal, total lost, streak, estimated weeks to goal, weekly rate
- **Food Journal** — 24 preset foods across Breakfast/Lunch/Dinner/Snacks
- **AI Food Search** — Powered by Claude AI; learns and caches any food you search
- **Calorie budget** — Auto-calculated TDEE minus your weekly deficit goal
- **Macro tracking** — Protein/carbs/fat with visual bar

## Deploy to Vercel

### Option A — Vercel CLI
```bash
npm install -g vercel
vercel
```

### Option B — Vercel Dashboard
1. Push this folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Framework: **Vite** (auto-detected)
4. Deploy!

### Option C — Drag & Drop
1. Run `npm run build` to generate the `dist/` folder
2. Go to [vercel.com/new](https://vercel.com/new)
3. Drag the `dist/` folder into the deploy zone

## Local Development

```bash
npm install
npm run dev
```

## Tech Stack

- React 18 + Vite
- Recharts (area chart)
- CSS Modules
- localStorage for persistence
- Anthropic Claude API for AI food search
- Google Fonts (Bebas Neue + DM Sans)

## Notes

- All data is stored in browser localStorage — no backend required
- AI food search calls the Anthropic API directly from the browser
- Searched foods are cached locally so they appear as preset options on future visits
- The app is fully responsive for mobile use
