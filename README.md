# @vitrion/code-push-modal

A wrapper around CodePush, custom modal for sync, multiple extra features, and i18n integration.

## Installation

To use `@vitrion/code-push-modal` in your project, run the following command:

npm:
```
npm install @vitrion/code-push-modal
```

```
yarn add @vitrion/-code-push-modal
```


## Usage

Wrap your app with `CodePushProvider` to enable code-push sync with a custom modal. Here's an example of how to use it:

```typescript
import {
  CodePushProvider,
} from '@vitrion/code-push-modal';

const stagingKey = isIOS ? stagingKey_iOS : stagingKey_android;
const productionKey = isIOS ? productionKey_iOS : productionKey_android;
export const codePushDeploymentKey = __DEV__ ? stagingKey : productionKey;

<CodePushProvider
  deploymentKey={codePushDeploymentKey}
  primaryColor={'#33AF95'}
>
  // Your app content here
</CodePushProvider>
```

To use Sentry with CodePush, you'll need to initialize it by calling initCodePushSentry in your main.tsx file. This function takes two arguments: the current version of your app (which you can get from your package.json file) and a callback function that initializes Sentry with the appropriate configuration.

Here's an example of how to use initCodePushSentry:
```typescript
import { initCodePush } from '@vitrion/code-push-modal';
import * as Sentry from '@sentry/react-native';
import { version } from '../package.json';

const initializeSentry = ({ release, dist }) => {
    Sentry.init({
        dsn: 'https://your-sentry-dsn',
        environment: __DEV__ ? 'development' : 'production',
        enableAutoSessionTracking: false,
        release,
        dist,
        integrations: [
            new Sentry.ReactNativeTracing({
                routingInstrumentation,
            }),
        ],
    });
};

initCodePush(version, initializeSentry).then();
```

Finally, you can use the useCodePush hook to get all data from CodePush:

```typescript
import { useCodePush } from '@vitrion-native/vitrion-native-code-push';

interface CodePushContextValue {
  showAndUpdate: () => void;
  updateInfo: any;
  packageInfo: any;
  status: string;
  isMandatory: boolean;
  progress: any;
  animatedOpacityValue: Animated.Value;
  animatedScaleValue: Animated.Value;
  modal: boolean;
  storeMandatoryUpdate: boolean;
  updateLater: string;
  _immediateUpdate: () => void;
  _syncImmediate: () => void;
  _updateLater: () => void;
  _hide: () => void;
  primaryColor?: string;
  openStore?: () => void;
}

// Example usage
const {
  showAndUpdate,
  updateInfo,
  packageInfo,
  status,
  isMandatory,
  progress,
  animatedOpacityValue,
  animatedScaleValue,
  modal,
  storeMandatoryUpdate,
  updateLater,
  _immediateUpdate,
  _syncImmediate,
  _updateLater,
  _hide,
  primaryColor,
  openStore,
}: CodePushContextValue = useCodePush();
```

Enjoy hassle-free CodePush sync with this powerful wrapper!


