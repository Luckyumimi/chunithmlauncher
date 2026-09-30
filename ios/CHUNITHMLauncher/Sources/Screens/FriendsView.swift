import SwiftUI

struct FriendsView: View {
    @ObservedObject var state: AppState
    @State private var query = ""
    @Environment(\.colorScheme) private var colorScheme

    var filteredFriends: [Friend] {
        state.content.friends.filter { query.isEmpty || $0.name.localizedCaseInsensitiveContains(query) }
    }

    var body: some View {
        GeometryReader { proxy in
            ScrollView {
                VStack(alignment: .leading, spacing: 24) {
                    SectionHeader("friends.title", eyebrow: "friends.eyebrow")
                    ViewThatFits(in: .horizontal) {
                        HStack(alignment: .top, spacing: 24) {
                            activityFeed.frame(maxWidth: .infinity)
                            onlinePanel.frame(width: min(390, proxy.size.width * 0.38))
                        }
                        VStack(spacing: 24) {
                            activityFeed
                            onlinePanel
                        }
                    }
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(28)
            }
        }
        .navigationTitle("nav.friends")
    }

    private var activityFeed: some View {
        VStack(spacing: 12) {
            ContentCard {
                HStack(spacing: 14) {
                    avatar("A", color: "b9a22c")
                    VStack(alignment: .leading, spacing: 4) {
                        Text("ArcaeaPlayer").font(.headline)
                        Text("friend.activity.score").foregroundStyle(.secondary)
                    }
                    Spacer()
                    Text("15.78").font(.headline).foregroundStyle(LauncherPalette.accent)
                }
            }
            ContentCard {
                HStack(spacing: 14) {
                    avatar("M", color: "e2a0bd")
                    VStack(alignment: .leading, spacing: 4) {
                        Text("Mira").font(.headline)
                        Text("friend.activity.profile").foregroundStyle(.secondary)
                    }
                    Spacer()
                    GlassActionButton { } label: { Text("friends.profile") }
                }
            }
        }
    }

    private var onlinePanel: some View {
        ContentCard {
            VStack(alignment: .leading, spacing: 16) {
                HStack {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("friends.eyebrow").font(.caption.weight(.bold)).tracking(1.3).foregroundStyle(.secondary)
                        Text("friends.online").font(.title2.bold())
                    }
                    Spacer()
                    Text("3 人在线").font(.caption).foregroundStyle(.secondary)
                }
                HStack(spacing: 8) {
                    Image(systemName: "magnifyingglass")
                    TextField("friends.search", text: $query)
                }
                .padding(12)
                .background(LauncherPalette.control(colorScheme), in: .rect(cornerRadius: 14))
                ForEach(filteredFriends) { friend in
                    HStack(spacing: 12) {
                        avatar(friend.initial, color: friend.colorHex)
                        VStack(alignment: .leading, spacing: 3) {
                            Text(friend.name).font(.headline)
                            Text(LocalizedStringKey(friend.activityKey)).font(.caption).foregroundStyle(.secondary)
                        }
                        Spacer()
                        Circle().fill(.green).frame(width: 10, height: 10)
                    }
                    .padding(.vertical, 8)
                    if friend.id != filteredFriends.last?.id { Divider() }
                }
            }
        }
    }

    private func avatar(_ text: String, color: String) -> some View {
        Text(text)
            .font(.title3.weight(.bold))
            .frame(width: 44, height: 44)
            .background(Color(hex: color), in: .rect(cornerRadius: 14))
    }
}
