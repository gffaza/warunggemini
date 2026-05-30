#!/usr/bin/env bash
# Production deploy: Artifact Registry + Cloud Run + Secret Manager
# Usage: ./scripts/deploy-cloud-run.sh
# Requires: gcloud, docker, .env.production (or exported vars)

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

# --- Config (override via env) ---
PROJECT_ID="${GCP_PROJECT_ID:-$(gcloud config get-value project 2>/dev/null)}"
REGION="${GCP_REGION:-asia-southeast2}"
SERVICE="${CLOUD_RUN_SERVICE:-warunggemini}"
AR_REPO="${ARTIFACT_REGISTRY_REPO:-warunggemini}"
IMAGE="${REGION}-docker.pkg.dev/${PROJECT_ID}/${AR_REPO}/${SERVICE}"

if [[ -z "${PROJECT_ID}" || "${PROJECT_ID}" == "(unset)" ]]; then
  echo "ERROR: Set GCP_PROJECT_ID or run: gcloud config set project YOUR_PROJECT"
  exit 1
fi

ENV_FILE="${ENV_FILE:-.env.production}"
if [[ -f "${ENV_FILE}" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "${ENV_FILE}"
  set +a
else
  echo "WARN: ${ENV_FILE} not found — ensure NEXT_PUBLIC_* and secrets are set in environment"
fi

required_public=(
  NEXT_PUBLIC_FIREBASE_API_KEY
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  NEXT_PUBLIC_FIREBASE_PROJECT_ID
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
  NEXT_PUBLIC_FIREBASE_APP_ID
)
for key in "${required_public[@]}"; do
  if [[ -z "${!key:-}" ]]; then
    echo "ERROR: Missing build-time var ${key} (set in ${ENV_FILE})"
    exit 1
  fi
done

echo "==> Project: ${PROJECT_ID} | Region: ${REGION} | Service: ${SERVICE}"

echo "==> Enable APIs (idempotent)"
gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  secretmanager.googleapis.com \
  --project="${PROJECT_ID}"

echo "==> Artifact Registry repository"
if ! gcloud artifacts repositories describe "${AR_REPO}" \
  --location="${REGION}" --project="${PROJECT_ID}" &>/dev/null; then
  gcloud artifacts repositories create "${AR_REPO}" \
    --repository-format=docker \
    --location="${REGION}" \
    --project="${PROJECT_ID}"
fi

gcloud auth configure-docker "${REGION}-docker.pkg.dev" --quiet

TAG="$(git rev-parse --short HEAD 2>/dev/null || date +%Y%m%d%H%M%S)"
FULL_IMAGE="${IMAGE}:${TAG}"

echo "==> Docker build (NEXT_PUBLIC_* baked in)"
docker build \
  --platform linux/amd64 \
  --build-arg "NEXT_PUBLIC_FIREBASE_API_KEY=${NEXT_PUBLIC_FIREBASE_API_KEY}" \
  --build-arg "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}" \
  --build-arg "NEXT_PUBLIC_FIREBASE_PROJECT_ID=${NEXT_PUBLIC_FIREBASE_PROJECT_ID}" \
  --build-arg "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}" \
  --build-arg "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}" \
  --build-arg "NEXT_PUBLIC_FIREBASE_APP_ID=${NEXT_PUBLIC_FIREBASE_APP_ID}" \
  -t "${FULL_IMAGE}" \
  -t "${IMAGE}:latest" \
  .

echo "==> Push image"
docker push "${FULL_IMAGE}"
docker push "${IMAGE}:latest"

echo "==> Ensure Secret Manager access for Cloud Run runtime SA"
PROJECT_NUMBER="$(gcloud projects describe "${PROJECT_ID}" --format='value(projectNumber)')"
RUNTIME_SA="${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"
for secret in gemini-api-key firebase-sa-json; do
  gcloud secrets add-iam-policy-binding "${secret}" \
    --project="${PROJECT_ID}" \
    --member="serviceAccount:${RUNTIME_SA}" \
    --role="roles/secretmanager.secretAccessor" \
    --quiet 2>/dev/null || true
done

echo "==> Deploy Cloud Run"
gcloud run deploy "${SERVICE}" \
  --image="${FULL_IMAGE}" \
  --region="${REGION}" \
  --platform=managed \
  --project="${PROJECT_ID}" \
  --allow-unauthenticated \
  --port=8080 \
  --memory=1Gi \
  --cpu=1 \
  --min-instances=1 \
  --max-instances=10 \
  --timeout=120 \
  --concurrency=80 \
  --set-secrets="GEMINI_API_KEY=gemini-api-key:latest,FIREBASE_SERVICE_ACCOUNT_JSON=firebase-sa-json:latest" \
  --set-env-vars="NODE_ENV=production,NEXT_TELEMETRY_DISABLED=1,HOSTNAME=0.0.0.0"

URL="$(gcloud run services describe "${SERVICE}" \
  --region="${REGION}" --project="${PROJECT_ID}" \
  --format='value(status.url)')"

echo ""
echo "Deployed: ${URL}"
echo "Health:   ${URL}/api/health"
echo ""
echo "Post-deploy:"
echo "  1. Firebase Console → Authentication → Authorized domains → add: $(echo "${URL}" | sed 's|https://||')"
echo "  2. firebase deploy --only firestore:indexes --project ${PROJECT_ID}"
