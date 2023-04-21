import {
  Animated,
  Dimensions,
  Modal,
  Platform,
  StyleSheet,
  ImageSourcePropType,
} from 'react-native';
import React from 'react';
import {useCodePush} from '../CodePushProvider';
import {Header} from './Header';
import {Body} from './Body';
import {Footer} from './Footer';

const {width, height} = Dimensions.get('window');
const dialogWidth = width - 20;
const dialogHeight = height * 0.8;
const getModalAnimation = ({animationType = 'scale', animatedScaleValue}) => {
  if (animationType === 'scale') {
    const scale = animatedScaleValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    const opacity = animatedScaleValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 0.7, 1],
      extrapolate: 'clamp',
    });

    return {
      transform: [{scale}],
      opacity,
    };
  }

  const translateY = animatedScaleValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [-height, -height / 4, 0],
    extrapolate: 'clamp',
  });
  const opacity = animatedScaleValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.7, 1],
    extrapolate: 'clamp',
  });
  return {
    opacity,
    transform: [{translateY}],
  };
};

interface Props {
  updateImage?: ImageSourcePropType;
}

const PushModal: React.FC<Props> = ({updateImage}) => {
  const {animatedOpacityValue, modal, animatedScaleValue} = useCodePush();
  const opacity = animatedOpacityValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.7, 1],
  });

  const opacityStyle = {
    opacity,
  };

  const animationTypeContainer = getModalAnimation({animatedScaleValue});

  return (
    <Modal transparent visible={modal}>
      <Animated.View
        style={[
          styles.modal,
          {
            backgroundColor: modal ? 'rgba(35,36,38,0.8)' : 'transparent',
          },
          opacityStyle,
        ]}>
        {modal && (
          <Animated.View style={[styles.container, animationTypeContainer]}>
            <Header updateImage={updateImage} />
            <Body />
            <Footer />
          </Animated.View>
        )}
      </Animated.View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  modal: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    alignItems: 'center',
    width: dialogWidth,
    maxHeight: dialogHeight,
    overflow: 'hidden',
    backgroundColor: 'white',
    ...Platform.select({
      android: {
        elevation: 4,
      },
      ios: {
        shadowColor: '#000000',
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
    }),
    borderRadius: 14,
  },
});

export default PushModal;
