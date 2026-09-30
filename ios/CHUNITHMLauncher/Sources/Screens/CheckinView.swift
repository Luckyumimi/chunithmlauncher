import SwiftUI

struct CheckinView: View {
    @AppStorage("checkedInToday") private var checkedIn = false

    var body: some View {
        GeometryReader { proxy in
            VStack(alignment: .leading, spacing: 24) {
                SectionHeader("checkin.title", eyebrow: "checkin.eyebrow")
                Spacer(minLength: 10)
                GlassCard {
                    VStack(spacing: 22) {
                        Image(systemName: checkedIn ? "checkmark.seal.fill" : "sun.max.fill")
                            .font(.system(size: 64, weight: .bold))
                            .foregroundStyle(LauncherPalette.accent)
                        Text(LocalizedStringKey(checkedIn ? "checkin.done" : "checkin.prompt"))
                            .font(.title3.weight(.semibold))
                            .multilineTextAlignment(.center)
                        GlassActionButton { checkedIn = true } label: {
                            Text("checkin.action")
                                .frame(minWidth: 120, minHeight: 46)
                        }
                    }
                    .frame(width: min(420, max(260, proxy.size.width - 88)))
                    .frame(minHeight: 300)
                }
                .frame(maxWidth: .infinity)
                Spacer(minLength: 10)
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
            .padding(28)
        }
        .navigationTitle("nav.checkin")
    }
}
