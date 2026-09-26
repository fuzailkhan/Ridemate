# RideMate

Motorcycle rider companion app. React Native + Expo + TypeScript + Expo Router.

## Task 1 status: visual/navigation shell only
No Firebase, no GPS, no chat backend yet — every screen renders from
`src/constants/mockData.ts`. See the architecture doc for what's planned
beyond this task.

## Run it
```
npm install
npm run android   # or: npm run ios / npm run web
```

## Typecheck
```
npm run typecheck
```

## Structure
- `src/app/` — Expo Router routes (file-based navigation)
- `src/components/` — reusable UI (`ui/`), ride-specific (`ride/`), map placeholder (`map/`)
- `src/theme/` — design tokens (colors, spacing, radii, typography)
- `src/types/` — domain types mirroring the approved Firestore schema
- `src/constants/mockData.ts` — static data used throughout Task 1
