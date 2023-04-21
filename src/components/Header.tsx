import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ImageSourcePropType,
} from 'react-native';
import React from 'react';
import {useCodePush} from '../CodePushProvider';
import {useTranslation} from 'react-i18next';

interface Props {
  updateImage?: ImageSourcePropType;
}

export const Header: React.FC<Props> = ({updateImage}) => {
  const {status, updateInfo, primaryColor} = useCodePush();
  const {t} = useTranslation();

  const _getVersion = () => {
    if (updateInfo) {
      const {label, appVersion} = updateInfo;
      const buildNumber = label ? `(${label.substring(1)})` : '';
      return `Version: ${appVersion} ${buildNumber}`;
    }
    return null;
  };
  const version = _getVersion();
  return (
    <View style={[styles.headerContainer]}>
      {updateImage && (
        <Image
          source={updateImage}
          style={{height: 150}}
          resizeMode="contain"
        />
      )}
      <Text style={[styles.title, {color: primaryColor}]}>
        {t(`sync:code_push.${status}.header`)}
      </Text>
      <TouchableOpacity style={[styles.versionContainer]} activeOpacity={0.7}>
        <Text style={[styles.version]}>{version}</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    marginVertical: 15,
  },
  title: {
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 5,
    fontSize: 25,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  versionContainer: {
    justifyContent: 'center',
    marginBottom: 5,
  },
  version: {
    opacity: 0.5,
    marginHorizontal: 20,
    fontSize: 14,
    color: '#000000',
  },
});
