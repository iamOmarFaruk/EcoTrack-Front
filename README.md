# EcoTrack (Frontend)

EcoTrack is a community sustainability app where people can join challenges, attend events, and share tips.

Live app: https://eco-track-peach.vercel.app
API: https://eco-track-backend-delta.vercel.app/api/

![EcoTrack screenshot](ecotrack-screenshot.png)

## Features
- Browse challenges, events, and tips
- Sign in with email/password or Google (Firebase)
- Join/leave challenges and register for events
- Personal pages for activity, tips, and profile
- Admin console for managing content and users

## Tech stack
- React 19, Vite 7, Tailwind CSS 3
- React Router, React Query
- React Hook Form + Zod
- Firebase Auth
- Axios, Recharts, Swiper, Framer Motion, Lottie

## Local setup
1. `cd EcoTrack-Front`
2. `npm install`
3. `cp .env.example .env`
4. Add the required values:
   - `VITE_API_BASE_URL`
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_APP_ID`

   Optional: `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, and the image/default overrides used in `src/config/env.js`.
5. `npm run dev`

## Scripts
- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run lint`

## Project structure
```
src/
  components/
  pages/
  pages/admin/
  context/
  hooks/
  services/
  utils/
```

## Backend
The API server lives in `../EcoTrack-Backend`. Point `VITE_API_BASE_URL` to its `/api` base.

## Author
Omar Faruk
- Portfolio: https://omarfaruk.dev
- LinkedIn: https://www.linkedin.com/in/omar-expert-webdeveloper/
