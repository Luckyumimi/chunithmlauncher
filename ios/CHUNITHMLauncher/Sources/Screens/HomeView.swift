import SwiftUI

struct HomeView: View {
    @ObservedObject var state: AppState
    @ObservedObject private var prosekaLauncher: ProsekaLauncher
    let availableWidth: CGFloat

    init(state: AppState, availableWidth: CGFloat) {
        self.state = state
        self.availableWidth = availableWidth
        self._prosekaLauncher = ObservedObject(wrappedValue: state.prosekaLauncher)
    }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 26) {
                HStack(alignment: .firstTextBaseline) {
                    VStack(alignment: .leading, spacing: 5) {
                        Text("home.welcome").font(.largeTitle.weight(.bold))
                        Text("home.subtitle").foregroundStyle(.secondary)
                    }
                    Spacer()
                    TopChrome()
                }

                AdaptiveColumns(width: availableWidth,
                    leading: {
                        GlassCard {
                            VStack(alignment: .leading, spacing: 12) {
                                EventCarousel(state: state)
                                Text("home.announcement")
                                    .font(.headline.weight(.bold))
                                    .foregroundStyle(.primary)
                            }
                        }
                    },
                    trailing: {
                        ContentCard {
                            VStack(alignment: .leading, spacing: 16) {
                                HStack(spacing: 12) {
                                    LocalImage("迪拉熊头像", contentMode: .fill)
                                        .frame(width: 52, height: 52)
                                        .clipShape(Circle())
                                    VStack(alignment: .leading, spacing: 3) {
                                        Text("account.demo").font(.headline)
                                        Text("home.welcome").font(.title3.weight(.bold))
                                    }
                                }
                                Divider()
                                Label("home.ready", systemImage: "checkmark.circle.fill")
                                    .foregroundStyle(.green)
                                Spacer(minLength: 12)
                                GlassActionButton(action: prosekaLauncher.launch) {
                                    Label("proseka.launch", systemImage: "play.fill")
                                        .frame(maxWidth: .infinity, minHeight: 48)
                                }
                                .tint(LauncherPalette.accent)
                            }
                            .frame(maxWidth: .infinity, minHeight: 410, alignment: .topLeading)
                        }
                    }
                )

                GlassCard {
                    VStack(alignment: .leading, spacing: 15) {
                        Text("home.latest").font(.title2.weight(.bold))
                        Divider()
                        Label("news.activity", systemImage: "sparkles")
                        Label("news.score", systemImage: "chart.line.uptrend.xyaxis")
                    }
                }
            }
            .padding(28)
        }
        .navigationTitle("nav.home")
        .alert("proseka.error.title", isPresented: Binding(get: { prosekaLauncher.lastError != nil }, set: { if !$0 { prosekaLauncher.clearError() } })) {
            Button("common.ok", role: .cancel) { prosekaLauncher.clearError() }
        } message: {
            Text(LocalizedStringKey(prosekaLauncher.lastError ?? "proseka.scheme.failed"))
        }
    }
}
