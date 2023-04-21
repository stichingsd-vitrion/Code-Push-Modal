import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useCodePush} from '../CodePushProvider';
import {SYNC_STATUS_UPDATE_INSTALLED} from '../constants';
import {useTranslation} from 'react-i18next';

export const Description = () => {
  const {updateInfo, status} = useCodePush();
  const {t} = useTranslation();
  const getDefaultText = () => {
    if (status === SYNC_STATUS_UPDATE_INSTALLED) {
      return t(`sync:code_push.${SYNC_STATUS_UPDATE_INSTALLED}.description`);
    }

    return '';
  };

  if (!updateInfo || !updateInfo.description) {
    if (!getDefaultText()) {
      return null;
    }
    return <Text style={[styles.defaultDesc]}>{getDefaultText()}</Text>;
  }

  return (
    <View style={[{marginBottom: 20}]}>
      <Text style={[styles.descriptionTitle]}>
        {t('sync:code_push.description.whats_new')}
      </Text>
      <ScrollView style={{maxHeight: 220}}>
        <Text>{updateInfo.description}</Text>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  defaultDesc: {
    fontSize: 18,
    color: '#000000',
    marginBottom: 5,
  },
  descriptionTitle: {
    fontSize: 18,
    color: '#000000',
    marginBottom: 5,
  },
  description: {
    color: '#000000',
    paddingVertical: 0,
  },
});
