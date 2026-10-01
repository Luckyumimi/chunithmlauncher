import SwiftUI
import UIKit

struct GlassCard<Content: View>: View {
    @Environment(\.colorScheme) private var colorScheme
    let content: Content

    init(@ViewBuilder content: () -> Content) {
        self.content = content()
    }

    var body: some View {
        content
            .padding(20)
            .background(LauncherPalette.surfaceGradient(colorScheme).opacity(0.34), in: .rect(cornerRadius: 24))
            .glassEffect(.regular, in: .rect(cornerRadius: 24))
            .animation(.easeInOut(duration: 0.35), value: colorScheme)
    }
}

struct GlassActionButton<Label: View>: View {
    @Environment(\.colorScheme) private var colorScheme
    let role: ButtonRole?
    let action: () -> Void
    let label: Label
    let minHeight: CGFloat
    let horizontalPadding: CGFloat

    init(
        role: ButtonRole? = nil,
        minHeight: CGFloat = 44,
        horizontalPadding: CGFloat = 16,
        action: @escaping () -> Void,
        @ViewBuilder label: () -> Label
    ) {
        self.role = role
        self.minHeight = minHeight
        self.horizontalPadding = horizontalPadding
        self.action = action
        self.label = label()
    }

    var body: some View {
        Button(role: role, action: action) {
            label
                .font(.headline)
                .frame(minHeight: minHeight)
                .padding(.horizontal, horizontalPadding)
        }
        .buttonStyle(.glass)
        .tint(LauncherPalette.accent)
        .animation(.easeInOut(duration: 0.35), value: colorScheme)
    }
}

struct GlassCircleButton<Label: View>: View {
    let action: () -> Void
    let label: Label

    init(action: @escaping () -> Void, @ViewBuilder label: () -> Label) {
        self.action = action
        self.label = label()
    }

    var body: some View {
        Button(action: action) {
            label
                .frame(width: 44, height: 44)
                .contentShape(Circle())
        }
        .buttonStyle(.plain)
        .glassEffect(.regular, in: .circle)
    }
}

enum LauncherPalette {
    static var accent: Color {
        Color(hex: UserDefaults.standard.string(forKey: "themeColorHex") ?? "fdd500")
    }

    static func accentGradient(_ hex: String? = nil) -> LinearGradient {
        let color = Color(hex: hex ?? UserDefaults.standard.string(forKey: "themeColorHex") ?? "fdd500")
        return LinearGradient(
            colors: [color.opacity(0.96), color.opacity(0.62)],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )
    }

    static func background(_ scheme: ColorScheme) -> Color {
        Color(hex: scheme == .dark ? "222222" : "e9e7ee")
    }

    static func backgroundGradient(_ scheme: ColorScheme) -> LinearGradient {
        LinearGradient(
            colors: scheme == .dark
                ? [Color(hex: "181b21"), Color(hex: "181b21")]
                : [Color(hex: "f8f7fb"), Color(hex: "e4e2eb")],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )
    }

    static func surface(_ scheme: ColorScheme) -> Color {
        Color(hex: scheme == .dark ? "333333" : "f5f2f9")
    }

    static func surfaceGradient(_ scheme: ColorScheme) -> LinearGradient {
        LinearGradient(
            colors: scheme == .dark
                ? [Color(hex: "37393e"), Color(hex: "292b30")]
                : [Color(hex: "ffffff"), Color(hex: "f0edf5")],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )
    }

    static func control(_ scheme: ColorScheme) -> Color {
        Color(hex: scheme == .dark ? "454545" : "e9e7ee")
    }
}

struct ContentCard<Content: View>: View {
    @Environment(\.colorScheme) private var scheme
    let fillsAvailableHeight: Bool
    let content: Content

    init(fillsAvailableHeight: Bool = false, @ViewBuilder content: () -> Content) {
        self.fillsAvailableHeight = fillsAvailableHeight
        self.content = content()
    }

    var body: some View {
        Group {
            if fillsAvailableHeight {
                content
                    .padding(20)
                    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
            } else {
                content
                    .padding(20)
                    .frame(maxWidth: .infinity, alignment: .leading)
            }
        }
        .background(LauncherPalette.surfaceGradient(scheme), in: .rect(cornerRadius: 24))
        .animation(.easeInOut(duration: 0.35), value: scheme)
    }
}

