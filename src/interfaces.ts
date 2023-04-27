import {Animated} from 'react-native';

export interface State {
  isMandatory: boolean;
  status: string;
  animatedOpacityValue: Animated.Value;
  animatedScaleValue: Animated.Value;
  updateLater: string;
  storeUrl: string;
  updateInfo: any;
  packageInfo: any;
  initial: boolean;
}
