param(
  [string]$Configuration = "Release",
  [string]$Runtime = "win-x64",
  [string]$OutputRoot = ".\\artifacts\\publish",
  [string]$VersionPrefix = ""
)

$ErrorActionPreference = "Stop"

$appProject = ".\\ChunithmLauncher\\ChunithmLauncher.csproj"
$bootstrapperProject = ".\\ChunithmLauncher.Bootstrapper\\ChunithmLauncher.Bootstrapper.csproj"
$stamp = Get-Date -Format "yyyyMMdd_HHmmss"
$output = Join-Path $OutputRoot $stamp
$appOutput = Join-Path $output "app"
$version = $VersionPrefix

# Directory.Build.props is the single source of truth for the version;
# only read from it when the caller did not pass -VersionPrefix explicitly.
if ([string]::IsNullOrWhiteSpace($version)) {
  $propsPath = Join-Path $PSScriptRoot "Directory.Build.props"
  if (-not (Test-Path -LiteralPath $propsPath)) {
    throw "Directory.Build.props not found and no -VersionPrefix was supplied."
  }

  $props = [xml](Get-Content -LiteralPath $propsPath -Raw)
  $version = $props.Project.PropertyGroup.Version
}

if ([string]::IsNullOrWhiteSpace($version)) {
  throw "Cannot determine version: define Version in Directory.Build.props or pass -VersionPrefix."
}

Write-Host "Publishing $appProject" -ForegroundColor Cyan
Write-Host "Version: $version" -ForegroundColor Cyan
Write-Host "Output: $output" -ForegroundColor Cyan

$env:DOTNET_SKIP_FIRST_TIME_EXPERIENCE = "1"
$env:DOTNET_CLI_TELEMETRY_OPTOUT = "1"

function Invoke-DotNetPublish {
  param([string[]]$DotNetArgs)

  dotnet publish @DotNetArgs
  if ($LASTEXITCODE -ne 0) {
    throw "dotnet publish failed with exit code $LASTEXITCODE"
  }
}

# Framework-dependent app publish: do not bundle .NET runtime.
Invoke-DotNetPublish @(
  $appProject,
  "-c", $Configuration,
  "-r", $Runtime,
  "--self-contained", "false",
  "-p:PublishSingleFile=false",
  "-p:UseAppHost=true",
  "-p:Version=$version",
  "-p:FileVersion=$version",
  "-p:AssemblyVersion=$version",
  "-p:InformationalVersion=$version",
  "-p:IncludeSourceRevisionInInformationalVersion=false",
  "-p:DebugType=None",
  "-p:DebugSymbols=false",
  "-o", $appOutput
)

# Self-contained bootstrapper: runs without .NET and opens the runtime download page if needed.
Invoke-DotNetPublish @(
  $bootstrapperProject,
  "-c", $Configuration,
  "-r", $Runtime,
  "--self-contained", "true",
  "-p:Version=$version",
  "-p:FileVersion=$version",
  "-p:AssemblyVersion=$version",
  "-p:InformationalVersion=$version",
  "-p:IncludeSourceRevisionInInformationalVersion=false",
  "-p:DebugType=None",
  "-p:DebugSymbols=false",
  "-o", $output
)

Get-ChildItem $output -Recurse -Include *.pdb,*.xml | Remove-Item -Force

Write-Host "Done. Output: $output" -ForegroundColor Green
