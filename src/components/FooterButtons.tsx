import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useCodePush} from '../CodePushProvider';
import {useTranslation} from 'react-i18next';

export const FooterButtons = ({
  hideOptionalButton = false,
  onPressOptional = () => {},
  optionalText = 'Mandatory Text',
  onPress = () => {},
  text = 'Text',
}) => {
  const {primaryColor} = useCodePush();
  const {t} = useTranslation();

  return (
    <View style={styles.row}>
      {hideOptionalButton && (
        <TouchableOpacity
          style={[styles.deactiveButton]}
          onPress={onPressOptional}>
          <Text style={[styles.deactiveButtonText]}>{t(optionalText)}</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={[styles.activeButton, {backgroundColor: primaryColor}]}
        onPress={onPress}>
        <Text style={[styles.activeButtonText]}>{t(text)}</Text>
      </TouchableOpacity>
    </View>
  );
};
const isIOS = Platform.OS === 'ios';
const fontMedium = isIOS
  ? {fontFamily: 'Avenir-Medium'}
  : {fontFamily: 'sans-serif'};
const styles = StyleSheet.create({
  activeButtonText: {
    fontSize: 16,
    textAlign: 'center',

    color: 'white',
    marginHorizontal: 20,
    marginVertical: 10,
    ...fontMedium,
  },
  activeButton: {
    flex: 0.5,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  deactiveButton: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    backgroundColor: '#dae4f2',
    borderRadius: 4,
  },
  deactiveButtonText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#474f61',
    marginHorizontal: 20,
    marginVertical: 10,
    ...fontMedium,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
