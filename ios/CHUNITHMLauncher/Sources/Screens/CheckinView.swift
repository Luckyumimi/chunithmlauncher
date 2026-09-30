import SwiftUI

struct CheckinView: View {
    @State private var checkedIn = false

    var body: some View {
        VStack(spacing: 24) {
            SectionHeader("checkin.title", eyebrow: "checkin.eyebrow")
            GlassCard {
                VStack(spacing: 18) {
                    Image(systemName: checkedIn ? "checkmark.seal.fill" : "sun.max.fill").font(.system(size: 58)).foregroundStyle(Color(hex: "fdd500"))
                    Text(LocalizedStringKey(checkedIn ? "checkin.done" : "checkin.prompt")).font(.title3.weight(.semibold))
                    GlassActionButton { checkedIn = true } label: { Text("checkin.action") }
                }
            }
            Spacer()
        }
        .padding(28)
        .navigationTitle("nav.checkin")
    }
}
