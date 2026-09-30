import SwiftUI

struct TopChrome: View {
    @Environment(\.openURL) private var openURL
    @AppStorage("allNetButtonText") private var allNetButtonText = "打开MuNET"
    @AppStorage("allNetURL") private var allNetURL = "https://portal.mumur.net/"

    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            GlassEffectContainer(spacing: 12) {
                HStack(spacing: 10) {
                Label("status.ready", systemImage: "circle.fill")
                    .foregroundStyle(.green)
                    .frame(minWidth: 86, minHeight: 44)
                GlassActionButton { openURL(URL(string: allNetURL) ?? ExternalLinks.munet) } label: {
                    Label(allNetButtonText, systemImage: "safari")
                        .lineLimit(1)
                        .minimumScaleFactor(0.72)
                }
                .frame(width: 96)
                GlassActionButton { openURL(ExternalLinks.github) } label: {
                    Label("link.github", systemImage: "chevron.left.forwardslash.chevron.right")
                        .lineLimit(1)
                        .minimumScaleFactor(0.72)
                }
                .frame(width: 96)
            }
        }
        .padding(.horizontal, 2)
        .font(.subheadline.weight(.semibold))
    }
}
}
