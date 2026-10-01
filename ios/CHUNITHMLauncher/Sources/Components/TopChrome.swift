import SwiftUI

struct TopChrome: View {
    @Environment(\.openURL) private var openURL
    @AppStorage("allNetButtonText") private var allNetButtonText = "打开MuNET"
    @AppStorage("allNetURL") private var allNetURL = "https://portal.mumur.net/"

    var body: some View {
        GlassEffectContainer(spacing: 12) {
            HStack(spacing: 8) {
                Label("home.subscribed", systemImage: "circle.fill")
                    .foregroundStyle(.green)
                    .fixedSize(horizontal: true, vertical: false)
                    .frame(minHeight: 34)

                GlassActionButton(minHeight: 34, horizontalPadding: 11) {
                    openURL(URL(string: allNetURL) ?? ExternalLinks.munet)
                } label: {
                    Label(allNetButtonText, systemImage: "safari")
                        .lineLimit(1)
                        .fixedSize(horizontal: true, vertical: false)
                }
                .fixedSize(horizontal: true, vertical: false)

                GlassActionButton(minHeight: 34, horizontalPadding: 11) {
                    openURL(ExternalLinks.github)
                } label: {
                    Label("link.github", systemImage: "chevron.left.forwardslash.chevron.right")
                        .lineLimit(1)
                        .fixedSize(horizontal: true, vertical: false)
                }
                .fixedSize(horizontal: true, vertical: false)
            }
        }
        .fixedSize(horizontal: true, vertical: false)
        .font(.subheadline.weight(.semibold))
    }
}
