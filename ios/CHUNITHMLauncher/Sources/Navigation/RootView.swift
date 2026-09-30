import SwiftUI

struct RootView: View {
    @StateObject private var state = AppState()
    @AppStorage("languageOverride") private var languageOverride = "system"
    @AppStorage("appearanceMode") private var appearanceMode = "system"
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @Environment(\.colorScheme) private var systemColorScheme

    private var locale: Locale? { languageOverride == "system" ? nil : Locale(identifier: languageOverride) }
    private var colorScheme: ColorScheme? { appearanceMode == "dark" ? .dark : appearanceMode == "light" ? .light : nil }

    var body: some View {
        NavigationSplitView {
            List(selection: Binding<LauncherSection?>(
                get: { state.selectedSection },
                set: { if let section = $0 { state.selectedSection = section } }
            )) {
                ForEach(LauncherSection.allCases) { section in
                    Label(section.titleKey, systemImage: section.systemImage).tag(section)
                }
            }
            .navigationTitle("app.title")
            .listStyle(.sidebar)
        } detail: {
            GeometryReader { proxy in
                NavigationStack {
                    destination(for: state.selectedSection, width: proxy.size.width)
                        .toolbar { ToolbarItem(placement: .topBarTrailing) { Text("app.edition").font(.caption).foregroundStyle(.secondary) } }
                }
                .background(LauncherPalette.background(colorScheme ?? systemColorScheme).ignoresSafeArea())
            }
        }
        .tint(Color(hex: "fdd500"))
        .preferredColorScheme(colorScheme)
        .environment(\.locale, locale ?? Locale.current)
        .animation(reduceMotion ? nil : .snappy, value: state.selectedSection)
    }

    @ViewBuilder
    private func destination(for section: LauncherSection, width: CGFloat) -> some View {
        switch section {
        case .home: HomeView(state: state, availableWidth: width)
        case .activities: ActivitiesView(state: state)
        case .rating: RatingView(state: state)
        case .shop: ShopView(state: state)
        case .friends: FriendsView(state: state)
        case .aime: AimeView(state: state)
        case .checkin: CheckinView()
        case .settings: SettingsView()
        }
    }
}
