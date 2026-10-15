import SwiftUI

struct ShopView: View {
    @ObservedObject var state: AppState
    @State private var filter = "all"

    private let filters = ["all", "badge", "clothing", "desk"]

    private var filteredItems: [ShopItem] {
        state.content.shopItems.filter { filter == "all" || $0.category == filter }
    }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 22) {
                SectionHeader("shop.title", eyebrow: "shop.eyebrow")

                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 8) {
                        ForEach(filters, id: \.self) { value in
                            Button {
                                withAnimation(.snappy) {
                                    filter = value
                                }
                            } label: {
                                Text(filterTitleKey(value))
                                    .font(.subheadline.weight(.semibold))
                                    .foregroundStyle(filter == value ? .black : .primary)
                                    .padding(.horizontal, 16)
                                    .padding(.vertical, 9)
                                    .background(
                                        filter == value ? LauncherPalette.accent : Color.clear,
                                        in: Capsule()
                                    )
                            }
                            .buttonStyle(.plain)
                            .accessibilityLabel(Text(filterTitleKey(value)))
                            .accessibilityValue(Text(filter == value ? "Selected" : ""))
                        }
                    }
                }

                HStack(spacing: 8) {
                    Image(systemName: "square.grid.2x2")
                    Text("\(filteredItems.count) / \(state.content.shopItems.count)")
                    Text("shop.items")
                }
                .font(.caption.weight(.semibold))
                .foregroundStyle(.secondary)

                LazyVGrid(columns: [GridItem(.adaptive(minimum: 240), spacing: 18)], spacing: 18) {
                    ForEach(filteredItems) { item in
                        GlassCard {
                            VStack(alignment: .leading, spacing: 12) {
                                RoundedRectangle(cornerRadius: 18)
                                    .fill(Color(hex: item.colorHex))
                                    .frame(height: 140)
                                    .overlay {
                                        Image(systemName: symbolName(for: item))
                                            .font(.system(size: 44))
                                            .foregroundStyle(.white.opacity(0.86))
                                    }

                                Text(LocalizedStringKey(item.titleKey))
                                    .font(.headline)
                                Text(LocalizedStringKey(item.detailKey))
                                    .font(.subheadline)
                                    .foregroundStyle(.secondary)
                                Text(item.price ?? fallbackPrice(for: item.id))
                                    .font(.headline.weight(.bold))
                                    .foregroundStyle(LauncherPalette.accent)
                            }
                        }
                        .transition(.opacity.combined(with: .scale(scale: 0.98)))
                    }
                }
            }
            .padding(28)
            .animation(.snappy, value: filter)
        }
        .navigationTitle("nav.shop")
    }

    private func filterTitleKey(_ value: String) -> LocalizedStringKey {
        switch value {
        case "badge": return "shop.filter.badge"
        case "clothing": return "shop.filter.clothing"
        case "desk": return "shop.filter.desk"
        default: return "shop.filter.all"
        }
    }

    private func symbolName(for item: ShopItem) -> String {
        switch item.category {
        case "badge": return "seal.fill"
        case "clothing": return "tshirt.fill"
        case "desk": return "rectangle.3.group.fill"
        default: return "sparkles"
        }
    }

    private func fallbackPrice(for id: String) -> String {
        switch id {
        case "1": return "¥ 39"
        case "2": return "¥ 89"
        default: return "¥ 19"
        }
    }
}
