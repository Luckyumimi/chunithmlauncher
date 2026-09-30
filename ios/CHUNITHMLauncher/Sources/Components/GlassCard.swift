import SwiftUI
import UIKit

struct GlassCard<Content: View>: View {
    let content: Content

    init(@ViewBuilder content: () -> Content) {
        self.content = content()
    }

    var body: some View {
        content
            .padding(20)
            .glassEffect(.regular, in: .rect(cornerRadius: 24))
    }
}

struct GlassActionButton<Label: View>: View {
    let role: ButtonRole?
    let action: () -> Void
    let label: Label

    init(role: ButtonRole? = nil, action: @escaping () -> Void, @ViewBuilder label: () -> Label) {
        self.role = role
        self.action = action
        self.label = label()
    }

    var body: some View {
        Button(role: role, action: action) {
            label
                .font(.headline)
                .frame(minHeight: 44)
                .padding(.horizontal, 16)
        }
        .buttonStyle(.glass)
    }
}

enum LauncherPalette {
    static var accent: Color {
        Color(hex: UserDefaults.standard.string(forKey: "themeColorHex") ?? "fdd500")
    }
    static func background(_ scheme: ColorScheme) -> Color {
        Color(hex: scheme == .dark ? "222222" : "e9e7ee")
    }
    static func surface(_ scheme: ColorScheme) -> Color {
        Color(hex: scheme == .dark ? "333333" : "f5f2f9")
    }
    static func control(_ scheme: ColorScheme) -> Color {
        Color(hex: scheme == .dark ? "454545" : "e9e7ee")
    }
}

struct ContentCard<Content: View>: View {
    @Environment(\.colorScheme) private var scheme
    let content: Content

    init(@ViewBuilder content: () -> Content) { self.content = content() }

    var body: some View {
        content
            .padding(20)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(LauncherPalette.surface(scheme), in: .rect(cornerRadius: 24))
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
            HStack(alignment: .top, spacing: 24) {
                leading.frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)
                trailing
                    .frame(width: min(390, width * 0.38), alignment: .top)
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
