declare const __DEV__: boolean;
import CodePush from 'react-native-code-push';
import * as Sentry from '@sentry/react-native';
import {routingInstrumentation} from './sentryInit';

export const initCodePushSentry = async (
  version: string,
  sentry_dsn: string,
) => {
  let update;
  try {
    update = await CodePush.getUpdateMetadata();
  } catch (error) {
    console.log('initializeSentry1', error);
    /*Silent fail*/
  }

  let dist = 'v0';
  let staging = '';
  let appVersion = version;
  if (update?.label) {
    dist = update.label;
    if (__DEV__) {
      staging = '-staging';
    }
  }
  if (update?.appVersion) {
    appVersion = update.appVersion;
  }

  let release = `${appVersion}-${dist}${staging}`;

  Sentry.init({
    dsn: sentry_dsn,
    // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
    // We recommend adjusting this value in production.
    tracesSampleRate: 0.25, // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
    // We recommend adjusting this value in production.
    environment: __DEV__ ? 'development' : 'production',
    // debug: __DEV__,

    enableAutoSessionTracking: false, // default: true
    release,
    dist,
    integrations: [
      new Sentry.ReactNativeTracing({
        // Pass instrumentation to be used as `routingInstrumentation`
        routingInstrumentation,
        // ...
      }),
    ],
  });
};
