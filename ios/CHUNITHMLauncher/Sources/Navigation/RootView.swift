import SwiftUI

struct RootView: View {
    @StateObject private var state = AppState()
    @AppStorage("languageOverride") private var languageOverride = "system"
    @AppStorage("appearanceMode") private var appearanceMode = "system"
    @AppStorage("themeColorHex") private var themeColorHex = "fdd500"
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @Environment(\.colorScheme) private var systemColorScheme

    private var locale: Locale? { languageOverride == "system" ? nil : Locale(identifier: languageOverride) }
    private var colorScheme: ColorScheme? {
        appearanceMode == "dark" ? .dark : appearanceMode == "light" ? .light : nil
    }

    var body: some View {
        TabView(selection: $state.selectedSection) {
            ForEach(LauncherSection.allCases) { section in
                Tab(section.titleKey, systemImage: section.systemImage, value: section) {
                    NavigationStack {
                        GeometryReader { proxy in
                            destination(for: section, width: proxy.size.width)
                                .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
                        }
                        .toolbar(.hidden, for: .navigationBar)
                    }
                    .background(LauncherPalette.background(colorScheme ?? systemColorScheme).ignoresSafeArea())
                }
            }
        }
        .tabViewStyle(.sidebarAdaptable)
        .tint(Color(hex: themeColorHex))
        .preferredColorScheme(colorScheme)
        .environment(\.locale, locale ?? Locale.current)
        .animation(reduceMotion ? nil : .easeInOut(duration: 0.35), value: appearanceMode)
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
