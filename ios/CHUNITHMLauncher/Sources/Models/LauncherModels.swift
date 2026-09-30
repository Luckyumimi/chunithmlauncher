import Foundation
import SwiftUI

struct LauncherContent: Codable {
    var events: [LauncherEvent]
    var friends: [Friend]
    var scores: [ScoreEntry]
    var shopItems: [ShopItem]
    var aimeSteps: [AimeStep]
}

struct LauncherEvent: Codable, Identifiable {
    let id: String
    let date: String
    let titleKey: String
    let bodyKey: String
    let imageName: String
    let tags: [String]
}

struct Friend: Codable, Identifiable {
    let id: String
    let name: String
    let initial: String
    let activityKey: String
    let colorHex: String
}

struct ScoreEntry: Codable, Identifiable {
    let id: String
    let title: String
    let difficulty: String
    let rating: String
    let status: String
    let imageName: String?
}

struct ShopItem: Codable, Identifiable {
    let id: String
    let titleKey: String
    let detailKey: String
    let colorHex: String
    let category: String?
}

struct AimeStep: Codable, Identifiable {
    let id: String
    let number: String
    let titleKey: String
    let detailKey: String
}

enum LauncherSection: String, CaseIterable, Hashable, Identifiable {
    case home, activities, rating, shop, friends, aime, checkin, settings

    var id: String { rawValue }

    var titleKey: LocalizedStringKey {
        switch self {
        case .home: return "nav.home"
        case .activities: return "nav.activities"
        case .rating: return "nav.rating"
        case .shop: return "nav.shop"
        case .friends: return "nav.friends"
        case .aime: return "nav.aime"
        case .checkin: return "nav.checkin"
        case .settings: return "nav.settings"
        }
    }

    var systemImage: String {
        switch self {
        case .home: return "house.fill"
        case .activities: return "sparkles"
        case .rating: return "chart.line.uptrend.xyaxis"
        case .shop: return "bag.fill"
        case .friends: return "person.2.fill"
        case .aime: return "wave.3.right.circle"
        case .checkin: return "checkmark.seal.fill"
        case .settings: return "gearshape.fill"
        }
    }
}
