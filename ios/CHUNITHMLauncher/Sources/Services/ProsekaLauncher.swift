import Foundation
import UIKit
import Combine

@MainActor
final class ProsekaLauncher: ObservableObject {
    @Published private(set) var lastError: String?

    private let scheme: String

    var isConfigured: Bool {
        !scheme.isEmpty && !scheme.contains("$(") && URL(string: scheme)?.scheme != nil
    }

    init() {
        scheme = Bundle.main.object(forInfoDictionaryKey: "ProsekaURLScheme") as? String ?? ""
    }

    func launch() {
        lastError = nil
        guard !scheme.isEmpty, !scheme.contains("$("), let url = URL(string: scheme), url.scheme != nil else {
            lastError = "proseka.scheme.missing"
            return
        }
        UIApplication.shared.open(url, options: [:]) { [weak self] success in
            guard !success else { return }
            Task { @MainActor in self?.lastError = "proseka.scheme.failed" }
        }
    }

    func clearError() {
        lastError = nil
    }
}
