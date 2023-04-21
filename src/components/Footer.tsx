import {
  SYNC_STATUS_STORE_UPDATE,
  SYNC_STATUS_SYNCING,
  SYNC_STATUS_UPDATE_AVAILABLE,
  SYNC_STATUS_UPDATE_INSTALLED,
  SYNC_STATUS_UPDATE_RESTARTING,
} from '../constants';
import {Platform, StyleSheet, View} from 'react-native';
import React from 'react';
import {FooterButtons} from './FooterButtons';
import {useCodePush} from '../CodePushProvider';
import {RenderProgressBar} from './ProgressBar';
import CodePush from 'react-native-code-push';
import {useTranslation} from 'react-i18next';

export const Footer = () => {
  const {status, isMandatory, progress, _immediateUpdate, _updateLater} =
    useCodePush();
  const {t} = useTranslation();
  const BottomView = () => {
    switch (status) {
      case SYNC_STATUS_SYNCING:
        return (
          <RenderProgressBar
            animatedProgressValue={progress.animatedProgressValue}
            currentProgress={progress.currentProgress}
          />
        );
      default:
        return (
          <FooterButtons
            optionalText={
              status === SYNC_STATUS_UPDATE_AVAILABLE ||
              status === SYNC_STATUS_STORE_UPDATE
                ? t('sync:code_push.optional_button.update')
                : t('sync:code_push.optional_button.restart')
            }
            onPressOptional={_updateLater}
            onPress={() => {
              if (status === SYNC_STATUS_UPDATE_INSTALLED) {
                CodePush.restartApp();
              } else {
                _immediateUpdate();
              }
            }}
            text={
              status === SYNC_STATUS_UPDATE_AVAILABLE
                ? t('sync:code_push.button.update')
                : status === SYNC_STATUS_STORE_UPDATE
                ? t(
                    `sync:code_push.button.${
                      Platform.OS === 'ios' ? 'appstore' : 'playstore'
                    }`,
                  )
                : t('sync:code_push.button.restart')
            }
            hideOptionalButton={
              !isMandatory && status !== SYNC_STATUS_UPDATE_RESTARTING
            }
          />
        );
    }
  };

  return (
    <View style={[styles.bottomContainer]}>
      <BottomView />
    </View>
  );
};

const styles = StyleSheet.create({
  bottomContainer: {
    height: 80,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
