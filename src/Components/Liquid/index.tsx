import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet, View, TouchableOpacity, Image} from 'react-native';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import Svg, {Path} from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
  runOnJS,
  useAnimatedStyle,
} from 'react-native-reanimated';

import {Constants} from '../../utils';

const AnimatedPath = Animated.createAnimatedComponent(Path);

//unit vertical
const V = 12;
//unit horizontal
const H = (Constants.S_WIDTH - 48) / 20;
//unitDuration
const U_D = 100;

const TAB_HEIGHT_F = 12 * 6;
const TAB_WIDTH_F = Constants.S_WIDTH - 48;

type TAB_STATUS =
  | 'CLOSED'
  | 'OPENING'
  | 'EXTENDING'
  | 'COLLAPSING'
  | 'OPENED'
  | 'CLOSING';

const Liquid: FC<BottomTabBarProps> = ({}) => {
  const mul = useRef(1);
  //const status = useRef<TAB_STATUS>('CLOSED');

  const [status, setStatus] = useState<TAB_STATUS>('CLOSED');

  const plusY = useSharedValue(0);
  const width = useSharedValue((TAB_HEIGHT_F / 4) * 3);

  const animatedPlusY = useAnimatedStyle(() => {
    return {
      transform: [{translateY: plusY.value}],
    };
  });

  const animatedPlusW = useAnimatedStyle(() => {
    return {
      width: width.value,
    };
  });

  const Q1 = useSharedValue(2);
  const Q2 = useSharedValue(3);

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
    Q ${15 * H} ${0 * V} ${14 * H} ${(Q1.value / 2) * V}
    C ${13 * H} ${Q1.value * V} ${11 * H} ${Q2.value * V} ${10 * H} ${
      Q2.value * V
    }
    C ${9 * H} ${Q2.value * V} ${7 * H} ${Q1.value * V} ${6 * H} ${
      (Q1.value / 2) * V
    }
    Q ${5 * H} ${0 * V} ${4 * H} ${0 * V}
    H ${2 * H}
  `;
    return {
      d: path,
    };
  });

  useEffect(() => {
    return () => {
      Q1.value = 2;
      Q2.value = 3;

      plusY.value = 0;
      width.value = (TAB_HEIGHT_F / 4) * 3;

      setStatus('CLOSED');
    };
  }, []);

  const OpeningAnimationPlus = () => {
    const onFinishPlusY = () => {
      const onFinishPlusW = () => {
        setStatus('OPENED');
      };

      setTimeout(() => {
        setStatus('EXTENDING');
        width.value = withTiming(
          (TAB_WIDTH_F / 4) * 3,
          {
            duration: U_D * 2.5,
            easing: Easing.linear,
          },
          () => {
            'worklet';
            runOnJS(onFinishPlusW)();
          },
        );
      }, 75);
    };

    plusY.value = withTiming(
      -4 * V,
      {
        duration: U_D * 1.5,
        easing: Easing.linear,
      },
      () => {
        'worklet';
        runOnJS(onFinishPlusY)();
      },
    );
  };

  const ClosingAnimationPlus = () => {
    const onFinishPlusW = () => {
      setTimeout(() => {
        plusY.value = withTiming(0, {
          duration: U_D * 2.5,
          easing: Easing.linear,
        });

        Q1.value = withTiming(2, {
          duration: U_D * 2.5,
          easing: Easing.linear,
        });

        const q2Finished = () => {
          setStatus('CLOSED');
        };

        Q2.value = withTiming(
          3,
          {
            duration: U_D * 2.5,
            easing: Easing.linear,
          },
          () => {
            'worklet';
            runOnJS(q2Finished)();
          },
        );
      }, 75);
    };

    width.value = withTiming(
      (TAB_HEIGHT_F / 4) * 3,
      {
        duration: U_D * 2.5,
        easing: Easing.linear,
      },
      () => {
        'worklet';
        runOnJS(onFinishPlusW)();
      },
    );
  };

  const OpeningAnimationPath = () => {
    Q1.value = withTiming(0, {
      duration: U_D * 2.5,
      easing: Easing.linear,
    });

    const q2Finished = (oldVal: number) => {
      if (oldVal === 0) return;

      const toVal = getNewValue(oldVal);

      Q2.value = withTiming(
        toVal,
        {
          duration: U_D * toVal,
          easing: Easing.ease,
        },
        () => {
          'worklet';
          runOnJS(q2Finished)(toVal);
        },
      );
    };

    Q2.value = withTiming(
      -2,
      {
        duration: U_D * 2.5,
        easing: Easing.linear,
      },
      () => {
        'worklet';
        runOnJS(q2Finished)(-2);
      },
    );
  };

  const getNewValue = (currentVal: number) => {
    const absVal = Math.abs(currentVal);
    let returnVal = currentVal;
    if (absVal - 0.4 > 0) {
      returnVal = (absVal - 0.4) * mul.current;
    } else {
      returnVal = 0;
    }

    mul.current *= -1;
    return returnVal;
  };

  const openingAnim = useCallback(() => {
    if (status === 'CLOSED') {
      setStatus('OPENING');
      OpeningAnimationPath();
      OpeningAnimationPlus();
    }
  }, [status]);

  const closingAnim = useCallback(() => {
    if (status === 'OPENED') {
      setStatus('CLOSING');
      ClosingAnimationPlus();
    }
  }, [status]);

  return (
    <View style={styles.container}>
      <View style={styles.svgContainer}>
        {
          <Svg
            viewBox={`0 
              -${TAB_HEIGHT_F / 2} 
              ${Constants.S_WIDTH - 48} 
              ${TAB_HEIGHT_F + (TAB_HEIGHT_F / 4) * 3}
              `}
            style={{
              width: '100%',
              height: TAB_HEIGHT_F + (TAB_HEIGHT_F / 4) * 3,
              //backgroundColor: 'gray',
            }}>
            <AnimatedPath animatedProps={animatedProps} fill="white" />
          </Svg>
        }
      </View>
      <View style={styles.tabContainer}>
        <View style={styles.tab}>
          <Image
            source={require('../../../res/home50.png')}
            style={styles.tabIcon}
          />
        </View>
        <View style={styles.tab}>
          <Image
            source={require('../../../res/user48.png')}
            style={styles.tabIcon}
          />
        </View>
      </View>
      <TouchableOpacity activeOpacity={1} style={styles.plusContainer}>
        <Animated.View style={[styles.plus, animatedPlusY, animatedPlusW]}>
          {status === 'CLOSED' && (
            <TouchableOpacity
              onPress={openingAnim}
              activeOpacity={0.7}
              style={styles.iconContainer}>
              <Image
                source={require('../../../res/plus64.png')}
                style={styles.icon}
              />
            </TouchableOpacity>
          )}
          {(status === 'EXTENDING' || status === 'OPENED') && (
            <Animated.View style={[styles.iconsContainer, animatedPlusW]}>
              <View style={styles.iconContainer}>
                <Image
                  source={require('../../../res/music48.png')}
                  style={styles.icon}
                />
              </View>
              <View style={styles.iconContainer}>
                <Image
                  source={require('../../../res/search50.png')}
                  style={styles.icon}
                />
              </View>
              <TouchableOpacity
                onPress={closingAnim}
                activeOpacity={0.7}
                style={styles.iconContainer}>
                <Image
                  source={require('../../../res/close50.png')}
                  style={styles.icon}
                />
              </TouchableOpacity>
            </Animated.View>
          )}
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    width: Constants.S_WIDTH,
    //backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  svgContainer: {
    width: '100%',
    //backgroundColor: 'green',
  },
  plusContainer: {
    position: 'absolute',
    left: Constants.S_WIDTH / 3,
    right: Constants.S_WIDTH / 3,
    top: 0,
    height: TAB_HEIGHT_F,
    //backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plus: {
    height: (TAB_HEIGHT_F / 4) * 3,
    borderRadius: TAB_HEIGHT_F,
    backgroundColor: '#4C1345',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: TAB_HEIGHT_F / 2,
    height: TAB_HEIGHT_F / 2,
    borderRadius: TAB_HEIGHT_F,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  icon: {
    width: 24,
    height: 24,
  },
  tabContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: TAB_HEIGHT_F / 2,
    height: TAB_HEIGHT_F,
    //backgroundColor: 'blue',
    paddingHorizontal: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tab: {
    width: 48,
    height: TAB_HEIGHT_F,
    //backgroundColor: 'red',
    borderRadius: TAB_HEIGHT_F,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    width: 36,
    height: 36,
  },
});

export default Liquid;
