import React from 'react';
import {Platform, StyleSheet, Text, View, Animated} from 'react-native';
import {progressBarWidth} from '../constants';
import {useTranslation} from 'react-i18next';
import {useCodePush} from '../CodePushProvider';

interface RenderProgressBarProps {
  animatedProgressValue: Animated.Value;
  currentProgress: number;
}
export const RenderProgressBar = ({
  animatedProgressValue,
  currentProgress,
}: RenderProgressBarProps) => {
  const {primaryColor} = useCodePush();
  const {t} = useTranslation();
  const translateX = animatedProgressValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-progressBarWidth, 0],
  });
  const animationStyle = {
    transform: [{translateX}],
  };
  const color = animatedProgressValue.interpolate({
    inputRange: [0, 0.4, 0.6, 1],
    outputRange: ['#474f61', '#474f61', 'white', 'white'],
  });

  const roundedValue = (currentProgress * 100).toFixed(2);
  const progress = `${roundedValue}%`;

  return (
    <View style={[{alignItems: 'center'}]}>
      <View style={[styles.progressBar]}>
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              height: 16,
              borderRadius: 16 / 2,
              backgroundColor: primaryColor,
            },
            animationStyle,
          ]}
        />
        <Animated.Text style={[{color}]}>{progress}</Animated.Text>
      </View>
      <Text style={[styles.syncMessage]}>
        {t('sync:code_push.syncing.loader')}
      </Text>
    </View>
  );
};
const isIOS = Platform.OS === 'ios';
const fontLight = isIOS
  ? {fontFamily: 'Avenir-Light'}
  : {fontFamily: 'sans-serif-light'};

const styles = StyleSheet.create({
  syncMessage: {
    marginTop: 6,
    fontSize: 14,
    color: '#474f61',
    ...fontLight,
  },
  progressBar: {
    fontSize: 13,
    width: progressBarWidth,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#dae4f2',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
