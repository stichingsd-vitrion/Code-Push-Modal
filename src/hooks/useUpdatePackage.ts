import {useEffect} from 'react';
import CodePush from 'react-native-code-push';
import {logCodePush} from '../utils/logCodePush';
import {State} from '../interfaces';
import {Draft} from 'immer';

interface Props {
  setState: (fn: (draft: Draft<State>) => void) => void;
}

export const useUpdatePackage = ({setState}: Props) => {
  useEffect(() => {
    CodePush.getUpdateMetadata().then(packageInfo => {
      if (packageInfo) {
        logCodePush('meta-data', packageInfo);
        setState((draft: State) => {
          draft.packageInfo = packageInfo;
        });
      }
    });
  }, [setState]);
};
