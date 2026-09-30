import SwiftUI

struct AimeView: View {
    @ObservedObject var state: AppState
    @Environment(\.openURL) private var openURL

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                SectionHeader("aime.title", eyebrow: "aime.eyebrow")
                ViewThatFits(in: .horizontal) {
                    HStack(alignment: .top, spacing: 28) {
                        aimeImage.frame(maxWidth: 520).clipShape(.rect(cornerRadius: 24))
                        steps
                    }
                    VStack(alignment: .leading, spacing: 24) {
                        aimeImage
                        steps
                    }
                }
            }
            .padding(28)
        }
        .navigationTitle("nav.aime")
    }

    private var aimeImage: some View {
        LocalImage("nfc-aime-reader", contentMode: .fit)
            .frame(minHeight: 240, maxHeight: 520)
            .clipShape(.rect(cornerRadius: 24))
    }

    private var steps: some View {
        VStack(alignment: .leading, spacing: 14) {
                        ForEach(state.content.aimeSteps) { step in
                            HStack(alignment: .top, spacing: 12) {
                                Text(step.number).font(.caption.weight(.black)).foregroundStyle(Color(hex: "fdd500"))
                                VStack(alignment: .leading) { Text(LocalizedStringKey(step.titleKey)).font(.headline); Text(LocalizedStringKey(step.detailKey)).font(.subheadline).foregroundStyle(.secondary) }
                            }
                        }
                        GlassActionButton { openURL(ExternalLinks.aime) } label: { Label("aime.open", systemImage: "arrow.up.right") }
        }
    }
}
