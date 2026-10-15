import Foundation

enum ContentStore {
    static func load() -> LauncherContent {
        guard let url = Bundle.main.url(forResource: "content", withExtension: "json"),
              let data = try? Data(contentsOf: url),
              let content = try? JSONDecoder().decode(LauncherContent.self, from: data) else {
            return fallback
        }
        return content
    }

    private static let fallback = LauncherContent(
        events: [
            LauncherEvent(id: "doki", date: "09.25 — 10.06", titleKey: "event.doki.title", bodyKey: "event.doki.body", detailKey: "event.doki.detail", imageName: "event-doki", tags: ["event.tag.character", "event.tag.nameplate", "event.tag.stage"]),
            LauncherEvent(id: "songs", date: "09.25", titleKey: "event.songs.title", bodyKey: "event.songs.body", detailKey: "event.songs.detail", imageName: "event-songs", tags: ["event.tag.music", "event.tag.update"])
        ],
        friends: [
            Friend(id: "arcaea", name: "ArcaeaPlayer", initial: "A", activityKey: "friend.arcaea", colorHex: "b9a22c"),
            Friend(id: "mira", name: "Mira", initial: "M", activityKey: "friend.mira", colorHex: "e2a0bd"),
            Friend(id: "kuro", name: "KuroNeko", initial: "K", activityKey: "friend.kuro", colorHex: "85bfd0")
        ],
        scores: [
            ScoreEntry(id: "1", title: "World Vanquisher", difficulty: "MASTER 14+", rating: "15.78", status: "SSS", imageName: "rating-world"),
            ScoreEntry(id: "2", title: "Your Reality", difficulty: "EXPERT 12", rating: "14.26", status: "SS", imageName: "rating-your"),
            ScoreEntry(id: "3", title: "LaVI-Bavellabion", difficulty: "MASTER 13+", rating: "13.91", status: "S+ ", imageName: "rating-lavi")
        ],
        shopItems: [
            ShopItem(id: "1", titleKey: "shop.card", detailKey: "shop.card.detail", colorHex: "f2bb68", category: "badge", price: "¥ 39"),
            ShopItem(id: "2", titleKey: "shop.nameplate", detailKey: "shop.nameplate.detail", colorHex: "8fb8d6", category: "clothing", price: "¥ 89"),
            ShopItem(id: "3", titleKey: "shop.stage", detailKey: "shop.stage.detail", colorHex: "cc8eb3", category: "desk", price: "¥ 19"),
            ShopItem(id: "4", titleKey: "shop.placeholder", detailKey: "shop.placeholder.detail", colorHex: "e69c83", category: "badge", price: "¥ 49"),
            ShopItem(id: "5", titleKey: "shop.placeholder", detailKey: "shop.placeholder.detail", colorHex: "d3a5e6", category: "badge", price: "¥ 59"),
            ShopItem(id: "6", titleKey: "shop.placeholder", detailKey: "shop.placeholder.detail", colorHex: "7fc6c3", category: "clothing", price: "¥ 69"),
            ShopItem(id: "7", titleKey: "shop.placeholder", detailKey: "shop.placeholder.detail", colorHex: "f1a8bd", category: "clothing", price: "¥ 79"),
            ShopItem(id: "8", titleKey: "shop.placeholder", detailKey: "shop.placeholder.detail", colorHex: "91b6ed", category: "desk", price: "¥ 29"),
            ShopItem(id: "9", titleKey: "shop.placeholder", detailKey: "shop.placeholder.detail", colorHex: "b6c983", category: "desk", price: "¥ 39")
        ],
        aimeSteps: [
            AimeStep(id: "1", number: "01", titleKey: "aime.step.install", detailKey: "aime.step.install.detail"),
            AimeStep(id: "2", number: "02", titleKey: "aime.step.nfc", detailKey: "aime.step.nfc.detail"),
            AimeStep(id: "3", number: "03", titleKey: "aime.step.connect", detailKey: "aime.step.connect.detail")
        ]
    )
}
