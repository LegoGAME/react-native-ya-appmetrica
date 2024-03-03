package com.yaappmetrica

import android.location.Location
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import io.appmetrica.analytics.AppMetricaConfig
import io.appmetrica.analytics.PreloadInfo
import io.appmetrica.analytics.Revenue
import io.appmetrica.analytics.profile.Attribute
import io.appmetrica.analytics.profile.GenderAttribute
import io.appmetrica.analytics.profile.UserProfile
import java.util.Currency

abstract class Utils {

  companion object {
    fun toAppMetricaConfig(configMap: ReadableMap): AppMetricaConfig {
      val builder = AppMetricaConfig.newConfigBuilder(configMap.getString("apiKey")?:"")

      if (configMap.hasKey("appBuildNumber")) {
        builder.withAppBuildNumber(configMap.getInt("appBuildNumber"))
      }
      if (configMap.hasKey("appOpenTrackingEnabled")) {
        builder.withAppOpenTrackingEnabled(configMap.getBoolean("appOpenTrackingEnabled"))
      }
      if (configMap.hasKey("appVersion")) {
        builder.withAppVersion(configMap.getString("appVersion"))
      }
      if (configMap.hasKey("customHosts")) {
        val hosts = configMap.getArray("customHosts") as ReadableArray
        val stringList: List<String?> = (0 until hosts.size())
          .map { index -> hosts.getString(index) }

        builder.withCustomHosts(stringList)
      }
      if (configMap.hasKey("dataSendingEnabled")) {
        builder.withDataSendingEnabled(configMap.getBoolean("dataSendingEnabled"))
      }
      if (configMap.hasKey("locationTracking")) {
        builder.withLocationTracking(configMap.getBoolean(("locationTracking")))
      }
      if (configMap.hasKey("maxReportsCount")) {
        builder.withMaxReportsCount(configMap.getInt("maxReportsCount"))
      }
      if (configMap.hasKey("maxReportsInDatabaseCount")) {
        builder.withMaxReportsInDatabaseCount(configMap.getInt("maxReportsInDatabaseCount"))
      }
      if (configMap.hasKey("preloadInfo")) {
        builder.withPreloadInfo(toPreloadInfo(configMap.getMap("preloadInfo")))
      }
      if (configMap.hasKey("revenueAutoTrackingEnabled")) {
        builder.withRevenueAutoTrackingEnabled(configMap.getBoolean("revenueAutoTrackingEnabled"))
      }
      if (configMap.hasKey("sessionTimeout")) {
        builder.withSessionTimeout(configMap.getInt("sessionTimeout"))
      }
      if (configMap.hasKey("userProfileID")) {
        builder.withUserProfileID(configMap.getString("userProfileID"))
      }
      if (configMap.hasKey("location")) {
        builder.withLocation(toLocation(configMap.getMap("location")))
      }
      if (configMap.hasKey("logs")) {
        builder.withLogs()
      }
      if (configMap.hasKey("dispatchPeriodSeconds")) {
        builder.withDispatchPeriodSeconds(configMap.getInt("dispatchPeriodSeconds"))
      }
      if (configMap.hasKey("sessionsAutoTrackingEnabled")) {
        builder.withSessionsAutoTrackingEnabled(configMap.getBoolean("sessionsAutoTrackingEnabled"))
      }
      if (configMap.hasKey("firstActivationAsUpdate")) {
        builder.handleFirstActivationAsUpdate(configMap.getBoolean("firstActivationAsUpdate"))
      }
      if (configMap.hasKey("crashReporting")) {
        builder.withCrashReporting(configMap.getBoolean("crashReporting"))
      }
      if (configMap.hasKey("anrMonitoring")) {
        builder.withAnrMonitoring(configMap.getBoolean("anrMonitoring"))
      }
      if (configMap.hasKey("anrMonitoringTimeout")) {
        builder.withAnrMonitoringTimeout(configMap.getInt("anrMonitoringTimeout"))
      }
      if (configMap.hasKey("deviceType")) {
        builder.withDeviceType(configMap.getString("deviceType"))
      }
      if (configMap.hasKey("nativeCrashReporting")) {
        builder.withNativeCrashReporting(configMap.getBoolean("nativeCrashReporting"))
      }

      return builder.build()
    }

    fun toLocation(locationMap: ReadableMap?): Location? {
      locationMap ?: return null

      val location = Location("Custom")

      locationMap.getDouble("latitude").let { location.latitude = it }
      locationMap.getDouble("longitude").let { location.longitude = it }

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

    fun toRevenueInfo(data: ReadableMap): Revenue {
      val price = data.getDouble("price").toLong()
      val currency = data.getString("currency")

      val revenueInfo = Revenue.newBuilder(price, Currency.getInstance(currency))

      if (data.hasKey("productId")) {
        revenueInfo.withProductID(data.getString("productId"))
      }
      if (data.hasKey("quantity")) {
        revenueInfo.withQuantity(data.getInt("quantity"))
      }

      if (data.hasKey("payload")) {
        val payload = data.getMap("payload")
        revenueInfo.withPayload(payload.toString())
      }

      return revenueInfo.build()
    }
  }
}
