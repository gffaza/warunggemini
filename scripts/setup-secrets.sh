#!/usr/bin/env bash
# Create/update Secret Manager secrets for Cloud Run runtime.
# Usage: ./scripts/setup-secrets.sh
# Reads GEMINI_API_KEY and FIREBASE_SERVICE_ACCOUNT_JSON from .env.production

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

PROJECT_ID="${GCP_PROJECT_ID:-$(gcloud config get-value project 2>/dev/null)}"
ENV_FILE="${ENV_FILE:-.env.production}"

if [[ -z "${PROJECT_ID}" || "${PROJECT_ID}" == "(unset)" ]]; then
  echo "ERROR: Set GCP_PROJECT_ID or: gcloud config set project YOUR_PROJECT"
  exit 1
fi

if [[ ! -f "${ENV_FILE}" ]]; then
  echo "ERROR: ${ENV_FILE} not found. Copy from .env.production.example"
  exit 1
fi

set -a
# shellcheck disable=SC1090
source "${ENV_FILE}"
set +a

if [[ -z "${GEMINI_API_KEY:-}" ]]; then
  echo "ERROR: GEMINI_API_KEY missing in ${ENV_FILE}"
  exit 1
fi

if [[ -z "${FIREBASE_SERVICE_ACCOUNT_JSON:-}" ]]; then
  echo "ERROR: FIREBASE_SERVICE_ACCOUNT_JSON missing in ${ENV_FILE}"
  exit 1
fi

# Validate JSON (requires jq: brew install jq)
if ! command -v jq &>/dev/null; then
  echo "ERROR: jq required. Install: brew install jq"
  exit 1
fi
echo "${FIREBASE_SERVICE_ACCOUNT_JSON}" | jq -e . >/dev/null

echo "==> Project: ${PROJECT_ID}"

gcloud services enable secretmanager.googleapis.com --project="${PROJECT_ID}"

upsert_secret() {
  local name="$1"
  local value="$2"

  if gcloud secrets describe "${name}" --project="${PROJECT_ID}" &>/dev/null; then
    echo "==> Updating secret: ${name}"
    printf '%s' "${value}" | gcloud secrets versions add "${name}" \
      --data-file=- \
      --project="${PROJECT_ID}"
  else
    echo "==> Creating secret: ${name}"
    printf '%s' "${value}" | gcloud secrets create "${name}" \
      --data-file=- \
      --replication-policy=automatic \
      --project="${PROJECT_ID}"
  fi
}

upsert_secret "gemini-api-key" "${GEMINI_API_KEY}"
upsert_secret "firebase-sa-json" "${FIREBASE_SERVICE_ACCOUNT_JSON}"

echo ""
echo "Secrets ready. Grant Cloud Run access after first deploy if health check fails:"
echo "  See DEPLOY.md → IAM for Cloud Run"
