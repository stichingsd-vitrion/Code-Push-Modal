import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from 'react';
import {
  Animated,
  AppState,
  Linking,
  Platform,
  ImageSourcePropType,
} from 'react-native';
import {useImmer} from 'use-immer';
import CodePush from 'react-native-code-push';
import {
  SYNC_STATUS_STORE_UPDATE,
  SYNC_STATUS_SYNCING,
  SYNC_STATUS_UPDATE_AVAILABLE,
  SYNC_STATUS_UPDATE_INSTALLED,
  SYNC_STATUS_UPDATE_RESTARTING,
} from './constants';
import PushModal from './components/PushModal';
import {useCodePushModal} from './hooks/useCodePushModal';
import {useUpdatePackage} from './hooks/useUpdatePackage';
import {logCodePush} from './utils/logCodePush';
import {ReactNode} from 'react';

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

const CodePushContext = createContext<CodePushContextValue>(null as any);

export const useCodePush = () =>
  useContext<CodePushContextValue>(CodePushContext);

interface Props {
  deploymentKey: string;
  children: ReactNode;
  primaryColor: string;
  iosLink: string;
  androidLink: string;

  updateImage?: ImageSourcePropType;
}

const CodePushProvider = ({
  deploymentKey,
  children,
  primaryColor,
  iosLink,
  androidLink,
  updateImage,
}: Props) => {
  const [state, setState] = useImmer({
    isMandatory: false,
    status: '',
    animatedOpacityValue: new Animated.Value(0),
    animatedScaleValue: new Animated.Value(0),
    updateLater: '',
    storeUrl: '',
    updateInfo: null,
    packageInfo: null,
    initial: true,
  });

  const {_show, _hide, modal} = useCodePushModal({state});

  const [progress, setProgress] = useImmer({
    animatedProgressValue: new Animated.Value(0),
    currentProgress: 0,
  });

  const appState = useRef(AppState.currentState);
  useEffect(() => {
    logCodePush('deploymentKey', deploymentKey);
  }, [deploymentKey]);
  /*Lets CodePush know the app is ready.*/
  useEffect(() => {
    logCodePush('notifyAppReady');
    CodePush.notifyAppReady().then();
  }, []);

  /*Get the current update meta data.*/
  useUpdatePackage({setState});

  const _syncImmediate = useCallback(
    (initial = false) => {
      logCodePush('_syncImmediate called.');

      CodePush.checkForUpdate(deploymentKey, mis => {
        logCodePush('checkForUpdate->binaryVersionMisMatch->', mis);
        setState(draft => {
          draft.updateInfo = mis;
          /*If it is the initial call then start the sync directly*/
          draft.status = SYNC_STATUS_STORE_UPDATE;
        });
        _show();
      }).then(update => {
        logCodePush('update:', update);

        if (update && !update.failedInstall) {
          logCodePush(
            'Chechking for new updates',
            update.label,
            state.updateLater,
          );
          if (
            !state.updateLater ||
            (update.isMandatory && state.updateLater !== update.label)
          ) {
            logCodePush('Update available12', update);
            const {isMandatory} = update;
            setState(draft => {
              draft.isMandatory = isMandatory;
              draft.updateInfo = update;
              /*If it is the initial call then start the sync directly*/
              draft.status = initial
                ? SYNC_STATUS_SYNCING
                : SYNC_STATUS_UPDATE_AVAILABLE;
            });
            _show();

            /*If it is the initial call then start the sync directly*/
            if (initial) {
              logCodePush('_syncImmediate-> isinitial');

              _immediateUpdate(true);
            }
          }
        } else {
          logCodePush('No update available', update);
        }
      });
    },
    // eslint-disable-next-line
    [_show, deploymentKey, setState, state.updateLater]
  );

  const runSync = useCallback(
    nextAppState => {
      logCodePush('appstate');
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        logCodePush('Starting sync appstate now');
        _syncImmediate();
      }
      appState.current = nextAppState;
    },
    [_syncImmediate],
  );

  useEffect(() => {
    _syncImmediate(true);
  }, [_syncImmediate]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', runSync);
    return () => {
      subscription && subscription.remove();
    };
  }, [runSync]);

  const openStore = () => {
    let link = '';
    if (Platform.OS === 'ios') {
      // link =
      //   'itms-apps://apps.apple.com/tr/app/photocommerce/id1578281921?l=tr';
      link = iosLink;
    } else {
      link = androidLink;
      // link = 'https://play.google.com/store/apps/details?id=com.photocommerce';
    }
    logCodePush('About to open:', link);
    Linking.canOpenURL(link).then(
      supported => {
        supported && Linking.openURL(link);
      },
      err => console.log(err),
    );
  };

  const _immediateUpdate = (initial = false) => {
    logCodePush('_immediateUpdate->initial::', initial);
    if (state.status === SYNC_STATUS_STORE_UPDATE) {
      logCodePush('Store update');
      openStore();
    } else {
      if (initial) {
        logCodePush('Inside -> _immediateUpdate: Initial');

        setState(draft => {
          draft.status = SYNC_STATUS_SYNCING;
        });
        const codePushOptions = {
          installMode: CodePush.InstallMode.IMMEDIATE,
          mandatoryInstallMode: CodePush.InstallMode.IMMEDIATE,
          deploymentKey: deploymentKey,
          rollbackRetryOptions: {
            delayInHours: 1,
            maxRetryAttempts: 3,
          },
        };
        CodePush.sync(
          codePushOptions,
          status => {
            _codePushStatusDidChange(status, true);
          },
          _codePushDownloadDidProgress,
          // _storeCheck,
        ).then();
      } else {
        logCodePush('Inside -> _immediateUpdate: Not initial');
        if (state.status !== SYNC_STATUS_SYNCING) {
          setState(draft => {
            draft.status = SYNC_STATUS_SYNCING;
          });
          const codePushOptions = {
            installMode: CodePush.InstallMode.ON_NEXT_RESTART,
            mandatoryInstallMode: CodePush.InstallMode.ON_NEXT_RESTART,
            deploymentKey: deploymentKey,
            rollbackRetryOptions: {
              delayInHours: 1,
              maxRetryAttempts: 3,
            },
          };
          CodePush.sync(
            codePushOptions,
            _codePushStatusDidChange,
            _codePushDownloadDidProgress,
            // _storeCheck,
          ).then();
        }
      }
    }
  };

  /*Callback for sync to set status to our state.*/
  const _codePushStatusDidChange = (syncStatus, initial = false) => {
    logCodePush('syncStatus', syncStatus, initial);
    switch (syncStatus) {
      case CodePush.SyncStatus.UPDATE_INSTALLED:
        setState(draft => {
          draft.status = initial
            ? SYNC_STATUS_UPDATE_RESTARTING
            : SYNC_STATUS_UPDATE_INSTALLED;
        });
        break;
      default:
        break;
    }
  };

  /*This is the downloadProgress listener we pass to the download screen*/
  const _codePushDownloadDidProgress = prog => {
    const {receivedBytes, totalBytes} = prog;
    let temp = receivedBytes / totalBytes;
    setProgress(draft => {
      draft.currentProgress = temp;
    });
    if (temp <= 1) {
      setProgress(draft => {
        draft.animatedProgressValue.setValue(temp);
      });
    }
  };

  /*
                    Set update later, but if mandatory then set the version as the updateLater,
                    this allows us to force a new mandatory if it is present
                    */
  const _updateLater = () => {
    setState(draft => {
      draft.updateLater = draft.isMandatory ? draft.updateInfo.label : true;
    });
    _hide();
  };

  const showAndUpdate = () => {
    _immediateUpdate(false);
    _show();
  };

  return (
    <>
      <CodePushContext.Provider
        value={{
          showAndUpdate,
          updateInfo: state.updateInfo,
          packageInfo: state.packageInfo,
          status: state.status,
          isMandatory: state.isMandatory,
          progress,
          animatedOpacityValue: state.animatedOpacityValue,
          animatedScaleValue: state.animatedScaleValue,
          modal,
          storeMandatoryUpdate: false,
          updateLater: state.updateLater,
          _immediateUpdate,
          _syncImmediate,
          _updateLater,
          _hide,
          primaryColor,
          openStore,
        }}>
        {children}
        <PushModal updateImage={updateImage} />
      </CodePushContext.Provider>
    </>
  );
};

export default CodePushProvider;
