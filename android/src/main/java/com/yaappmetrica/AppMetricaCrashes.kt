package com.yaappmetrica

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import io.appmetrica.analytics.AppMetrica

class AppMetricaCrashes(val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
  override fun getName() = "AppMetricaCrashes"

  @ReactMethod
  fun criticalError() {
    throw Exception("Critical error")
  }

  @ReactMethod
  fun reportError(name: String, stack: String) {
    AppMetrica.reportError(name, stack)
  }
}
