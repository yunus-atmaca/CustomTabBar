import React, {FC, useEffect, useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import Svg, {Path} from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

import {Constants} from '../../utils';

//unit vertical
const V = 12;
//unit horizontal
const H = (Constants.S_WIDTH - 48) / 20;

const TAB_HEIGHT_F = 12 * 6;

const AnimatedPath = Animated.createAnimatedComponent(Path);

const Liquid: FC<BottomTabBarProps> = ({}) => {
  const mul = useRef(1);

  const Q1 = useSharedValue(1);
  const Q2 = useSharedValue(2);
  const Q3 = useSharedValue(3);

  const animatedProps = useAnimatedProps(() => {
    const path = `
    M ${2 * H} 0
    Q 0 0 0 ${2 * V}
    V ${4 * V}
    Q 0 ${6 * V} ${2 * H} ${6 * V}
    H ${18 * H}
    Q ${20 * H} ${6 * V} ${20 * H} ${4 * V}
    V ${2 * V}
    Q ${20 * H} 0 ${18 * H} 0
    H ${16 * H}
    Q ${15 * H} ${0 * V} ${14 * H} ${Q1.value * V}
    C ${13 * H} ${Q2.value * V} ${11 * H} ${Q3.value * V} ${10 * H} ${
      Q3.value * V
    }
    C ${9 * H} ${Q3.value * V} ${7 * H} ${Q2.value * V} ${6 * H} ${Q1.value * V}
    Q ${5 * H} ${0 * V} ${4 * H} ${0 * V}
    H ${2 * H}
  `;
    return {
      d: path,
    };
  });

  useEffect(() => {
    Q1.value = withTiming(0, {
      duration: 300,
      easing: Easing.linear,
    });

    Q2.value = withTiming(0, {
      duration: 300,
      easing: Easing.linear,
    });

    const q3Finished = (oldVal: number) => {
      if (oldVal === 0) return;

      const toVal = getNewValue(oldVal);

      Q3.value = withTiming(
        toVal,
        {
          duration: 150,
          easing: Easing.ease,
        },
        () => {
          'worklet';
          runOnJS(q3Finished)(toVal);
        },
      );
    };

    Q3.value = withTiming(
      -2,
      {
        duration: 300,
        easing: Easing.linear,
      },
      () => {
        'worklet';
        runOnJS(q3Finished)(-2);
      },
    );

    return () => {
      Q1.value = 1;
      Q2.value = 2;
      Q3.value = 3;
    };
  }, []);

  const getNewValue = (currentVal: number) => {
    const absVal = Math.abs(currentVal);
    let returnVal = currentVal;
    if (absVal - 0.4 > 0) {
      returnVal = (absVal - 0.4) * mul.current;
    } else {
      returnVal = 0;
    }

    mul.current *= -1;
    console.debug('returnVal: ', returnVal);
    return returnVal;
  };

  return (
    <View style={styles.container}>
      <View style={styles.svgContainer}>
        {
          <Svg
            viewBox={`0 -40 ${Constants.S_WIDTH - 48} ${TAB_HEIGHT_F * 2}`}
            style={{
              width: '100%',
              height: TAB_HEIGHT_F + 100,
              backgroundColor: 'gray',
              paddingTop: 50,
            }}>
            <AnimatedPath
              animatedProps={animatedProps}
              //stroke="blue"
              //strokeWidth={1}
              fill="white"
              //fillRule="evenodd"
            />
          </Svg>
        }
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    //height: TAB_HEIGHT_B,
    width: Constants.S_WIDTH,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  svgContainer: {
    //height: TAB_HEIGHT_F,
    width: '100%',
    overflow: 'visible',
  },
});

export default Liquid;
