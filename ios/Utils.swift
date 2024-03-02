import Foundation
import CoreLocation
import AppMetricaCore
import AppMetricaCrashes

class Utils {
  static func toAppMetricaConfig(with: NSDictionary) -> AppMetricaConfiguration? {
    let apiKey = with.value(forKey: "apiKey") as! String
    let resultConfig = AppMetricaConfiguration(apiKey: apiKey)

    if let appBuildNumber = with.value(forKey: "appBuildNumber") as? UInt {
      resultConfig?.appBuildNumber = String(appBuildNumber)
    }

    if let appOpenTrackingEnabled = with.value(forKey: "appOpenTrackingEnabled") as? Bool {
      resultConfig?.appOpenTrackingEnabled = appOpenTrackingEnabled
    }

    if let appVersion = with.value(forKey: "appVersion") as? String {
      resultConfig?.appVersion = appVersion
    }

    if let customHosts = with.value(forKey: "customHosts") as? [String] {
      resultConfig?.customHosts = customHosts
    }

    if let dataSendingEnabled = with.value(forKey: "dataSendingEnabled") as? Bool {
      resultConfig?.dataSendingEnabled = dataSendingEnabled
    }

    if let locationTracking = with.value(forKey: "locationTracking") as? Bool {
      resultConfig?.locationTracking = locationTracking
    }

    if let maxReportsCount = with.value(forKey: "maxReportsCount") as? UInt {
      resultConfig?.maxReportsCount = maxReportsCount
    }

    if let maxReportsInDatabaseCount = with.value(forKey: "maxReportsInDatabaseCount") as? UInt {
      resultConfig?.maxReportsInDatabaseCount = maxReportsInDatabaseCount
    }
    
    if let preloadInfo = with.value(forKey: "preloadInfo") as? NSDictionary {
      resultConfig?.preloadInfo = toPreloadInfo(with: preloadInfo)
    }

    if let revenueAutoTrackingEnabled = with.value(forKey: "revenueAutoTrackingEnabled") as? Bool {
      resultConfig?.revenueAutoTrackingEnabled = revenueAutoTrackingEnabled
    }

    if let sessionTimeout = with.value(forKey: "sessionTimeout") as? UInt {
      resultConfig?.sessionTimeout = sessionTimeout
    }

    if let userProfileID = with.value(forKey: "userProfileID") as? String {
      resultConfig?.userProfileID = userProfileID
    }

    if let location = with.value(forKey: "location") as? NSDictionary {
      resultConfig?.customLocation = toLocation(with: location)
    }

    if let areLogsEnabled = with.value(forKey: "logs") as? Bool {
      resultConfig?.areLogsEnabled = areLogsEnabled
    }

    if let dispatchPeriod = with.value(forKey: "dispatchPeriodSecond") as? UInt {
      resultConfig?.dispatchPeriod = dispatchPeriod
    }

    if let sessionsAutoTracking = with.value(forKey: "sessionsAutoTrackingEnabled") as? Bool {
      resultConfig?.sessionsAutoTracking = sessionsAutoTracking
    }

    if let handleFirstActivationAsUpdate = with.value(forKey: "firstActivationAsUpdate") as? Bool {
      resultConfig?.handleFirstActivationAsUpdate = handleFirstActivationAsUpdate
    }

    if let accurateLocationTracking = with.value(forKey: "accurateLocationTracking") as? Bool {
      resultConfig?.accurateLocationTracking = accurateLocationTracking
    }

    if let allowsBackgroundLocationUpdates = with.value(forKey: "allowsBackgroundLocationUpdates") as? Bool {
      resultConfig?.allowsBackgroundLocationUpdates = allowsBackgroundLocationUpdates
    }

    if let handleActivationAsSessionStart = with.value(forKey: "handleActivationAsSessionStart") as? Bool {
      resultConfig?.handleFirstActivationAsUpdate = handleActivationAsSessionStart
    }

    return resultConfig
  }

