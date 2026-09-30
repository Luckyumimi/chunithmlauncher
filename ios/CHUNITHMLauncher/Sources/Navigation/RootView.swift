import SwiftUI

struct RootView: View {
    @StateObject private var state = AppState()
    @AppStorage("languageOverride") private var languageOverride = "system"
    @AppStorage("appearanceMode") private var appearanceMode = "system"
    @AppStorage("themeColorHex") private var themeColorHex = "fdd500"
    @State private var columnVisibility: NavigationSplitViewVisibility = .all
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @Environment(\.colorScheme) private var systemColorScheme

    private var locale: Locale? { languageOverride == "system" ? nil : Locale(identifier: languageOverride) }
    private var colorScheme: ColorScheme? {
        appearanceMode == "dark" ? .dark : appearanceMode == "light" ? .light : nil
    }

    var body: some View {
        NavigationSplitView(columnVisibility: $columnVisibility) {
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
                    VStack(spacing: 0) {
                        DetailChrome(
                            selectedSection: state.selectedSection,
                            columnVisibility: $columnVisibility,
                            onSettings: { state.selectedSection = .settings },
                            onCheckin: { state.selectedSection = .checkin },
                            onSelect: { state.selectedSection = $0 }
                        )
                        destination(for: state.selectedSection, width: proxy.size.width)
                            .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
                    }
                    .toolbar(.hidden, for: .navigationBar)
                }
                .background(LauncherPalette.background(colorScheme ?? systemColorScheme).ignoresSafeArea())
            }
        }
        .navigationSplitViewStyle(.balanced)
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

private struct DetailChrome: View {
    let selectedSection: LauncherSection
    @Binding var columnVisibility: NavigationSplitViewVisibility
    let onSettings: () -> Void
    let onCheckin: () -> Void
    let onSelect: (LauncherSection) -> Void

    var body: some View {
        ZStack {
            Text(selectedSection.titleKey)
                .font(.title2.weight(.bold))
                .lineLimit(1)
            HStack {
                GlassActionButton(action: onSettings) {
                    Image(systemName: "gearshape.fill")
                        .frame(width: 44, height: 44)
                }
                .accessibilityLabel("nav.settings")
                Spacer()
                GlassActionButton(action: onCheckin) {
                    Label("nav.checkin", systemImage: "checkmark.seal.fill")
                        .frame(minWidth: 110, minHeight: 44)
                }
            }
        }
        .padding(.horizontal, 24)
        .padding(.vertical, 10)
        .frame(maxWidth: .infinity)
        .background(.ultraThinMaterial)
        .overlay(alignment: .bottom) {
            if columnVisibility != .all {
                CompactSectionBar(selectedSection: selectedSection, onSelect: onSelect)
                    .offset(y: 44)
            }
        }
        .padding(.bottom, columnVisibility == .all ? 0 : 44)
    }
}

private struct CompactSectionBar: View {
    let selectedSection: LauncherSection
    let onSelect: (LauncherSection) -> Void

    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 6) {
                ForEach(LauncherSection.allCases.filter { $0 != .checkin && $0 != .settings }) { section in
                    Button { onSelect(section) } label: {
                        Text(section.titleKey)
                            .font(.subheadline.weight(section == selectedSection ? .bold : .medium))
                            .foregroundStyle(section == selectedSection ? Color.primary : Color.secondary)
                            .padding(.horizontal, 14)
                            .padding(.vertical, 8)
                            .background(section == selectedSection ? LauncherPalette.accent.opacity(0.22) : .clear, in: .capsule)
                    }
                    .buttonStyle(.plain)
                }
            }
            .padding(.horizontal, 18)
        }
        .frame(maxWidth: .infinity)
        .background(.thinMaterial, in: .capsule)
        .padding(.horizontal, 24)
    }
}
