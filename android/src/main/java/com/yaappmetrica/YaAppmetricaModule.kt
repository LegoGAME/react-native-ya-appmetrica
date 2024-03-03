package com.yaappmetrica

import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableNativeMap
import io.appmetrica.analytics.AppMetrica

class YaAppmetricaModule(val reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName() = "AppMetrica"

  private fun enableActivityAutoTracking() {
    currentActivity?.application?.let {
      AppMetrica.enableActivityAutoTracking(it)
    }
  }

  @ReactMethod
  fun activate(config: ReadableMap) {
    val metricaConfig = Utils.toAppMetricaConfig(config)
    AppMetrica.activate(this.reactContext, metricaConfig)
    this.enableActivityAutoTracking()
  }

  @ReactMethod
  fun reportEvent(eventName: String, attributes: ReadableMap?) {
    if (attributes == null) {
      AppMetrica.reportEvent(eventName)
    } else {
      AppMetrica.reportEvent(eventName, attributes.toHashMap())
    }
  }

  @ReactMethod
  fun sendEventsBuffer() {
    AppMetrica.sendEventsBuffer()
  }

  @ReactMethod
  fun pauseSession() {
    AppMetrica.pauseSession(this.currentActivity)
  }

  @ReactMethod
  fun resumeSession() {
    AppMetrica.resumeSession(this.currentActivity)
  }

  @ReactMethod
  fun reportAppOpen(deeplink: String) {
    AppMetrica.reportAppOpen(deeplink)
  }

  @ReactMethod
  fun setUserProfileID(userID: String) {
    AppMetrica.setUserProfileID(userID)
  }

  @ReactMethod
  fun reportUserProfile(profileData: ReadableMap, onError: Callback) {
    if (profileData.hasKey("userProfileID")) {
      AppMetrica.setUserProfileID(profileData.getString("userProfileID"))
    }

    try {
      val profile = Utils.toProfile(profileData)
      AppMetrica.reportUserProfile(profile)
    } catch (error: Exception) {
      onError(error)
    }
  }

  @ReactMethod
  fun setStatisticsSending(enabled: Boolean) {
    AppMetrica.setDataSendingEnabled(enabled)
  }

  @ReactMethod
  fun setLocationTracking(enabled: Boolean){
    AppMetrica.setLocationTracking(enabled)
  }

  @ReactMethod
  fun reportRevenue(data: ReadableMap, onError: Callback) {
    try {
      val revenue = Utils.toRevenueInfo(data)
      AppMetrica.reportRevenue(revenue)
    } catch (error: Exception) {
      onError(error)
    }
  }

  @ReactMethod
  fun getSystemInfo(callback: Callback) {
    val libVersion = AppMetrica.getLibraryVersion()
    val deviceId = AppMetrica.getDeviceId(this.reactContext)
    val uuid = AppMetrica.getUuid(this.reactContext)

    val map = WritableNativeMap()
    map.putString("library_version", libVersion)
    map.putString("appmetrica_device_id", deviceId)
    map.putString("uuid", uuid)

    callback(map)
  }
}
