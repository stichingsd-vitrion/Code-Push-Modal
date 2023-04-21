import {useEffect} from 'react';
import CodePush from 'react-native-code-push';
import {logCodePush} from '../utils/logCodePush';

export const useUpdatePackage = ({setState}) => {
  useEffect(() => {
    CodePush.getUpdateMetadata().then(packageInfo => {
      if (packageInfo) {
        logCodePush('meta-data', packageInfo);
        setState(draft => {
          draft.packageInfo = packageInfo;
        });
      }
    });
  }, [setState]);
};
