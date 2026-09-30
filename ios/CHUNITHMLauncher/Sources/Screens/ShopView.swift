import SwiftUI

struct ShopView: View {
    @ObservedObject var state: AppState

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 22) {
                SectionHeader("shop.title", eyebrow: "shop.eyebrow")
                LazyVGrid(columns: [GridItem(.adaptive(minimum: 240), spacing: 18)], spacing: 18) {
                    ForEach(state.content.shopItems) { item in
                        GlassCard {
                            VStack(alignment: .leading, spacing: 12) {
                                RoundedRectangle(cornerRadius: 18).fill(Color(hex: item.colorHex)).frame(height: 140).overlay(Image(systemName: "sparkles").font(.system(size: 44)).foregroundStyle(.white.opacity(0.8)))
                                Text(LocalizedStringKey(item.titleKey)).font(.headline)
                                Text(LocalizedStringKey(item.detailKey)).font(.subheadline).foregroundStyle(.secondary)
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

