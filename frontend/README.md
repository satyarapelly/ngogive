# GiveNGO Frontend

## Local development

Run the API server in one terminal:

```bash
cd server
npm install
npm start
```

Run the frontend in another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173/vidyanjali-requirements.html`.

## Setting `VITE_API_BASE_URL`

Vite only exposes frontend environment variables that start with `VITE_`. To point the frontend at the local API server, create or edit `frontend/.env` and add:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Restart `npm run dev` after changing `.env`; Vite reads env files only when the dev server starts.

The Vidyanjali page also auto-detects localhost and defaults to `http://localhost:5000` if `VITE_API_BASE_URL` is blank. Set `VITE_API_BASE_URL` explicitly when the API runs on a different host or port.
