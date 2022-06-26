import React, {FC, useEffect} from 'react';
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
  useEffect(() => {
    rotateY.value = 0;
    width.value = Constants.S_WIDTH;
    height.value = Constants.TAB_HEIGHT_F;
  }, []);

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

  const animate = (toValue: {
    rotateY: number;
    width: number;
    height: number;
  }) => {
    //console.debug('toValue: ', toValue);

    //rotateY.value = type == 'in' ? toValue : 0;
    rotateY.value = withTiming(toValue.rotateY, {
      duration: 100,
      easing: Easing.linear,
    });

    //width.value = Constants.S_WIDTH;
    width.value = withTiming(toValue.width, {
      duration: 100,
      easing: Easing.linear,
    });

    //height.value = Constants.TAB_HEIGHT_F;
    height.value = withTiming(toValue.height, {
      duration: 100,
      easing: Easing.linear,
    });
  };

  const _onClick = (label: string, type: 'in' | 'out') => {
    let toValue = {
      rotateY: 0,
      width: type === 'in' ? Constants.S_WIDTH - 16 : Constants.S_WIDTH,
      height:
        type === 'in' ? Constants.TAB_HEIGHT_F - 4 : Constants.TAB_HEIGHT_F,
    };

    if (label === 'Home') {
      toValue.rotateY = type === 'in' ? -25 : 0;
    } else if (label === 'Search') {
      toValue.rotateY = 0;
    } else if (label === 'Settings') {
      toValue.rotateY = type === 'in' ? 25 : 0;
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
