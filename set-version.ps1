param(
    [string]$Version
)

$ErrorActionPreference = "Stop"
$Host.UI.RawUI.WindowTitle = "Chunithm Launcher Version Tool"

if ([string]::IsNullOrWhiteSpace($Version)) {
    $Version = Read-Host "Enter version (example: v2.1.1 or v2.1.1.0)"
}

$Version = $Version.Trim()
if ($Version -notmatch '^v?(\d+)\.(\d+)\.(\d+)(?:\.(\d+))?$') {
    Write-Host "Invalid version. Use vX.X.X or vX.X.X.X." -ForegroundColor Red
    exit 1
}

$NormalizedVersion = $Version.TrimStart('v', 'V')
$DisplayVersion = "v$NormalizedVersion"
$RepositoryRoot = $PSScriptRoot
$Utf8NoBom = New-Object System.Text.UTF8Encoding($false)

function Update-TextFile {
    param(
        [Parameter(Mandatory)] [string]$RelativePath,
        [Parameter(Mandatory)] [scriptblock]$Transform
    )

    $Path = Join-Path $RepositoryRoot $RelativePath
    if (-not (Test-Path -LiteralPath $Path)) {
        throw "File not found: $RelativePath"
    }

    $Original = [System.IO.File]::ReadAllText($Path)
    $Updated = & $Transform $Original
    if ($Updated -eq $Original) {
        Write-Host "$RelativePath is already up to date." -ForegroundColor DarkGray
        return
    }

    [System.IO.File]::WriteAllText($Path, $Updated, $Utf8NoBom)
    Write-Host "Updated $RelativePath" -ForegroundColor Green
}

$ProjectFiles = @(
    'ChunithmLauncher\ChunithmLauncher.csproj',
    'ChunithmLauncher.Bootstrapper\ChunithmLauncher.Bootstrapper.csproj'
)

foreach ($ProjectFile in $ProjectFiles) {
    Update-TextFile $ProjectFile {
        param($Text)
        $Text = [regex]::Replace($Text, '<Version>[^<]+</Version>', "<Version>$NormalizedVersion</Version>")
        $Text = [regex]::Replace($Text, '<AssemblyVersion>[^<]+</AssemblyVersion>', "<AssemblyVersion>$NormalizedVersion</AssemblyVersion>")
        [regex]::Replace($Text, '<FileVersion>[^<]+</FileVersion>', "<FileVersion>$NormalizedVersion</FileVersion>")
    }
}

Update-TextFile 'publish.ps1' {
    param($Text)
    [regex]::Replace($Text, '\[string\]\$VersionPrefix\s*=\s*"[^"]+"', "[string]`$VersionPrefix = `"$NormalizedVersion`"")
}

Update-TextFile 'ui\index.html' {
    param($Text)
    [regex]::Replace($Text, '(<span\s+id="version">)v?[^<]+(</span>)', "`$1$DisplayVersion`$2")
}

$AppJsPath = Join-Path $RepositoryRoot 'ui\app.js'
$AppJs = [System.IO.File]::ReadAllText($AppJsPath)
$UpdatedAppJs = [regex]::Replace($AppJs, "version:\s*'[0-9]+(?:\.[0-9]+){2,3}'", "version: '$NormalizedVersion'")
if ($UpdatedAppJs -ne $AppJs) {
    [System.IO.File]::WriteAllText($AppJsPath, $UpdatedAppJs, $Utf8NoBom)
    Write-Host "Updated ui\app.js" -ForegroundColor Green
}

Write-Host ""
Write-Host "Version updated to $DisplayVersion" -ForegroundColor Cyan
