import Foundation
import AppMetricaCrashes


@objc(YaAppMetricaCrashes)
class YaAppMetricaCrashes: NSObject {
  @objc func configureCrashes(_ config: NSDictionary) {
    let configuration = Utils.toCrashesConfig(with: config)
    AppMetricaCrashes.crashes().setConfiguration(configuration)
  }
  
  @objc func reportError(_ name: String, stack: String) {
    let underlyingError = AppMetricaError(identifier: "Underlying AppMetricaError")
    
    let error = AppMetricaError(
      identifier: name,
      message: stack,
      parameters: [:],
      backtrace: Thread.callStackReturnAddresses,
      underlyingError: underlyingError
    )
    
    AppMetricaCrashes.crashes().report(error: error)
  }
  
  @objc
  func criticalError() {
    fatalError("This is test fatal error iOS")
  }
}
