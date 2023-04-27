import {useCallback, useState} from 'react';
import {Animated} from 'react-native';
import {State} from '../interfaces';

export const useCodePushModal = ({state}: {state: State}) => {
  // const [modal, toggleModel] = useState(true);
  const [modal, toggleModel] = useState(false);
  const _show = useCallback(() => {
    toggleModel(true);
    Animated.sequence([
      Animated.timing(state.animatedOpacityValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(state.animatedScaleValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [state.animatedOpacityValue, state.animatedScaleValue]);

  const _hide = () => {
    Animated.sequence([
      Animated.timing(state.animatedScaleValue, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(state.animatedOpacityValue, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      toggleModel(false);
    });
  };
  return {_show, _hide, modal};
};
