import SwiftUI

struct CheckinView: View {
    @AppStorage("checkedInToday") private var checkedIn = false
    @State private var showSuccess = false

    var body: some View {
        GeometryReader { proxy in
            VStack(alignment: .leading, spacing: 24) {
                SectionHeader("checkin.title", eyebrow: "checkin.eyebrow")
                Spacer(minLength: 10)
                GlassCard {
                    VStack(spacing: 22) {
                        Image(systemName: checkedIn ? "checkmark.seal.fill" : "sun.max.fill")
                            .font(.system(size: 64, weight: .bold))
                            .foregroundStyle(checkedIn ? .green : LauncherPalette.accent)
                            .symbolEffect(.bounce, value: checkedIn)

                        Text(LocalizedStringKey(checkedIn ? "checkin.done" : "checkin.prompt"))
                            .font(.title3.weight(.semibold))
                            .multilineTextAlignment(.center)

                        if checkedIn && showSuccess {
                            HStack(spacing: 10) {
                                Image(systemName: "gift.fill")
                                    .foregroundStyle(LauncherPalette.accent)
                                VStack(alignment: .leading, spacing: 3) {
                                    Text("checkin.success")
                                        .font(.headline)
                                    Text("checkin.reward")
                                        .font(.subheadline)
                                        .foregroundStyle(.secondary)
                                }
                                Spacer(minLength: 0)
                            }
                            .padding(14)
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .background(.thinMaterial, in: .rect(cornerRadius: 16))
                            .transition(.move(edge: .bottom).combined(with: .opacity))
                        }

                        GlassActionButton {
                            guard !checkedIn else { return }
                            withAnimation(.spring(response: 0.42, dampingFraction: 0.78)) {
                                checkedIn = true
                                showSuccess = true
                            }
                        } label: {
                            Text(LocalizedStringKey(checkedIn ? "checkin.done" : "checkin.action"))
                                .frame(minWidth: 120, minHeight: 46)
                        }
                        .disabled(checkedIn)
                        .opacity(checkedIn ? 0.72 : 1)
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
        .onAppear {
            showSuccess = checkedIn
        }
    }
}