  static func toCrashesConfig(with: NSDictionary) -> AppMetricaCrashesConfiguration {
    let configuration = AppMetricaCrashesConfiguration()

    if let autoCrashTracking = with.value(forKey: "autoCrashTracking") as? Bool {
      configuration.autoCrashTracking = autoCrashTracking
    }

    if let probablyUnhandledCrashReporting = with.value(forKey: "probablyUnhandledCrashReporting") as? Bool {
      configuration.probablyUnhandledCrashReporting = probablyUnhandledCrashReporting
    }

    if let ignoredCrashSignals = with.value(forKey: "ignoredCrashSignals") as? [NSNumber] {
      configuration.ignoredCrashSignals = ignoredCrashSignals
    }

    if let applicationNotRespondingDetection = with.value(forKey: "applicationNotRespondingDetection") as? Bool {
      configuration.applicationNotRespondingDetection = applicationNotRespondingDetection
    }

    if let applicationNotRespondingWatchdogInterval = with.value(forKey: "applicationNotRespondingWatchdogInterval") as? Double {
      configuration.applicationNotRespondingWatchdogInterval = applicationNotRespondingWatchdogInterval
    }

    if let applicationNotRespondingPingInterval = with.value(forKey: "applicationNotRespondingPingInterval") as? Double {
      configuration.applicationNotRespondingPingInterval = applicationNotRespondingPingInterval
    }

    return configuration
  }

  static func toProfile(with: NSDictionary) -> UserProfile {
    let profile = MutableUserProfile()
    var newAttrs: [UserProfileUpdate] = []

      // установка предопределенных атрибутов
    if let name = with.value(forKey: "name") as? String {
      newAttrs.append(ProfileAttribute.name().withValue(name))
    }
    if let gender = with.value(forKey: "gender") as? String {
      let g = gender == "male" ? GenderType.male : gender == "female" ? GenderType.female : GenderType.other
      newAttrs.append(ProfileAttribute.gender().withValue(g))
    }
    if let birthDate = with.value(forKey: "birthDate") as? NSArray {
      newAttrs.append(ProfileAttribute.birthDate().withDate(
        year: birthDate[2] as! UInt,
        month: birthDate[1] as! UInt,
        day: birthDate[0] as! UInt
      ))
    }
    if let notificationsEnabled = with.value(forKey: "notificationsEnabled") as? Bool {
      newAttrs.append(ProfileAttribute.notificationsEnabled().withValue(notificationsEnabled))
    }

      // установка кастомных атрибутов
    if let custom = with.value(forKey: "customAttributes") as? NSDictionary {
      for attr in custom {
        var profileAttr: UserProfileUpdate? = nil
        let key = attr.key as! String;
        let attrValue = (attr.value as? NSDictionary)!

        switch attrValue["type"] as! String {
          case "boolean":
            if let value = attrValue["value"] {
              profileAttr = ProfileAttribute.customBool(key).withValue(value as! Bool)
            } else {
              profileAttr = ProfileAttribute.customBool(key).withValueReset()
            }
          case "string":
            if let value = attrValue["value"] {
              profileAttr = ProfileAttribute.customString(key).withValue(value as? String)
            } else {
              profileAttr = ProfileAttribute.customString(key).withValueReset()
            }
          case "counter":
            if let value = attrValue["value"] {
              profileAttr = ProfileAttribute.customCounter(key).withDelta(value as! Double)
            }
          case "number":
            if let value = attrValue["value"] {
              profileAttr = ProfileAttribute.customNumber(key).withValue(value as! Double)
            } else {
              profileAttr = ProfileAttribute.customNumber(key).withValueReset()
            }
          default:
            continue
        }

        if profileAttr != nil {
          newAttrs.append(profileAttr!)
        }
      }
    }

    profile.apply(from: newAttrs)

    return profile
  }

  static func toLocation(with: NSDictionary) -> CLLocation? {
    let latitude = with["latitude"] as? Double
    let longitude = with["longitude"] as? Double
    
    if (latitude != nil && longitude != nil) {
      return CLLocation(latitude: latitude!, longitude: longitude!)
    } else {
      return nil
    }
  }
  
  static func toPreloadInfo(with: NSDictionary?) -> AppMetricaPreloadInfo? {
    guard let preloadInfoDict = with else {
      return nil
    }
    
    guard let trackingId = preloadInfoDict["trackingId"] as? String else {
      return nil
    }
    
    let preloadInfo = AppMetricaPreloadInfo(trackingIdentifier: trackingId)
    
    if let additionalInfo = preloadInfoDict["additionalInfo"] as? [String: Any] {
      for (key, value) in additionalInfo {
        preloadInfo?.setAdditionalInfo(info: value as! String, for: key)
      }
    }
    
    return preloadInfo
  }
}
