declare const __DEV__: boolean;
import CodePush from 'react-native-code-push';

interface InitCodePushCallbackProps {
  release: string;
  dist: string;
}

export const initCodePush = async (
  version: string,
  callback?: (props: InitCodePushCallbackProps) => void,
) => {
  let update;
  try {
    update = await CodePush.getUpdateMetadata();
  } catch (error) {
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
  callback && callback({release, dist});
};
