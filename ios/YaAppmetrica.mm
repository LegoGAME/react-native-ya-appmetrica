#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_REMAP_MODULE(AppMetrica, YaAppmetrica, NSObject)

RCT_EXTERN_METHOD(activate: (NSDictionary*)config onError: (RCTResponseSenderBlock)onError)
RCT_EXTERN_METHOD(reportEvent: (nonnull NSString*)eventName attributes:(NSDictionary*)attributes)
RCT_EXTERN_METHOD(sendEventsBuffer)
RCT_EXTERN_METHOD(pauseSession)
RCT_EXTERN_METHOD(resumeSession)
RCT_EXTERN_METHOD(reportAppOpen: (nonnull NSString*)deeplink)
RCT_EXTERN_METHOD(setUserProfileID: (nonnull NSString*)userID)
RCT_EXTERN_METHOD(reportUserProfile: (NSDictionary*)profileData onError: (RCTResponseSenderBlock)onError)
RCT_EXTERN_METHOD(setStatisticsSending: (BOOL)enabled)
RCT_EXTERN_METHOD(setLocationTracking: (BOOL)enabled)
RCT_EXTERN_METHOD(reportRevenue: (NSDictionary*)data onError: (RCTResponseSenderBlock)onError)
RCT_EXTERN_METHOD(getSystemInfo: (RCTResponseSenderBlock)callback)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end

@interface RCT_EXTERN_REMAP_MODULE(AppMetricaCrashes, YaAppMetricaCrashes, NSObject)

RCT_EXTERN_METHOD(configureCrashes: (NSDictionary*)config)
RCT_EXTERN_METHOD(reportError: (nonnull NSString*)name stack:(nonnull NSString*)stack)
RCT_EXTERN_METHOD(criticalError)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
