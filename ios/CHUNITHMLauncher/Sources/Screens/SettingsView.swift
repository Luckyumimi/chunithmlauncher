import SwiftUI

struct SettingsView: View {
    @Environment(\.colorScheme) private var colorScheme
    @AppStorage("languageOverride") private var languageOverride = "system"
    @AppStorage("appearanceMode") private var appearanceMode = "system"
    @AppStorage("themeColorHex") private var themeColorHex = "fdd500"
    @AppStorage("allNetButtonText") private var allNetButtonText = "打开MuNET"
    @AppStorage("allNetURL") private var allNetURL = "https://portal.mumur.net/"

    private let languages = [
        ("system", "settings.language.system"), ("zh-Hans", "settings.language.zh"),
        ("en", "settings.language.en"), ("ja", "settings.language.ja"),
        ("ko", "settings.language.ko"), ("fr", "settings.language.fr"),
        ("es", "settings.language.es"), ("de", "settings.language.de")
    ]
    private let appearances = [
        ("system", "settings.appearance.system"), ("light", "settings.appearance.light"),
        ("dark", "settings.appearance.dark")
    ]

    var body: some View {
        Form {
            Section("settings.language") {
                Picker("settings.language", selection: $languageOverride) {
                    ForEach(languages, id: \.0) { item in
                        Text(LocalizedStringKey(item.1)).tag(item.0)
                    }
                }
            }
            Section("settings.appearance") {
                Picker("settings.appearance", selection: Binding(
                    get: { appearanceMode },
                    set: { value in withAnimation(.easeInOut(duration: 0.35)) { appearanceMode = value } }
                )) {
                    ForEach(appearances, id: \.0) { item in
                        Text(LocalizedStringKey(item.1)).tag(item.0)
                    }
                }
                .pickerStyle(.segmented)
            }
            Section("settings.themeColor") {
                ColorPicker("settings.themeColor", selection: Binding(
                    get: { Color(hex: themeColorHex) },
                    set: { themeColorHex = $0.hexString ?? themeColorHex }
                ), supportsOpacity: false)
            }
            Section("settings.allnet") {
                TextField("settings.allnet.button", text: $allNetButtonText)
                TextField("settings.allnet.url", text: $allNetURL)
                    .textInputAutocapitalization(.never)
                    .keyboardType(.URL)
            }
            Section("settings.about") {
                LabeledContent("settings.version", value: "2.5.0 iPadOS")
                Link("link.github", destination: ExternalLinks.github)
            }
        }
        .scrollContentBackground(.hidden)
        .background(LauncherPalette.background(colorScheme))
        .navigationTitle("nav.settings")
    }
}
