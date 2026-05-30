# WarungGemini — Cloud Run (Production)

Production deployment uses **Next.js standalone** in a multi-stage Docker image on **Google Cloud Run** (region `asia-southeast2` by default). Secrets live in **Secret Manager**; client Firebase config is baked at **image build time**.

---

## 1. Environment setup

### Variable matrix

| Variable | When | Where |
|----------|------|--------|
| `NEXT_PUBLIC_FIREBASE_*` (6 vars) | **Build time** | Docker `--build-arg`, Cloud Build substitutions, `.env.production` |
| `GEMINI_API_KEY` | **Runtime** | Secret Manager → Cloud Run |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | **Runtime** | Secret Manager → Cloud Run (single-line minified JSON) |
| `PORT` | **Runtime** | Set by Cloud Run (default `8080`) |
| `NODE_ENV` | **Runtime** | `production` |

**Never** put `GEMINI_API_KEY` or `FIREBASE_SERVICE_ACCOUNT_JSON` in the Docker image or build args.

### One-time GCP + Firebase

```bash
# GCP project
gcloud config set project YOUR_PROJECT_ID

# Enable APIs
gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  secretmanager.googleapis.com \
  cloudbuild.googleapis.com \
  --project=YOUR_PROJECT_ID
```

1. **Firebase project** — same GCP project (or linked). Enable **Authentication** (Google + Phone if needed).
2. **Firestore** — Native mode, deploy indexes:
   ```bash
   firebase deploy --only firestore:indexes --project YOUR_PROJECT_ID
   ```
3. **Service account** — Firebase Console → Project settings → Service accounts → **Generate new private key**. Minify to one line for the secret:
   ```bash
   node -e "console.log(JSON.stringify(require('./path-to-key.json')))"
   ```
   Or on PowerShell: `Get-Content key.json -Raw | ConvertFrom-Json | ConvertTo-Json -Compress`
