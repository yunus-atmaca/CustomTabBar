import React, {FC} from 'react';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {StyleSheet, View} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import Tab from './Tab';
import {Constants} from '../../utils';

const MicroInteractionTabs: FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const rotateY = useSharedValue(0);
  const width = useSharedValue(Constants.S_WIDTH);
  const height = useSharedValue(Constants.TAB_HEIGHT_F);
  const animatedS = useAnimatedStyle(() => {
    return {
      transform: [{rotateY: `${rotateY.value}deg`}],
      width: width.value,
      height: height.value,
    };
  });

  const animate = (toValue: number) => {
    rotateY.value = 0;
    rotateY.value = withRepeat(
      withTiming(toValue, {
        duration: 100,
        easing: Easing.linear,
      }),
      2,
      true,
    );

    width.value = Constants.S_WIDTH;
    width.value = withRepeat(
      withTiming(Constants.S_WIDTH - 16, {
        duration: 100,
        easing: Easing.linear,
      }),
      2,
      true,
    );

    height.value = Constants.TAB_HEIGHT_F;
    height.value = withRepeat(
      withTiming(Constants.TAB_HEIGHT_F - 4, {
        duration: 100,
        easing: Easing.linear,
      }),
      2,
      true,
    );
  };

  const _onClick = (label: string) => {
    let toValue = 0;
    if (label === 'Home') {
      toValue = -25;
    } else if (label === 'Search') {
      toValue = 0;
    } else if (label === 'Settings') {
      toValue = 25;
    }
    animate(toValue);
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.animated, animatedS]}>
        {state.routes.map((_, index) => {
          return (
            <Tab
              key={'tab-' + index}
              onClick={_onClick}
              state={state}
              index={index}
              navigation={navigation}
              descriptors={descriptors}
            />
          );
        })}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: Constants.TAB_HEIGHT_B,
    width: Constants.S_WIDTH,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  animated: {
    height: Constants.TAB_HEIGHT_F,
    width: Constants.S_WIDTH,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.5,
    shadowRadius: 16.0,

    elevation: 24,
  },
});

export default MicroInteractionTabs;
