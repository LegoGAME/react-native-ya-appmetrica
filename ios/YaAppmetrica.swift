import YandexMobileMetrica


@objc(YaAppmetrica)
class YaAppmetrica: NSObject {
  @objc func activate(_ config: NSDictionary, onError: @escaping RCTResponseSenderBlock) {
    if let metricaConfig = Utils.toAppMetricaConfig(with: config) {
      YMMYandexMetrica.activate(with: metricaConfig)
    }
    else {
      onError(["AppMetrica is not initialized. Check your logs in Xcode. This can happen if you did not pass the api key or api key is incorrect."])
    }
  }
  
  @objc func reportEvent(_ eventName: NSString, attributes: NSDictionary?) {
    if (attributes == nil) {
      YMMYandexMetrica.reportEvent(eventName as String)
    } else {
      YMMYandexMetrica.reportEvent(eventName as String, parameters: attributes as? [AnyHashable : Any])
    }
  }
  
  @objc func reportError(_ name: String, stack: String) {
    let underlyingError = YMMError.init(identifier: "Underlying YMMError")
    
    let error = YMMError(
      identifier: name,
      message: stack,
      parameters: [:],
      backtrace: Thread.callStackReturnAddresses,
      underlyingError: underlyingError
    )
    
    YMMYandexMetrica.report(error: error, onFailure: nil)
  }
  
  @objc func sendEventsBuffer() {
    YMMYandexMetrica.sendEventsBuffer()
  }
  
  @objc func pauseSession() {
    YMMYandexMetrica.pauseSession()
  }
  
  @objc func resumeSession() {
    YMMYandexMetrica.resumeSession()
  }
  
  @objc func reportAppOpen(_ deeplink: NSString) {
    YMMYandexMetrica.handleOpen(NSURL(string: deeplink as String)! as URL)
  }
  
  @objc func setUserProfileID(_ userID: NSString) {
    YMMYandexMetrica.setUserProfileID(userID as String)
  }
  
  @objc func reportUserProfile(_ profileData: NSDictionary, onError: @escaping RCTResponseSenderBlock) {
    if let profileId = profileData["userProfileID"] as? String {
      YMMYandexMetrica.setUserProfileID(profileId)
    }
    
    let profile = Utils.toProfile(with: profileData)
    YMMYandexMetrica.report(profile, onFailure: { (error) in
      onError([error.localizedDescription])
    })
  }
  
  @objc func setStatisticsSending(_ enabled: Bool) {
    YMMYandexMetrica.setStatisticsSending(enabled)
  }
  
  @objc func setLocationTracking(_ enabled: Bool){
    YMMYandexMetrica.setLocationTracking(enabled)
  }
}

