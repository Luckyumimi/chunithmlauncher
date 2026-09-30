import SwiftUI

struct RatingView: View {
    @ObservedObject var state: AppState

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 22) {
                ContentCard {
                    HStack(alignment: .center) {
                        VStack(alignment: .leading, spacing: 5) {
                            Text("rating.current").font(.headline)
                            Text("15.78")
                                .font(.system(size: 48, weight: .black, design: .rounded))
                                .foregroundStyle(LauncherPalette.accent)
                        }
                        Spacer()
                        Image(systemName: "chart.line.uptrend.xyaxis")
                            .font(.system(size: 42, weight: .bold))
                            .foregroundStyle(LauncherPalette.accent)
                    }
                }
                SectionHeader("rating.recent")
                LazyVStack(spacing: 14) {
                    ForEach(state.content.scores) { score in
                        ContentCard {
                            HStack(spacing: 16) {
                                LocalImage(score.imageName ?? "", contentMode: .fill)
                                    .frame(width: 104, height: 104)
                                    .clipShape(.rect(cornerRadius: 16))
                                VStack(alignment: .leading, spacing: 8) {
                                    Text(score.title).font(.headline)
                                    Text(score.difficulty).font(.caption).foregroundStyle(.secondary)
                                    Text(score.status).font(.caption.weight(.bold)).foregroundStyle(LauncherPalette.accent)
                                }
                                Spacer()
                                Text(score.rating)
                                    .font(.title2.weight(.black))
                                    .foregroundStyle(LauncherPalette.accent)
                            }
                        }
                    }
                }
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(28)
        }
        .navigationTitle("nav.rating")
    }
}
