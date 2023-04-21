import * as Sentry from '@sentry/react-native';

export const routingInstrumentation =
  new Sentry.ReactNavigationInstrumentation();