4. **Gemini** — [Google AI Studio](https://aistudio.google.com/apikey) → create API key.

### Local file for builds

```bash
cp .env.production.example .env.production
# Fill NEXT_PUBLIC_* and keep GEMINI + SA for setup-secrets only
```

`.env.production` is gitignored. Do not commit it.

### Secret Manager (runtime)

```bash
chmod +x scripts/setup-secrets.sh
./scripts/setup-secrets.sh   # reads GEMINI_API_KEY + FIREBASE_SERVICE_ACCOUNT_JSON from .env.production
```

Creates (or updates):

- `gemini-api-key`
- `firebase-sa-json`

Cloud Run mounts them as env vars (see `scripts/deploy-cloud-run.sh`).

### IAM for Cloud Run

The Cloud Run **runtime service account** (default: `PROJECT_NUMBER-compute@developer.gserviceaccount.com`) needs:

- `roles/secretmanager.secretAccessor` on both secrets

Grant after first deploy if health check shows `firebaseAdmin: false`:

```bash
PROJECT_NUMBER=$(gcloud projects describe YOUR_PROJECT_ID --format='value(projectNumber)')
gcloud secrets add-iam-policy-binding gemini-api-key \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
gcloud secrets add-iam-policy-binding firebase-sa-json \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

---

## 2. Dockerfile

Multi-stage **Node 20 Alpine**:

1. **builder** — `npm ci` + `next build` with `NEXT_PUBLIC_*` build args
2. **runner** — copies `.next/standalone`, `.next/static`, `public`; runs `node server.js` as non-root on port **8080**

```bash
docker build --platform linux/amd64 \
  --build-arg NEXT_PUBLIC_FIREBASE_API_KEY=... \
  # ... other NEXT_PUBLIC_* ...
  -t warunggemini:local .
```

Image size target: ~150–250MB (standalone, no devDependencies in runner).

---

## 3. Production configs

| File | Purpose |
|------|---------|
| `next.config.ts` | `output: "standalone"`, `optimizePackageImports`, `turbopack.root`, `compress`, `poweredByHeader: false` |
| `Dockerfile` | Cloud Run image |
| `.dockerignore` / `.gcloudignore` | Exclude `node_modules`, `.next`, secrets |
| `cloudbuild.yaml` | CI: build → push Artifact Registry → deploy |
| `app/api/health/route.ts` | Liveness (`/api/health`) |
| `firebase.json` + `firestore.indexes.json` | Firestore composite indexes |

### Cloud Run service settings (recommended)

| Setting | Value | Why |
|---------|-------|-----|
| Memory | `1Gi` | `next build` not on runtime; vision + Firestore spikes |
| CPU | `1` | Sufficient for API + SSR |
| Min instances | `1` | Avoid cold start for demos |
| Max instances | `10` | Cap cost |
| Timeout | `120s` | Inventory vision scan |
| Concurrency | `80` | Next.js handles concurrent requests |
| Port | `8080` | Matches `PORT` / Dockerfile |
| Auth | `--allow-unauthenticated` | App uses Firebase client tokens on API routes |

---

## 4. Build optimization

Already enabled in repo:

- **Standalone output** — minimal runtime bundle in container
- **`experimental.optimizePackageImports: ['lucide-react']`** — smaller client chunks
- **`turbopack.root`** — correct monorepo/lockfile root during build
- **Multi-stage Docker** — devDependencies not in final image
- **`NODE_OPTIONS=--max-old-space-size=2048`** — build OOM guard in builder stage only

Cloud Build uses `E2_HIGHCPU_8` for faster `docker build`.

**Rebuild required when** any `NEXT_PUBLIC_*` value changes (Firebase web config, custom domain). **Redeploy only** when server secrets change.

---

## 5. Common deployment issues

| Symptom | Cause | Fix |
|---------|--------|-----|
| `/api/health` → `503`, `gemini: false` | Secret not mounted or IAM | `--set-secrets=GEMINI_API_KEY=gemini-api-key:latest` + secretAccessor role |
| `/api/health` → `firebaseAdmin: false` | Invalid JSON in secret | Re-run `setup-secrets.sh`; JSON must be one line, escaped quotes |
| Login works locally, fails on Cloud Run | Authorized domain | Firebase Console → Authentication → Settings → **Authorized domains** → add `xxxx.run.app` (no `https://`) |
| Phone OTP fails on prod | reCAPTCHA domain | Add Cloud Run domain to Firebase phone auth / reCAPTCHA allowlist |
| `UNAUTHORIZED` on all APIs | Clock skew / wrong project | Client `NEXT_PUBLIC_FIREBASE_PROJECT_ID` must match service account project |
| Firestore `FAILED_PRECONDITION` | Missing index | `firebase deploy --only firestore:indexes` |
| 502 on inventory scan | Timeout / memory | Increase `--timeout=120`, `--memory=1Gi`; resize images client-side |
| Build fails OOM in Docker | Large build | Builder already uses 2GB heap; use Cloud Build `E2_HIGHCPU_8` |
| Wrong Firebase config in browser | Stale image | Rebuild image after changing `NEXT_PUBLIC_*` |
| `Container failed to start` | Wrong port | App must listen on `process.env.PORT` (8080); standalone `server.js` does |
| Apple Silicon build, Cloud Run crash | Arch mismatch | Always `docker build --platform linux/amd64` |
| Secret newline breaks JSON | Multiline SA file | Use `jq -c .` or `setup-secrets.sh` |

---

## 6. Deployment commands

### A. Scripted deploy (recommended)

**Linux / macOS / Git Bash:**

```bash
cp .env.production.example .env.production
# Edit .env.production

./scripts/setup-secrets.sh
chmod +x scripts/deploy-cloud-run.sh
./scripts/deploy-cloud-run.sh
```

**Windows (PowerShell):**

```powershell
Copy-Item .env.production.example .env.production
# Edit .env.production

npm run deploy:secrets:win
npm run deploy:cloud-run:win
```

Overrides:

```bash
GCP_PROJECT_ID=my-project GCP_REGION=asia-southeast2 ./scripts/deploy-cloud-run.sh
```

### B. Manual Docker + gcloud

```bash
export PROJECT_ID=YOUR_PROJECT_ID
export REGION=asia-southeast2
export SERVICE=warunggemini
export IMAGE="${REGION}-docker.pkg.dev/${PROJECT_ID}/warunggemini/${SERVICE}"

# Build (source .env.production first for NEXT_PUBLIC_*)
source .env.production
docker build --platform linux/amd64 \
  --build-arg NEXT_PUBLIC_FIREBASE_API_KEY="$NEXT_PUBLIC_FIREBASE_API_KEY" \
  --build-arg NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="$NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN" \
  --build-arg NEXT_PUBLIC_FIREBASE_PROJECT_ID="$NEXT_PUBLIC_FIREBASE_PROJECT_ID" \
  --build-arg NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="$NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET" \
  --build-arg NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="$NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID" \
  --build-arg NEXT_PUBLIC_FIREBASE_APP_ID="$NEXT_PUBLIC_FIREBASE_APP_ID" \
  -t "${IMAGE}:latest" .

docker push "${IMAGE}:latest"

gcloud run deploy "${SERVICE}" \
  --image="${IMAGE}:latest" \
  --region="${REGION}" \
  --platform=managed \
  --allow-unauthenticated \
  --port=8080 \
  --memory=1Gi \
  --cpu=1 \
  --min-instances=1 \
  --max-instances=10 \
  --timeout=120 \
  --concurrency=80 \
  --set-secrets=GEMINI_API_KEY=gemini-api-key:latest,FIREBASE_SERVICE_ACCOUNT_JSON=firebase-sa-json:latest \
  --set-env-vars=NODE_ENV=production,NEXT_TELEMETRY_DISABLED=1
```

### C. Cloud Build (CI/CD)

Create trigger with substitutions for all `_NEXT_PUBLIC_*` (or use Secret Manager + build step). Then:

```bash
gcloud builds submit --config=cloudbuild.yaml \
  --substitutions=_NEXT_PUBLIC_FIREBASE_API_KEY=xxx,_NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx,... \
  --project=YOUR_PROJECT_ID
```

### Post-deploy checklist

```bash
URL=$(gcloud run services describe warunggemini --region=asia-southeast2 --format='value(status.url)')
curl -s "${URL}/api/health" | jq .
```

1. Health returns `"status":"ok"`.
2. Firebase **Authorized domains** includes Cloud Run host.
3. Firestore indexes deployed.
4. Smoke test: login → chat message → inventory list.

---

## Architecture

```
[Browser] --Firebase Auth--> [Firebase]
     |
     v HTTPS
[Cloud Run :8080] --standalone Next.js-->
     |-- /api/* --> Gemini API
     |-- /api/* --> Firestore (Admin SDK + SA secret)
```

Server-only keys never reach the client bundle.
