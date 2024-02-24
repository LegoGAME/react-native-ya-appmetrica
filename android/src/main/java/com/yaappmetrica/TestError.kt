package com.yaappmetrica

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.util.logging.LogManager
import java.util.logging.LogRecord

class TestError(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName() = "TestError"

  @ReactMethod
  fun criticalError() {
    throw Exception("Critical error")
  }
}
