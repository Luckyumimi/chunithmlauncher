import SwiftUI

struct ActivitiesView: View {
    @ObservedObject var state: AppState

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                SectionHeader("activities.title", eyebrow: "activities.eyebrow")
                ForEach(state.content.events) { event in
                    GlassCard {
                        ViewThatFits(in: .horizontal) {
                            HStack(alignment: .top, spacing: 20) {
                                LocalImage(event.imageName).frame(width: 380, height: 220).clipShape(.rect(cornerRadius: 18))
                                activityCopy(event)
                            }
                            VStack(alignment: .leading, spacing: 16) {
                                LocalImage(event.imageName).frame(maxWidth: .infinity).clipShape(.rect(cornerRadius: 18))
                                activityCopy(event)
                            }
                        }
                    }
                }
            }
            .padding(28)
        }
        .navigationTitle("nav.activities")
    }

    @ViewBuilder
    private func activityCopy(_ event: LauncherEvent) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(event.date).font(.caption.weight(.bold)).foregroundStyle(.secondary)
            Text(LocalizedStringKey(event.titleKey)).font(.title.weight(.bold))
            Text(LocalizedStringKey(event.bodyKey)).foregroundStyle(.secondary)
            HStack { ForEach(event.tags, id: \.self) { Text(LocalizedStringKey($0)).font(.caption.weight(.semibold)).padding(.horizontal, 10).padding(.vertical, 7).background(.secondary.opacity(0.12), in: .capsule) } }
        }
    }
}
