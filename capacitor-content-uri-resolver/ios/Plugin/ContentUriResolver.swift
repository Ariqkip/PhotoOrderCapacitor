import Foundation

@objc public class ContentUriResolver: NSObject {
    @objc public func echo(_ value: String) -> String {
        print(value)
        return value
    }
}
