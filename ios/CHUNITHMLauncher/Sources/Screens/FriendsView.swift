import SwiftUI

struct FriendsView: View {
    @ObservedObject var state: AppState
    @State private var query = ""
    @State private var selectedFriend: Friend?
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
        .sheet(item: $selectedFriend) { friend in
            NavigationStack {
                FriendProfileView(friend: friend)
            }
        }
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
                    GlassActionButton {
                        selectedFriend = state.content.friends.first(where: { $0.id == "mira" })
                    } label: {
                        Text("friends.profile")
                    }
                }
            }
        }
    }

    private var onlinePanel: some View {
        ContentCard {
            VStack(alignment: .leading, spacing: 16) {
                HStack {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("friends.eyebrow")
                            .font(.caption.weight(.bold))
                            .tracking(1.3)
                            .foregroundStyle(.secondary)
                        Text("friends.online")
                            .font(.title2.bold())
                    }
                    Spacer()
                    Text("3 人在线")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
                HStack(spacing: 8) {
                    Image(systemName: "magnifyingglass")
                    TextField("friends.search", text: $query)
                }
                .padding(12)
                .glassEffect(.regular, in: .rect(cornerRadius: 14))
                .animation(.easeInOut(duration: 0.35), value: colorScheme)
                ForEach(filteredFriends) { friend in
                    HStack(spacing: 12) {
                        avatar(friend.initial, color: friend.colorHex)
                        VStack(alignment: .leading, spacing: 3) {
                            Text(friend.name).font(.headline)
                            Text(LocalizedStringKey(friend.activityKey))
                                .font(.caption)
                                .foregroundStyle(.secondary)
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

private struct FriendProfileView: View {
    let friend: Friend
    @Environment(\.colorScheme) private var colorScheme

    var body: some View {
        ScrollView {
            VStack(spacing: 22) {
                Text(friend.initial)
                    .font(.system(size: 44, weight: .bold))
                    .foregroundStyle(.white)
                    .frame(width: 112, height: 112)
                    .background(Color(hex: friend.colorHex), in: Circle())
                    .overlay(Circle().stroke(LauncherPalette.accent, lineWidth: 4))
                    .shadow(color: LauncherPalette.accent.opacity(0.25), radius: 16)

                VStack(spacing: 6) {
                    Text(friend.name)
                        .font(.title.weight(.bold))
                    Text("friend.mira.handle")
                        .foregroundStyle(.secondary)
                    Label("friend.mira.online", systemImage: "circle.fill")
                        .font(.caption.weight(.semibold))
                        .foregroundStyle(.green)
                }

                HStack(spacing: 12) {
                    FriendProfileStat(title: "profile.stat.rating", value: "14.92")
                    FriendProfileStat(title: "profile.stat.scores", value: "86")
                    FriendProfileStat(title: "profile.stat.events", value: "12")
                }

                ContentCard {
                    VStack(alignment: .leading, spacing: 12) {
                        Label("friend.mira.about", systemImage: "person.text.rectangle")
                            .font(.headline)
                        Text("friend.mira.bio")
                            .foregroundStyle(.secondary)
                            .fixedSize(horizontal: false, vertical: true)
                    }
                }

                ContentCard {
                    VStack(alignment: .leading, spacing: 12) {
                        Label("friend.mira.recent", systemImage: "music.note.list")
                            .font(.headline)
                        HStack {
                            VStack(alignment: .leading, spacing: 4) {
                                Text("Your Reality")
                                    .font(.headline)
                                Text("EXPERT 12")
                                    .font(.caption)
                                    .foregroundStyle(.secondary)
                            }
                            Spacer()
                            Text("SS")
                                .font(.title3.weight(.bold))
                                .foregroundStyle(LauncherPalette.accent)
                        }
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

private struct FriendProfileStat: View {
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