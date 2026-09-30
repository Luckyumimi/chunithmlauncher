import SwiftUI

struct SettingsView: View {
    @AppStorage("languageOverride") private var languageOverride = "system"
    @AppStorage("appearanceMode") private var appearanceMode = "system"

    private let languages = [("system", "settings.language.system"), ("zh-Hans", "settings.language.zh"), ("en", "settings.language.en"), ("ja", "settings.language.ja"), ("ko", "settings.language.ko"), ("fr", "settings.language.fr"), ("es", "settings.language.es"), ("de", "settings.language.de")]
    private let appearances = [("system", "settings.appearance.system"), ("light", "settings.appearance.light"), ("dark", "settings.appearance.dark")]

    var body: some View {
        Form {
            Section("settings.language") { Picker("settings.language", selection: $languageOverride) { ForEach(languages, id: \.0) { Text(LocalizedStringKey($0.1)).tag($0.0) } } }
            Section("settings.appearance") { Picker("settings.appearance", selection: $appearanceMode) { ForEach(appearances, id: \.0) { Text(LocalizedStringKey($0.1)).tag($0.0) } }.pickerStyle(.segmented) }
            Section("settings.about") { LabeledContent("settings.version", value: "2.5.0 iPadOS") ; Link("link.github", destination: ExternalLinks.github) }
        }
        .navigationTitle("nav.settings")
    }
}

