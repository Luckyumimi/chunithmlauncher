import SwiftUI

struct EventCarousel: View {
    @ObservedObject var state: AppState
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    var body: some View {
        TabView(selection: $state.selectedEventID) {
            ForEach(state.content.events) { event in
                VStack(alignment: .leading, spacing: 14) {
                    LocalImage(event.imageName, contentMode: .fit)
                        .frame(maxWidth: .infinity)
                        .clipShape(.rect(cornerRadius: 24))
                    Text(LocalizedStringKey(event.titleKey))
                        .font(.title2.weight(.bold))
                        .lineLimit(2)
                    Text(LocalizedStringKey(event.bodyKey))
                        .foregroundStyle(.secondary)
                        .lineLimit(3)
                    HStack {
                        Label(event.date, systemImage: "calendar")
                        Spacer()
                        Text(event.id.uppercased()).font(.caption.weight(.bold)).foregroundStyle(.secondary)
                    }
                    .font(.subheadline.weight(.semibold))
                    .foregroundStyle(.secondary)
                }
                .tag(event.id)
                .padding(.horizontal, 4)
            }
        }
        .frame(minHeight: 360)
        .tabViewStyle(.page(indexDisplayMode: .automatic))
        .animation(reduceMotion ? nil : .snappy, value: state.selectedEventID)
    }
}
