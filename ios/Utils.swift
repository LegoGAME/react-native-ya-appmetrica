import Foundation
import YandexMobileMetrica

class Utils {
  static func toAppMetricaConfig(with: NSDictionary) -> YMMYandexMetricaConfiguration? {    
    let apiKey = with.value(forKey: "apiKey") as? String ?? ""
    let resultConfig = YMMYandexMetricaConfiguration(apiKey: apiKey)
    
    if let appVersion = with.value(forKey: "appVersion") as? String {
      resultConfig?.appVersion = appVersion
    }
    
    if let logs = with.value(forKey: "logs") as? Bool {
      resultConfig?.logs = logs
    }
    
    if let sessionTimeout = with.value(forKey: "sessionTimeout") as? UInt {
      resultConfig?.sessionTimeout = sessionTimeout
    }

    if let crashReporting = with.value(forKey: "crashReporting") as? Bool {
      resultConfig?.crashReporting = crashReporting
    }
    
    if let appOpenTrackingEnabled = with.value(forKey: "appOpenTrackingEnabled") as? Bool {
      resultConfig?.appOpenTrackingEnabled = appOpenTrackingEnabled
    }
    
    if let handleActivationAsSessionStart = with.value(forKey: "handleActivationAsSessionStart") as? Bool {
      resultConfig?.handleActivationAsSessionStart = handleActivationAsSessionStart
    }
    
    if let firstActivationAsUpdate = with.value(forKey: "firstActivationAsUpdate") as? Bool {
      resultConfig?.handleFirstActivationAsUpdate = firstActivationAsUpdate
    }
    
    if let maxReportsInDatabaseCount = with.value(forKey: "maxReportsInDatabaseCount") as? UInt {
      resultConfig?.maxReportsInDatabaseCount = maxReportsInDatabaseCount
    }
    if let userProfileID = with.value(forKey: "userProfileID") as? String {
      resultConfig?.userProfileID = userProfileID
    }
    if let statisticsSending = with.value(forKey: "statisticsSending") as? Bool {
      resultConfig?.statisticsSending = statisticsSending
    }
    if let locationTracking = with.value(forKey: "locationTracking") as? Bool {
      resultConfig?.locationTracking = locationTracking
    }
    
    return resultConfig
  }
  
  static func toProfile(with: NSDictionary) -> YMMUserProfile {
    let profile = YMMMutableUserProfile()
    var newAttrs: [YMMUserProfileUpdate] = []
    
    // установка предопределенных атрибутов
    if let name = with.value(forKey: "name") as? String {
      newAttrs.append(YMMProfileAttribute.name().withValue(name))
    }
    if let gender = with.value(forKey: "gender") as? String {
      let g = gender == "male" ? YMMGenderType.male : gender == "female" ? YMMGenderType.female : YMMGenderType.other
      newAttrs.append(YMMProfileAttribute.gender().withValue(g))
    }
    if let birthDate = with.value(forKey: "birthDate") as? NSArray {
      newAttrs.append(YMMProfileAttribute.birthDate().withDate(
        year: birthDate[2] as! UInt,
        month: birthDate[1] as! UInt,
        day: birthDate[0] as! UInt
      ))
    }
    if let notificationsEnabled = with.value(forKey: "notificationsEnabled") as? Bool {
      newAttrs.append(YMMProfileAttribute.notificationsEnabled().withValue(notificationsEnabled))
    }
    
    // установка кастомных атрибутов
    if let custom = with.value(forKey: "customAttributes") as? NSDictionary {
      for attr in custom {
        var profileAttr: YMMUserProfileUpdate? = nil
        let key = attr.key as! String;
        let attrValue = (attr.value as? NSDictionary)!
        
        switch attrValue["type"] as! String {
          case "boolean":
            if let value = attrValue["value"] {
              profileAttr = YMMProfileAttribute.customBool(key).withValue(value as! Bool)
            } else {
              profileAttr = YMMProfileAttribute.customBool(key).withValueReset()
            }
          case "string":
            if let value = attrValue["value"] {
              profileAttr = YMMProfileAttribute.customString(key).withValue(value as? String)
            } else {
              profileAttr = YMMProfileAttribute.customString(key).withValueReset()
            }
          case "counter":
            if let value = attrValue["value"] {
              profileAttr = YMMProfileAttribute.customCounter(key).withDelta(value as! Double)
            }
          case "number":
            if let value = attrValue["value"] {
              profileAttr = YMMProfileAttribute.customNumber(key).withValue(value as! Double)
            } else {
              profileAttr = YMMProfileAttribute.customNumber(key).withValueReset()
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
}
