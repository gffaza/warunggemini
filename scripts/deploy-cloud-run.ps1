# Production deploy: Artifact Registry + Cloud Run + Secret Manager
# Usage: .\scripts\deploy-cloud-run.ps1
# Requires: gcloud, docker, .env.production (or exported vars)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $Root

$ProjectId = if ($env:GCP_PROJECT_ID) { $env:GCP_PROJECT_ID } else {
  (gcloud config get-value project 2>$null)
}
$Region = if ($env:GCP_REGION) { $env:GCP_REGION } else { "asia-southeast2" }
$Service = if ($env:CLOUD_RUN_SERVICE) { $env:CLOUD_RUN_SERVICE } else { "warunggemini" }
$ArRepo = if ($env:ARTIFACT_REGISTRY_REPO) { $env:ARTIFACT_REGISTRY_REPO } else { "warunggemini" }
$Image = "${Region}-docker.pkg.dev/${ProjectId}/${ArRepo}/${Service}"

if (-not $ProjectId -or $ProjectId -eq "(unset)") {
  Write-Error "Set GCP_PROJECT_ID or run: gcloud config set project YOUR_PROJECT"
}

$EnvFile = if ($env:ENV_FILE) { $env:ENV_FILE } else { ".env.production" }
if (Test-Path $EnvFile) {
  Get-Content $EnvFile | ForEach-Object {
    if ($_ -match '^\s*#' -or $_ -notmatch '^\s*([^=]+)=(.*)$') { return }
    $name = $Matches[1].Trim()
    $value = $Matches[2].Trim().Trim('"').Trim("'")
    Set-Item -Path "env:$name" -Value $value
  }
} else {
  Write-Warning "${EnvFile} not found — ensure NEXT_PUBLIC_* and secrets are set in environment"
}

$requiredPublic = @(
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID"
)
foreach ($key in $requiredPublic) {
  $val = (Get-Item -Path "env:$key" -ErrorAction SilentlyContinue).Value
  if (-not $val) {
    Write-Error "Missing build-time var $key (set in ${EnvFile})"
  }
}

Write-Host "==> Project: $ProjectId | Region: $Region | Service: $Service"

Write-Host "==> Enable APIs (idempotent)"
gcloud services enable run.googleapis.com artifactregistry.googleapis.com cloudbuild.googleapis.com secretmanager.googleapis.com --project=$ProjectId

Write-Host "==> Artifact Registry repository"
gcloud artifacts repositories describe $ArRepo --location=$Region --project=$ProjectId 2>$null
if ($LASTEXITCODE -ne 0) {
  gcloud artifacts repositories create $ArRepo --repository-format=docker --location=$Region --project=$ProjectId
  if ($LASTEXITCODE -ne 0) { throw "Failed to create Artifact Registry repo" }
}

gcloud auth configure-docker "${Region}-docker.pkg.dev" --quiet

try {
  $Tag = (git rev-parse --short HEAD 2>$null)
} catch {
  $Tag = Get-Date -Format "yyyyMMddHHmmss"
}
if (-not $Tag) { $Tag = Get-Date -Format "yyyyMMddHHmmss" }
$FullImage = "${Image}:${Tag}"

Write-Host "==> Docker build (NEXT_PUBLIC_* baked in)"
docker build `
  --platform linux/amd64 `
  --build-arg "NEXT_PUBLIC_FIREBASE_API_KEY=$env:NEXT_PUBLIC_FIREBASE_API_KEY" `
  --build-arg "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$env:NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN" `
  --build-arg "NEXT_PUBLIC_FIREBASE_PROJECT_ID=$env:NEXT_PUBLIC_FIREBASE_PROJECT_ID" `
  --build-arg "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$env:NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET" `
  --build-arg "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$env:NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID" `
  --build-arg "NEXT_PUBLIC_FIREBASE_APP_ID=$env:NEXT_PUBLIC_FIREBASE_APP_ID" `
  -t $FullImage `
  -t "${Image}:latest" `
  .
if ($LASTEXITCODE -ne 0) { throw "Docker build failed" }

Write-Host "==> Push image"
docker push $FullImage
docker push "${Image}:latest"

Write-Host "==> Ensure Secret Manager access for Cloud Run runtime SA"
$ProjectNumber = (gcloud projects describe $ProjectId --format="value(projectNumber)")
$RuntimeSa = "${ProjectNumber}-compute@developer.gserviceaccount.com"
foreach ($secret in @("gemini-api-key", "firebase-sa-json")) {
  gcloud secrets add-iam-policy-binding $secret `
    --project=$ProjectId `
    --member="serviceAccount:${RuntimeSa}" `
    --role="roles/secretmanager.secretAccessor" `
    --quiet 2>$null
}

Write-Host "==> Deploy Cloud Run"
gcloud run deploy $Service `
  --image=$FullImage `
  --region=$Region `
  --platform=managed `
  --project=$ProjectId `
  --allow-unauthenticated `
  --port=8080 `
  --memory=1Gi `
  --cpu=1 `
  --min-instances=1 `
  --max-instances=10 `
  --timeout=120 `
  --concurrency=80 `
  --set-secrets="GEMINI_API_KEY=gemini-api-key:latest,FIREBASE_SERVICE_ACCOUNT_JSON=firebase-sa-json:latest" `
  --set-env-vars="NODE_ENV=production,NEXT_TELEMETRY_DISABLED=1,HOSTNAME=0.0.0.0"
if ($LASTEXITCODE -ne 0) { throw "Cloud Run deploy failed" }

$Url = (gcloud run services describe $Service --region=$Region --project=$ProjectId --format="value(status.url)")

Write-Host ""
Write-Host "Deployed: $Url"
Write-Host "Health:   ${Url}/api/health"
Write-Host ""
Write-Host "Post-deploy:"
$HostOnly = $Url -replace '^https://', ''
Write-Host "  1. Firebase Console -> Authentication -> Authorized domains -> add: $HostOnly"
Write-Host "  2. firebase deploy --only firestore:indexes --project $ProjectId"
