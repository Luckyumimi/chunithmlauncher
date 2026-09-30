import SwiftUI

struct ShopView: View {
    @ObservedObject var state: AppState
    @State private var filter = "all"

    private let filters = ["all", "badge", "clothing", "desk"]

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 22) {
                SectionHeader("shop.title", eyebrow: "shop.eyebrow")
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 8) {
                        ForEach(filters, id: \.self) { value in
                            Button {
                                withAnimation(.snappy) { filter = value }
                            } label: {
                                Text(LocalizedStringKey("shop.filter.\(value)"))
                                    .font(.subheadline.weight(.semibold))
                                    .padding(.horizontal, 16)
                                    .padding(.vertical, 9)
                            }
                            .buttonStyle(.glass)
                            .tint(filter == value ? LauncherPalette.accent : nil)
                        }
                    }
                }
                LazyVGrid(columns: [GridItem(.adaptive(minimum: 240), spacing: 18)], spacing: 18) {
                    ForEach(state.content.shopItems.filter { filter == "all" || $0.category == filter }) { item in
                        GlassCard {
                            VStack(alignment: .leading, spacing: 12) {
                                RoundedRectangle(cornerRadius: 18).fill(Color(hex: item.colorHex)).frame(height: 140).overlay(Image(systemName: "sparkles").font(.system(size: 44)).foregroundStyle(.white.opacity(0.8)))
                                Text(LocalizedStringKey(item.titleKey)).font(.headline)
                                Text(LocalizedStringKey(item.detailKey)).font(.subheadline).foregroundStyle(.secondary)
                                Text(item.id == "1" ? "¥ 39" : item.id == "2" ? "¥ 89" : "¥ 19")
                                    .font(.headline.weight(.bold))
                                    .foregroundStyle(LauncherPalette.accent)
                            }
                        }
                    }
                }
            }
            .padding(28)
        }
        .navigationTitle("nav.shop")
    }
}
