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
                    TopChrome(state: state)
                }

                AdaptiveColumns(width: availableWidth,
                    leading: {
                        GlassCard { EventCarousel(state: state) }
                    },
                    trailing: {
                        VStack(alignment: .leading, spacing: 18) {
                            ContentCard {
                                VStack(alignment: .leading, spacing: 14) {
                                    Text("home.target").font(.caption.weight(.bold)).foregroundStyle(.secondary)
                                    Text("1920×1080 @ 120Hz").font(.title2.weight(.bold))
                                    Divider()
                                    Label("home.ready", systemImage: "checkmark.circle.fill").foregroundStyle(.green)
                                }
                            }
                            GlassActionButton(action: prosekaLauncher.launch) {
                                Label("proseka.launch", systemImage: "play.fill")
                                    .frame(maxWidth: .infinity)
                            }
                            .tint(LauncherPalette.accent)
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
