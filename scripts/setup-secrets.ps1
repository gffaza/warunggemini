# Create/update Secret Manager secrets for Cloud Run runtime.
# Usage: .\scripts\setup-secrets.ps1
# Reads GEMINI_API_KEY and FIREBASE_SERVICE_ACCOUNT_JSON from .env.production

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $Root

$ProjectId = if ($env:GCP_PROJECT_ID) { $env:GCP_PROJECT_ID } else {
  (gcloud config get-value project 2>$null)
}
$EnvFile = if ($env:ENV_FILE) { $env:ENV_FILE } else { ".env.production" }

if (-not $ProjectId -or $ProjectId -eq "(unset)") {
  Write-Error "Set GCP_PROJECT_ID or run: gcloud config set project YOUR_PROJECT"
}

if (-not (Test-Path $EnvFile)) {
  Write-Error "${EnvFile} not found. Copy from .env.production.example"
}

Get-Content $EnvFile | ForEach-Object {
  if ($_ -match '^\s*#' -or $_ -notmatch '^\s*([^=]+)=(.*)$') { return }
  $name = $Matches[1].Trim()
  $value = $Matches[2].Trim().Trim('"').Trim("'")
  Set-Item -Path "env:$name" -Value $value
}

if (-not $env:GEMINI_API_KEY) {
  Write-Error "GEMINI_API_KEY missing in ${EnvFile}"
}
if (-not $env:FIREBASE_SERVICE_ACCOUNT_JSON) {
  Write-Error "FIREBASE_SERVICE_ACCOUNT_JSON missing in ${EnvFile}"
}

try {
  $null = $env:FIREBASE_SERVICE_ACCOUNT_JSON | ConvertFrom-Json
} catch {
  Write-Error "FIREBASE_SERVICE_ACCOUNT_JSON is not valid JSON: $_"
}

Write-Host "==> Project: $ProjectId"
gcloud services enable secretmanager.googleapis.com --project=$ProjectId | Out-Null

function Upsert-Secret {
  param([string]$Name, [string]$Value)
  gcloud secrets describe $Name --project=$ProjectId 2>$null | Out-Null
  $exists = $LASTEXITCODE -eq 0

  if ($exists) {
    Write-Host "==> Updating secret: $Name"
    $Value | gcloud secrets versions add $Name --data-file=- --project=$ProjectId
  } else {
    Write-Host "==> Creating secret: $Name"
    $Value | gcloud secrets create $Name --data-file=- --replication-policy=automatic --project=$ProjectId
  }
  if ($LASTEXITCODE -ne 0) { throw "Failed to upsert secret $Name" }
}

Upsert-Secret "gemini-api-key" $env:GEMINI_API_KEY
Upsert-Secret "firebase-sa-json" $env:FIREBASE_SERVICE_ACCOUNT_JSON

Write-Host ""
Write-Host "Secrets ready. See DEPLOY.md if /api/health shows firebaseAdmin: false after deploy."
