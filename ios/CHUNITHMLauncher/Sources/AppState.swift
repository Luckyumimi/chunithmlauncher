import SwiftUI

@MainActor
final class AppState: ObservableObject {
    @Published var selectedSection: LauncherSection = .home
    @Published var isProfilePresented = false
    @Published var isSettingsPresented = false
    @Published var content: LauncherContent
    @Published var selectedEventID: String
    let prosekaLauncher = ProsekaLauncher()

    init() {
        let content = ContentStore.load()
        self.content = content
        self.selectedEventID = content.events.first?.id ?? "doki"
    }

    var selectedEvent: LauncherEvent? {
        content.events.first(where: { $0.id == selectedEventID }) ?? content.events.first
    }
}
