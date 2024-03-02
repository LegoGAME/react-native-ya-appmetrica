package com.yaappmetrica

import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
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
      onError(error.localizedMessage)
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
}
