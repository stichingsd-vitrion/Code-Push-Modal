import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useCodePush} from '../CodePushProvider';
import {Description} from './Description';
import {SYNC_STATUS_UPDATE_INSTALLED} from '../constants';
import {useTranslation} from 'react-i18next';

export const Body = () => {
  const {t} = useTranslation();
  const {isMandatory, status} = useCodePush();
  const getTitle = () => {
    return t(`sync:code_push.${status}.${isMandatory ? 'mandatory' : 'title'}`);
  };

  return (
    <View style={styles.contentContainer}>
      <Description />
      {getTitle() ? (
        <Text
          style={[
            styles.confirmText,
            {
              textAlign:
                status === SYNC_STATUS_UPDATE_INSTALLED ? 'left' : 'center',
            },
          ]}>
          {getTitle()}
        </Text>
      ) : null}
    </View>
  );
};
const styles = StyleSheet.create({
  contentContainer: {
    alignSelf: 'stretch',
    marginHorizontal: 20,
  },
  descriptionTitle: {
    fontSize: 18,
    color: '#000000',
    marginBottom: 5,
  },
  confirmText: {
    fontSize: 18,
    color: '#000000',
    marginBottom: 5,
  },
});
