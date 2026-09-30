import SwiftUI

struct RatingView: View {
    @ObservedObject var state: AppState

    var body: some View {
        List {
            Section { GlassCard { HStack { Text("rating.current"); Spacer(); Text("15.78").font(.system(size: 42, weight: .black, design: .rounded)).foregroundStyle(Color(hex: "fdd500")) } } }
            Section("rating.recent") {
                ForEach(state.content.scores) { score in
                    HStack {
                        VStack(alignment: .leading) { Text(score.title).font(.headline); Text(score.difficulty).font(.caption).foregroundStyle(.secondary) }
                        Spacer()
                        VStack(alignment: .trailing) { Text(score.rating).font(.headline); Text(score.status).font(.caption.weight(.bold)).foregroundStyle(Color(hex: "fdd500")) }
                    }
                    .padding(.vertical, 8)
                }
            }
        }
        .scrollContentBackground(.hidden)
        .padding(18)
        .navigationTitle("nav.rating")
    }
}

