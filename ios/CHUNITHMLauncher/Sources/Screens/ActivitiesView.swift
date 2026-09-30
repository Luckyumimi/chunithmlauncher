import SwiftUI

struct ActivitiesView: View {
    @ObservedObject var state: AppState
    @State private var detailEvent: LauncherEvent?

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                SectionHeader("activities.title", eyebrow: "activities.eyebrow")
                ForEach(state.content.events) { event in
                    GlassCard {
                        ViewThatFits(in: .horizontal) {
                            HStack(alignment: .top, spacing: 24) {
                                eventImage(event)
                                    .frame(width: 420, height: 250)
                                activityCopy(event)
                            }
                            VStack(alignment: .leading, spacing: 16) {
                                eventImage(event)
                                    .frame(maxWidth: .infinity, minHeight: 220, maxHeight: 300)
                                activityCopy(event)
                            }
                        }
                    }
                    .frame(maxWidth: .infinity, minHeight: 300, alignment: .topLeading)
                }
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(28)
        }
        .navigationTitle("nav.activities")
        .sheet(item: $detailEvent) { event in
            ActivityDetailView(event: event)
                .presentationDetents([.medium, .large])
        }
    }

    private func eventImage(_ event: LauncherEvent) -> some View {
        LocalImage(event.imageName, contentMode: .fit)
            .clipShape(.rect(cornerRadius: 18))
            .frame(maxWidth: .infinity)
            .clipped()
    }

    @ViewBuilder
    private func activityCopy(_ event: LauncherEvent) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(event.date).font(.caption.weight(.bold)).foregroundStyle(.secondary)
            Text(LocalizedStringKey(event.titleKey)).font(.title.weight(.bold))
            Text(LocalizedStringKey(event.bodyKey)).foregroundStyle(.secondary)
            HStack {
                ForEach(event.tags, id: \.self) {
                    Text(LocalizedStringKey($0))
                        .font(.caption.weight(.semibold))
                        .padding(.horizontal, 10)
                        .padding(.vertical, 7)
                        .background(.secondary.opacity(0.12), in: .capsule)
                }
            }
            GlassActionButton(action: { detailEvent = event }) {
                Label("activities.detail", systemImage: "arrow.up.right")
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }
}

private struct ActivityDetailView: View {
    let event: LauncherEvent

    var body: some View {
        NavigationStack {
            VStack(alignment: .leading, spacing: 18) {
                LocalImage(event.imageName)
                    .frame(maxWidth: .infinity, maxHeight: 320)
                    .clipShape(.rect(cornerRadius: 20))
                Text(LocalizedStringKey(event.titleKey)).font(.title.bold())
                Text(LocalizedStringKey(event.bodyKey)).foregroundStyle(.secondary)
                Spacer()
            }
            .padding(24)
            .navigationTitle("activities.detail")
        }
    }
}
