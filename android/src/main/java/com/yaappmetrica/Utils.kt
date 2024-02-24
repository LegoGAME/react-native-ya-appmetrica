package com.yaappmetrica

import android.location.Location
import com.facebook.react.bridge.ReadableMap
import io.appmetrica.analytics.AppMetricaConfig
import io.appmetrica.analytics.PreloadInfo
import io.appmetrica.analytics.profile.Attribute
import io.appmetrica.analytics.profile.GenderAttribute
import io.appmetrica.analytics.profile.UserProfile

abstract class Utils {

  companion object {
    fun toAppMetricaConfig(configMap: ReadableMap): AppMetricaConfig {
      val builder = AppMetricaConfig.newConfigBuilder(configMap.getString("apiKey")?:"")

      if (configMap.hasKey("appVersion")) {
        builder.withAppVersion(configMap.getString("appVersion"))
      }
      if (configMap.hasKey("crashReporting")) {
        builder.withCrashReporting(configMap.getBoolean("crashReporting"))
      }
      if (configMap.hasKey("logs")) {
        builder.withLogs()
      }
      if (configMap.hasKey("nativeCrashReporting")) {
        builder.withNativeCrashReporting(configMap.getBoolean("nativeCrashReporting"))
      }
      if (configMap.hasKey("sessionTimeout")) {
        builder.withSessionTimeout(configMap.getInt("sessionTimeout"))
      }
      if (configMap.hasKey("appOpenTrackingEnabled")) {
        builder.withAppOpenTrackingEnabled(configMap.getBoolean("appOpenTrackingEnabled"))
      }
      if (configMap.hasKey("firstActivationAsUpdate")) {
        builder.handleFirstActivationAsUpdate(configMap.getBoolean("firstActivationAsUpdate"))
      }
      if (configMap.hasKey("maxReportsInDatabaseCount")) {
        builder.withMaxReportsInDatabaseCount(configMap.getInt("maxReportsInDatabaseCount"))
      }
      if (configMap.hasKey("maxReportsCount")) {
        builder.withMaxReportsCount(configMap.getInt("maxReportsCount"))
      }
      if (configMap.hasKey("userProfileID")) {
        builder.withUserProfileID(configMap.getString("userProfileID"))
      }
      if (configMap.hasKey("statisticsSending")) {
        builder.withDataSendingEnabled(configMap.getBoolean("statisticsSending"))
      }
      if (configMap.hasKey("locationTracking")) {
        builder.withLocationTracking(configMap.getBoolean(("locationTracking")))
      }

//      configMap.getMap("preloadInfo")?.let { builder.withPreloadInfo(toPreloadInfo(it)) }
//      configMap.getMap("location")?.let { builder.withLocation(toLocation(it)) }

      return builder.build()
    }

    private fun toLocation(locationMap: ReadableMap?): Location? {
      locationMap ?: return null

      val location = Location("Custom")

      locationMap.getDouble("latitude").let { location.latitude = it }
      locationMap.getDouble("longitude").let { location.longitude = it }
      locationMap.getDouble("altitude").let { location.altitude = it }
      locationMap.getDouble("accuracy").let { location.accuracy = it.toFloat() }
      locationMap.getDouble("course").let { location.bearing = it.toFloat() }
      locationMap.getDouble("speed").let { location.speed = it.toFloat() }
      locationMap.getDouble("timestamp").let { location.time = it.toLong() }

      return location
    }

    private fun toPreloadInfo(preloadInfoMap: ReadableMap?): PreloadInfo? {
      preloadInfoMap ?: return null

      val builder = PreloadInfo.newBuilder(preloadInfoMap.getString("trackingId"))

      preloadInfoMap.getMap("additionalInfo")?.let { additionalInfo ->
        additionalInfo.toHashMap().forEach { (key, value) ->
          builder.setAdditionalParams(key, value?.toString())
        }
      }

      return builder.build()
    }

    fun toProfile(profileData: ReadableMap): UserProfile {
      val profile = UserProfile.newBuilder()

      // установка предопределенных атрибутов
      profileData.getString("name")?.let { profile.apply(Attribute.name().withValue(it)) }
      profileData.getString("gender")?.let {
        profile.apply(
          when (it) {
            "male" -> Attribute.gender().withValue(GenderAttribute.Gender.MALE)
            "female" -> Attribute.gender().withValue(GenderAttribute.Gender.FEMALE)
            else -> Attribute.gender().withValue(GenderAttribute.Gender.OTHER)
          }
        )
      }
      profileData.getArray("birthDate")?.let {
        profile.apply(
          Attribute.birthDate().withBirthDate(it.getInt(2), it.getInt(1), it.getInt(0))
        )
      }
      profileData.getBoolean("notificationsEnabled")?.let { profile.apply(Attribute.notificationsEnabled().withValue(it)) }

      // установка кастомных атрибутов
      val iterator = profileData.getMap("customAttributes")?.keySetIterator();

      if (iterator != null) {
        while (iterator.hasNextKey()) {
          val key = iterator.nextKey();
          val value = profileData.getMap("customAttributes")?.getMap(key) ?: continue
          val type = value.getString("type")

          if (type == "boolean") {
            if (value.hasKey("value")) {
              profile.apply(Attribute.customBoolean(key).withValue(value.getBoolean("value")))
            } else {
              profile.apply(Attribute.customBoolean(key).withValueReset())
            }
          }

          if (type == "string") {
            if (value.hasKey("value")) {
              profile.apply(Attribute.customString(key).withValue(value.getString("value")!!))
            } else {
              profile.apply(Attribute.customBoolean(key).withValueReset())
            }
          }


          if (type == "counter") {
            if (value.hasKey("value")) {
              profile.apply(Attribute.customCounter(key).withDelta(value.getDouble("value")))
            }
          }

          if (type == "number") {
            if (value.hasKey("value")) {
              profile.apply(Attribute.customNumber(key).withValue(value.getDouble("value")))
            } else {
              profile.apply(Attribute.customNumber(key).withValueReset())
            }
          }
        }
      }

      return profile.build()
    }
  }
}
