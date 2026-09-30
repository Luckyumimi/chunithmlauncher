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
                        .toolbar {
                            ToolbarItemGroup(placement: .topBarLeading) {
                                Button {
                                    state.selectedSection = .settings
                                } label: {
                                    Image(systemName: "gearshape.fill")
                                }
                                .accessibilityLabel("nav.settings")

                                CheckinToolbarButton()
                            }
                            ToolbarItem(placement: .topBarTrailing) {
                                NavigationLink {
                                    ProfileView(state: state)
                                } label: {
                                    LocalImage("迪拉熊头像", contentMode: .fill)
                                        .frame(width: 34, height: 34)
                                        .clipShape(Circle())
                                }
                                .buttonStyle(.glass)
                                .accessibilityLabel("profile.title")
                            }
                        }
                    }
                    .background(LauncherPalette.backgroundGradient(colorScheme ?? systemColorScheme).ignoresSafeArea())
                }
            }
        }
        .tabViewStyle(.sidebarAdaptable)
        .contentToolbar(for: .tabViewSidebar) {
            Button {
                state.selectedSection = .settings
            } label: {
                Image(systemName: "gearshape.fill")
            }
            .accessibilityLabel("nav.settings")
        }
        .tabViewSidebarBottomBar {
            SidebarCheckinCard()
        }
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
        case .settings: SettingsView()
        }
    }
}

private struct CheckinToolbarButton: View {
    @AppStorage("checkedInToday") private var checkedIn = false

    var body: some View {
        Button {
            checkedIn = true
        } label: {
            Label(
                LocalizedStringKey(checkedIn ? "checkin.done" : "checkin.action"),
                systemImage: checkedIn ? "checkmark.circle.fill" : "checkmark.seal"
            )
        }
        .accessibilityLabel(LocalizedStringKey(checkedIn ? "checkin.done" : "checkin.action"))
    }
}

private struct SidebarCheckinCard: View {
    @AppStorage("checkedInToday") private var checkedIn = false

    var body: some View {
        Button {
            checkedIn = true
        } label: {
            HStack(spacing: 10) {
                Image(systemName: checkedIn ? "checkmark.circle.fill" : "sun.max.fill")
                    .foregroundStyle(checkedIn ? .green : LauncherPalette.accent)
                VStack(alignment: .leading, spacing: 2) {
                    Text("checkin.eyebrow")
                        .font(.caption2.weight(.bold))
                        .foregroundStyle(.secondary)
                    Text(LocalizedStringKey(checkedIn ? "checkin.done" : "checkin.action"))
                        .font(.subheadline.weight(.semibold))
                }
                Spacer(minLength: 4)
            }
            .frame(maxWidth: .infinity, alignment: .leading)
        }
        .buttonStyle(.glass)
        .tint(LauncherPalette.accent)
        .padding(.horizontal, 12)
        .padding(.vertical, 8)
    }
}

private struct ProfileView: View {
    @ObservedObject var state: AppState
    @Environment(\.colorScheme) private var colorScheme

    var body: some View {
        ScrollView {
            VStack(spacing: 22) {
                LocalImage("迪拉熊头像", contentMode: .fill)
                    .frame(width: 112, height: 112)
                    .clipShape(Circle())
                    .overlay(Circle().stroke(LauncherPalette.accent, lineWidth: 4))
                    .shadow(color: LauncherPalette.accent.opacity(0.25), radius: 16)

                VStack(spacing: 5) {
                    Text("profile.name")
                        .font(.title.weight(.bold))
                    Text("profile.handle")
                        .foregroundStyle(.secondary)
                }

                HStack(spacing: 12) {
                    ProfileStat(title: "profile.stat.rating", value: "15.78")
                    ProfileStat(title: "profile.stat.scores", value: "128")
                    ProfileStat(title: "profile.stat.events", value: "24")
                }

                ContentCard {
                    VStack(alignment: .leading, spacing: 12) {
                        Label("profile.about", systemImage: "person.text.rectangle")
                            .font(.headline)
                        Text("profile.bio")
                            .foregroundStyle(.secondary)
                            .fixedSize(horizontal: false, vertical: true)
                    }
                }
            }
            .frame(maxWidth: 720)
            .frame(maxWidth: .infinity)
            .padding(28)
        }
        .background(LauncherPalette.backgroundGradient(colorScheme).ignoresSafeArea())
        .navigationTitle("profile.title")
    }
}

private struct ProfileStat: View {
    let title: LocalizedStringKey
    let value: String

    var body: some View {
        VStack(spacing: 4) {
            Text(value)
                .font(.title3.weight(.bold))
            Text(title)
                .font(.caption)
                .foregroundStyle(.secondary)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 14)
        .background(.thinMaterial, in: .rect(cornerRadius: 18))
    }
}
