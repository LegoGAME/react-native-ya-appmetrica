import Foundation


@objc(TestError)
class TestError: NSObject {
  
  @objc
  func criticalError() {
    fatalError("This is test fatal error iOS")
  }
}
