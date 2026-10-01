# CHUNITHM Launcher iPadOS 27

This directory is the native SwiftUI iPadOS 27 edition. It is independent from the Windows WPF/WebView2 app and currently uses local JSON content only.

## Build on GitHub Actions

The `build-ipados` job uses the public-preview `xcode-27` runner, archives for `generic/platform=iOS` with signing disabled, and packages `Payload/CHUNITHMLauncher.app` as the single `CHUNITHMLauncher-iPadOS27-unsigned.ipa` artifact. IPA is Apple's ZIP-based app package format; GitHub Actions may wrap downloaded artifacts in an additional ZIP for transport.

The Proseka URL scheme is intentionally empty until it is verified on a real iPad with the Japanese server app. Set the repository variable `PROSEKA_URL_SCHEME` only after that verification.

## Local resources

- `Resources/content.json` contains the offline demo content.
- `Resources/Localizable.xcstrings` contains English, Simplified Chinese, Japanese, Korean, French, Spanish, and German strings.
- Event and Aime images are copied from the active Windows `ui/assets` directory.
