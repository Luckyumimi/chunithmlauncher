import SwiftUI

struct TopChrome: View {
    @ObservedObject var state: AppState
    @Environment(\.openURL) private var openURL

    var body: some View {
        GlassEffectContainer(spacing: 14) {
            HStack(spacing: 10) {
                Label("status.ready", systemImage: "circle.fill")
                    .foregroundStyle(.green)
                HStack(spacing: 8) {
                    LocalImage("迪拉熊头像", contentMode: .fill)
                        .frame(width: 30, height: 30)
                        .clipShape(Circle())
                    Text("account.demo")
                }
                .padding(.horizontal, 10)
                .frame(minHeight: 44)
                .background(.thinMaterial, in: .capsule)
                GlassActionButton { openURL(ExternalLinks.munet) } label: {
                    Label("link.munet", systemImage: "safari")
                }
                GlassActionButton { openURL(ExternalLinks.github) } label: {
                    Label("link.github", systemImage: "chevron.left.forwardslash.chevron.right")
                }
            }
        }
        .font(.subheadline.weight(.semibold))
    }
}
