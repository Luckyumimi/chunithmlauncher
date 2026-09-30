import SwiftUI

struct AimeView: View {
    @ObservedObject var state: AppState
    @Environment(\.openURL) private var openURL

    var body: some View {
        GeometryReader { proxy in
            VStack(alignment: .leading, spacing: 24) {
                SectionHeader("aime.title", eyebrow: "aime.eyebrow")
                ViewThatFits(in: .horizontal) {
                    HStack(alignment: .center, spacing: 34) {
                        aimeImage
                            .frame(width: min(820, proxy.size.width * 0.62), height: min(560, proxy.size.height * 0.66))
                        steps
                    }
                    VStack(alignment: .leading, spacing: 22) {
                        aimeImage.frame(maxWidth: .infinity, maxHeight: 360)
                        steps
                    }
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
            .padding(28)
        }
        .navigationTitle("nav.aime")
    }

    private var aimeImage: some View {
        LocalImage("nfc-aime-reader", contentMode: .fit)
            .clipShape(.rect(cornerRadius: 24))
    }

    private var steps: some View {
        VStack(alignment: .leading, spacing: 18) {
            ForEach(state.content.aimeSteps) { step in
                HStack(alignment: .top, spacing: 12) {
                    Text(step.number)
                        .font(.caption.weight(.black))
                        .foregroundStyle(LauncherPalette.accent)
                    VStack(alignment: .leading, spacing: 4) {
                        Text(LocalizedStringKey(step.titleKey)).font(.headline)
                        Text(LocalizedStringKey(step.detailKey))
                            .font(.subheadline)
                            .foregroundStyle(.secondary)
                    }
                }
            }
            GlassActionButton { openURL(ExternalLinks.aime) } label: {
                Label("aime.open", systemImage: "arrow.up.right")
                    .frame(minWidth: 180, minHeight: 48)
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }
}
