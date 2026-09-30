import SwiftUI
import Foundation
import UIKit

extension Color {
    init(hex: String) {
        let cleaned = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var value: UInt64 = 0
        Scanner(string: cleaned).scanHexInt64(&value)
        let red = Double((value >> 16) & 0xff) / 255
        let green = Double((value >> 8) & 0xff) / 255
        let blue = Double(value & 0xff) / 255
        self.init(red: red, green: green, blue: blue)
    }

    var hexString: String? {
        #if canImport(UIKit)
        let resolved = UIColor(self).cgColor
        guard let components = resolved.components, components.count >= 3 else { return nil }
        let red = Int((components[0] * 255).rounded())
        let green = Int((components[1] * 255).rounded())
        let blue = Int((components[2] * 255).rounded())
        return String(format: "%02X%02X%02X", red, green, blue)
        #else
        return nil
        #endif
    }
}

enum ThemeColorOption: String, CaseIterable, Identifiable {
    case yellow = "fdd500"
    case cyan = "18c7d9"
    case blue = "4f8cff"
    case purple = "9b7cff"
    case pink = "f06a9b"
    case orange = "f28c45"
    case green = "35c778"

    var id: String { rawValue }
    var color: Color { Color(hex: rawValue) }

    var name: String {
        switch self {
        case .yellow: return "Yellow"
        case .cyan: return "Cyan"
        case .blue: return "Blue"
        case .purple: return "Purple"
        case .pink: return "Pink"
        case .orange: return "Orange"
        case .green: return "Green"
        }
    }
}
