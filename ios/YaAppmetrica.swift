import AppMetricaCore


@objc(YaAppmetrica)
class YaAppmetrica: NSObject {
  @objc func activate(_ config: NSDictionary, onError: @escaping RCTResponseSenderBlock) {
    if AppMetrica.isActivated {
      return
    }
    
    if let metricaConfig = Utils.toAppMetricaConfig(with: config) {
      AppMetrica.activate(with: metricaConfig)
    }
    else {
      onError(["AppMetrica is not initialized. Check your logs in Xcode. This can happen if you did not pass the api key or api key is incorrect."])
    }
  }
  
  @objc func reportEvent(_ eventName: NSString, attributes: NSDictionary?) {
    if (attributes == nil) {
      AppMetrica.reportEvent(name: eventName as String)
    } else {
      AppMetrica.reportEvent(name: eventName as String, parameters: attributes as? [AnyHashable : Any])
    }
  }
  
  @objc func sendEventsBuffer() {
    AppMetrica.sendEventsBuffer()
  }
  
  @objc func pauseSession() {
    AppMetrica.pauseSession()
  }
  
  @objc func resumeSession() {
    AppMetrica.resumeSession()
  }
  
  @objc func reportAppOpen(_ deeplink: NSString) {
    AppMetrica.trackOpeningURL(NSURL(string: deeplink as String)! as URL)
  }
  
  @objc func setUserProfileID(_ userID: NSString) {
    AppMetrica.userProfileID = userID as String
  }
  
  @objc func reportUserProfile(_ profileData: NSDictionary, onError: @escaping RCTResponseSenderBlock) {
    if let profileId = profileData["userProfileID"] as? String {
      AppMetrica.userProfileID = profileId
    }
    
    let profile = Utils.toProfile(with: profileData)
    AppMetrica.reportUserProfile(profile, onFailure: { (error) in
      onError([error.localizedDescription])
    })
  }
  
  @objc func setStatisticsSending(_ enabled: Bool) {
    AppMetrica.setDataSendingEnabled(enabled)
  }
  
  @objc func setLocationTracking(_ enabled: Bool){
    AppMetrica.isLocationTrackingEnabled = enabled
  }
}

