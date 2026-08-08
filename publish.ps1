param(
  [string]$Configuration = "Release",
  [string]$Runtime = "win-x64",
  [string]$OutputRoot = ".\\artifacts\\publish",
  [string]$VersionPrefix = "2.0.0"
)

$ErrorActionPreference = "Stop"

$appProject = ".\\ChunithmLauncher\\ChunithmLauncher.csproj"
$bootstrapperProject = ".\\ChunithmLauncher.Bootstrapper\\ChunithmLauncher.Bootstrapper.csproj"
$stamp = Get-Date -Format "yyyyMMdd_HHmmss"
$output = Join-Path $OutputRoot $stamp
$version = $VersionPrefix

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
  "-p:FileVersion=$VersionPrefix",
  "-p:AssemblyVersion=$VersionPrefix",
  "-p:InformationalVersion=$VersionPrefix",
  "-p:IncludeSourceRevisionInInformationalVersion=false",
  "-p:DebugType=None",
  "-p:DebugSymbols=false",
  "-o", $output
)

# Self-contained bootstrapper: runs without .NET and opens the runtime download page if needed.
Invoke-DotNetPublish @(
  $bootstrapperProject,
  "-c", $Configuration,
  "-r", $Runtime,
  "--self-contained", "true",
  "-p:Version=$version",
  "-p:FileVersion=$VersionPrefix",
  "-p:AssemblyVersion=$VersionPrefix",
  "-p:InformationalVersion=$VersionPrefix",
  "-p:IncludeSourceRevisionInInformationalVersion=false",
  "-p:DebugType=None",
  "-p:DebugSymbols=false",
  "-o", $output
)

Get-ChildItem $output -Recurse -Include *.pdb,*.xml | Remove-Item -Force

Write-Host "Done. Output: $output" -ForegroundColor Green