struct AdaptiveColumns<Leading: View, Trailing: View>: View {
    @Environment(\.dynamicTypeSize) private var typeSize
    let width: CGFloat
    let leading: Leading
    let trailing: Trailing

    init(width: CGFloat, @ViewBuilder leading: () -> Leading, @ViewBuilder trailing: () -> Trailing) {
        self.width = width
        self.leading = leading()
        self.trailing = trailing()
    }

    var body: some View {
        if width >= 780 && !typeSize.isAccessibilitySize {
            let trailingWidth = min(390, width * 0.38)
            EqualHeightRow(trailingWidth: trailingWidth, spacing: 24) {
                leading.frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
                trailing
                    .frame(width: trailingWidth)
                    .frame(maxHeight: .infinity, alignment: .top)
            }
        } else {
            VStack(alignment: .leading, spacing: 24) {
                leading.frame(maxWidth: .infinity, alignment: .leading)
                trailing.frame(maxWidth: .infinity, alignment: .leading)
            }
        }
    }
}

private struct EqualHeightRow: Layout {
    let trailingWidth: CGFloat
    let spacing: CGFloat

    func sizeThatFits(
        proposal: ProposedViewSize,
        subviews: Subviews,
        cache: inout Cache
    ) -> CGSize {
        guard subviews.count >= 2 else { return .zero }

        let availableWidth = proposal.width ?? trailingWidth + spacing
        let leadingWidth = max(0, availableWidth - trailingWidth - spacing)
        let leadingSize = subviews[0].sizeThatFits(.init(width: leadingWidth, height: nil))
        let trailingSize = subviews[1].sizeThatFits(.init(width: trailingWidth, height: nil))

        return CGSize(
            width: availableWidth,
            height: max(leadingSize.height, trailingSize.height)
        )
    }

    func placeSubviews(
        in bounds: CGRect,
        proposal: ProposedViewSize,
        subviews: Subviews,
        cache: inout Cache
    ) {
        guard subviews.count >= 2 else { return }

        let leadingWidth = max(0, bounds.width - trailingWidth - spacing)
        let rowProposal = ProposedViewSize(width: leadingWidth, height: bounds.height)
        subviews[0].place(
            at: CGPoint(x: bounds.minX, y: bounds.minY),
            anchor: .topLeading,
            proposal: rowProposal
        )
        subviews[1].place(
            at: CGPoint(x: bounds.maxX - trailingWidth, y: bounds.minY),
            anchor: .topLeading,
            proposal: ProposedViewSize(width: trailingWidth, height: bounds.height)
        )
    }
}

struct SectionHeader: View {
    let title: LocalizedStringKey
    let eyebrow: LocalizedStringKey?

    init(_ title: LocalizedStringKey, eyebrow: LocalizedStringKey? = nil) {
        self.title = title
        self.eyebrow = eyebrow
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            if let eyebrow { Text(eyebrow).font(.caption.weight(.bold)).tracking(1.4).foregroundStyle(.secondary) }
            Text(title).font(.largeTitle.weight(.bold)).tracking(-0.7)
        }
    }
}

struct LocalImage: View {
    let name: String
    let contentMode: ContentMode

    init(_ name: String, contentMode: ContentMode = .fit) {
        self.name = name
        self.contentMode = contentMode
    }

    var body: some View {
        Group {
            if let image = UIImage(named: name, in: .main, compatibleWith: nil) {
                Image(uiImage: image).resizable().aspectRatio(contentMode: contentMode)
            } else if let url = Bundle.main.url(forResource: name, withExtension: "png", subdirectory: "Events"), let image = UIImage(contentsOfFile: url.path) {
                Image(uiImage: image).resizable().aspectRatio(contentMode: contentMode)
            } else if let url = Bundle.main.url(forResource: name, withExtension: "png"), let image = UIImage(contentsOfFile: url.path) {
                Image(uiImage: image).resizable().aspectRatio(contentMode: contentMode)
            } else if let url = Bundle.main.url(forResource: name, withExtension: "jpg", subdirectory: "Rating"), let image = UIImage(contentsOfFile: url.path) {
                Image(uiImage: image).resizable().aspectRatio(contentMode: contentMode)
            } else {
                RoundedRectangle(cornerRadius: 20).fill(.secondary.opacity(0.2))
            }
        }
    }
}
