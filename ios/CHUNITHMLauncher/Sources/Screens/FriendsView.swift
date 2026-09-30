import SwiftUI

struct FriendsView: View {
    @ObservedObject var state: AppState
    @State private var query = ""

    var filteredFriends: [Friend] { state.content.friends.filter { query.isEmpty || $0.name.localizedCaseInsensitiveContains(query) } }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                SectionHeader("friends.title", eyebrow: "friends.eyebrow")
                GlassCard {
                    VStack(spacing: 0) {
                        HStack { Image(systemName: "magnifyingglass"); TextField("friends.search", text: $query) }
                            .padding(12).background(.secondary.opacity(0.12), in: .rect(cornerRadius: 14))
                        ForEach(filteredFriends) { friend in
                            HStack(spacing: 14) {
                                Text(friend.initial).font(.title3.weight(.bold)).frame(width: 44, height: 44).background(Color(hex: friend.colorHex), in: .rect(cornerRadius: 14))
                                VStack(alignment: .leading) { Text(friend.name).font(.headline); Text(LocalizedStringKey(friend.activityKey)).font(.subheadline).foregroundStyle(.secondary) }
                                Spacer(); Circle().fill(.green).frame(width: 10, height: 10)
                            }
                            .padding(.vertical, 12)
                            if friend.id != filteredFriends.last?.id { Divider() }
                        }
                    }
                }
            }
            .padding(28)
        }
        .navigationTitle("nav.friends")
    }
}

