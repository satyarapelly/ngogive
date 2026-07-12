# Give NGO API Server

## Run the API locally

```bash
cd server
npm install
npm start
```

The API listens on `http://localhost:5000` by default. You can override the port with `PORT=5055 npm start`.

## Vidyanjali school search API

The frontend calls this local proxy endpoint:

```text
GET http://localhost:5000/api/vidyanjali/schools?state=TELANGANA&district=&block=&pageSize=5000
```

The server proxies Vidyanjali school search requests to the official endpoint from the browser network trace:

```text
POST https://vidyanjali.education.gov.in/apividya/web/schools/onboard-schools
Content-Type: application/json
token: <network trace token>

{"secure":"<network trace secure payload>"}
```

Do not call the Vidyanjali endpoint directly from the GIVE frontend browser code. The response headers in the trace allow CORS only for `https://vidyanjali.education.gov.in`, so localhost or the GIVE site will be blocked by the browser. The local Express API is the integration point: it performs the POST server-side and returns normalized school rows to the frontend.

Set these values in `server/.env` from a fresh Vidyanjali `all-schools` browser network trace:

```env
PORT=5000
VIDYANJALI_SEARCH_URL=https://vidyanjali.education.gov.in/apividya/web/schools/onboard-schools
VIDYANJALI_TOKEN=paste_the_token_header_here
VIDYANJALI_SECURE_PAYLOAD=paste_the_secure_request_body_value_here
```

The token and secure payload should not be committed because they are session-like values from the portal. If either value is missing, expired, blocked, or the official response shape changes, the local API returns bundled school data from `frontend/public/data/vidyanjali/schools.json` with `mode: "local-fallback"` instead of failing the frontend flow.

## Frontend local setup

In another terminal, run:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173/vidyanjali-requirements.html`. When running on localhost, the frontend defaults to `http://localhost:5000` for API requests. If your API runs elsewhere, add this to `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000
```
