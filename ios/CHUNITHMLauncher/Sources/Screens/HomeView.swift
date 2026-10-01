import SwiftUI

struct HomeView: View {
    @ObservedObject var state: AppState
    @ObservedObject private var prosekaLauncher: ProsekaLauncher
    @Environment(\.colorScheme) private var colorScheme
    @Environment(\.locale) private var locale
    let availableWidth: CGFloat

    init(state: AppState, availableWidth: CGFloat) {
        self.state = state
        self.availableWidth = availableWidth
        self._prosekaLauncher = ObservedObject(wrappedValue: state.prosekaLauncher)
    }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 26) {
                HStack(alignment: .center, spacing: 16) {
                    welcomeTitle
                        .font(.largeTitle.weight(.bold))
                        .lineLimit(1)
                        .minimumScaleFactor(0.8)
                        .layoutPriority(1)
                    Spacer(minLength: 8)
                    TopChrome()
                        .layoutPriority(1)
                }

                AdaptiveColumns(width: availableWidth,
                    leading: {
                        ContentCard(fillsAvailableHeight: true) {
                            VStack(alignment: .leading, spacing: 12) {
                                EventCarousel(state: state)
                                Text("home.announcement")
                                    .font(.headline.weight(.bold))
                                    .foregroundStyle(.primary)
                            }
                        }
                        .frame(maxWidth: .infinity, alignment: .topLeading)
                    },
                    trailing: {
                        ContentCard(fillsAvailableHeight: true) {
                            VStack(spacing: 0) {
                                Spacer(minLength: 8)

                                VStack(spacing: 12) {
                                    LocalImage("迪拉熊头像", contentMode: .fill)
                                        .frame(width: 118, height: 118)
                                        .clipShape(Circle())
                                        .overlay(Circle().stroke(LauncherPalette.accent, lineWidth: 4))
                                        .shadow(color: LauncherPalette.accent.opacity(0.24), radius: 16)

                                    VStack(spacing: 4) {
                                        Text("profile.name")
                                            .font(.title2.weight(.bold))
                                        Text("profile.handle")
                                            .font(.subheadline)
                                            .foregroundStyle(.secondary)
                                    }

                                    HStack(spacing: 8) {
                                        Image(systemName: "checkmark.circle.fill")
                                            .foregroundStyle(.green)
                                        Text("home.subscribed")
                                            .font(.subheadline.weight(.semibold))
                                    }
                                }
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 18)

                                Spacer(minLength: 20)

                                GlassActionButton(action: prosekaLauncher.launch) {
                                    Label("proseka.launch", systemImage: "play.fill")
                                        .frame(maxWidth: .infinity, minHeight: 48)
                                }
                                .background(LauncherPalette.accentGradient(), in: .capsule)
                                .tint(.white)
                            }
                            .padding(.vertical, 4)
                            .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)
                        }
                    }
                )

                LatestNewsCard(events: state.content.events)
            }
            .padding(28)
        }
        .background(LauncherPalette.backgroundGradient(colorScheme).ignoresSafeArea())
        .navigationTitle("nav.home")
        .alert("proseka.error.title", isPresented: Binding(get: { prosekaLauncher.lastError != nil }, set: { if !$0 { prosekaLauncher.clearError() } })) {
            Button("common.ok", role: .cancel) { prosekaLauncher.clearError() }
        } message: {
            Text(LocalizedStringKey(prosekaLauncher.lastError ?? "proseka.scheme.failed"))
        }
    }

    private var welcomeTitle: Text {
        let value = String(localized: "home.welcome", locale: locale)
        guard let range = value.range(of: "CHUNITHM") else {
            return Text(value)
        }

        return Text(String(value[..<range.lowerBound]))
            + Text("CHUNITHM").foregroundStyle(LauncherPalette.accent)
            + Text(String(value[range.upperBound...]))
    }
}

private struct LatestNewsCard: View {
    enum NewsTab: String, CaseIterable, Identifiable {
        case activity, announcement, information

        var id: String { rawValue }

        var titleKey: LocalizedStringKey {
            switch self {
            case .activity: return "news.tab.activity"
            case .announcement: return "news.tab.announcement"
            case .information: return "news.tab.information"
            }
        }
    }

    let events: [LauncherEvent]
    @State private var selectedTab: NewsTab = .activity

    private var visibleEvents: [LauncherEvent] {
        switch selectedTab {
        case .activity: return events
        case .announcement: return Array(events.prefix(2))
        case .information: return Array(events.dropFirst(1))
        }
    }

    var body: some View {
        ContentCard {
            VStack(alignment: .leading, spacing: 16) {
                HStack(alignment: .firstTextBaseline) {
                    VStack(alignment: .leading, spacing: 5) {
                        Text("news.latest.eyebrow")
                            .font(.caption.weight(.bold))
                            .tracking(1.4)
                            .foregroundStyle(.secondary)
                        Text("home.latest")
                            .font(.title.weight(.bold))
                    }
                    Spacer()
                    Button {
                        selectedTab = .information
                    } label: {
                        Label("news.viewAll", systemImage: "arrow.right")
                            .labelStyle(.titleAndIcon)
                            .font(.subheadline.weight(.semibold))
                    }
                    .buttonStyle(.plain)
                    .foregroundStyle(LauncherPalette.accent)
                }

                HStack(spacing: 22) {
                    ForEach(NewsTab.allCases) { tab in
                        Button {
                            withAnimation(.easeInOut(duration: 0.2)) {
                                selectedTab = tab
                            }
                        } label: {
                            Text(tab.titleKey)
                                .font(.subheadline.weight(tab == selectedTab ? .bold : .regular))
                                .foregroundStyle(tab == selectedTab ? .primary : .secondary)
                                .padding(.bottom, 8)
                                .overlay(alignment: .bottom) {
                                    Rectangle()
                                        .fill(LauncherPalette.accent)
                                        .frame(height: 3)
                                        .opacity(tab == selectedTab ? 1 : 0)
                                }
                        }
                        .buttonStyle(.plain)
                    }
                    Spacer(minLength: 0)
                }

                Divider()

                VStack(spacing: 0) {
                    ForEach(visibleEvents) { event in
                        HStack(alignment: .top, spacing: 16) {
                            VStack(alignment: .leading, spacing: 4) {
                                Text(LocalizedStringKey(event.titleKey))
                                    .font(.headline)
                                    .lineLimit(2)
                                Text(LocalizedStringKey(event.bodyKey))
                                    .font(.subheadline)
                                    .foregroundStyle(.secondary)
                                    .lineLimit(2)
                            }
                            Spacer(minLength: 12)
                            Text(event.date.components(separatedBy: " ").first ?? event.date)
                                .font(.subheadline.monospacedDigit())
                                .foregroundStyle(.secondary)
                        }
                        .padding(.vertical, 12)

                        if event.id != visibleEvents.last?.id {
                            Divider()
                        }
                    }
                }
            }
        }
    }
}
