import React, {FC} from 'react';
import {TouchableOpacity, Text, StyleSheet, View} from 'react-native';
import {
  BottomTabDescriptorMap,
  BottomTabNavigationEventMap,
} from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import {
  NavigationHelpers,
  ParamListBase,
  TabNavigationState,
} from '@react-navigation/native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import {Constants} from '../../utils';

type Props = {
  descriptors: BottomTabDescriptorMap;
  index: number;
  navigation: NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>;
  state: TabNavigationState<ParamListBase>;
  onClick: (label: string) => void;
};

const Tab: FC<Props> = ({descriptors, index, navigation, state, onClick}) => {
  const opacity = useSharedValue(0);
  const width = useSharedValue(Constants.TAB_HEIGHT_F / 4);
  const animatedS = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      width: width.value,
      height: width.value,
    };
  });

  const animate = () => {
    opacity.value = 0;
    opacity.value = withRepeat(
      withTiming(1, {
        duration: 150,
        easing: Easing.linear,
      }),
      2,
      true,
    );

    width.value = Constants.TAB_HEIGHT_F / 4;
    width.value = withTiming((Constants.TAB_HEIGHT_F / 4) * 5, {
      duration: 300,
      easing: Easing.linear,
    });
  };

  const {options} = descriptors[state.routes[index].key];
  const label =
    options.tabBarLabel !== undefined
      ? options.tabBarLabel
      : options.title !== undefined
      ? options.title
      : state.routes[index].name;

  const isFocused = state.index === index;

  const onPress = () => {
    onClick(label as string);
    animate();
    const event = navigation.emit({
      type: 'tabPress',
      target: state.routes[index].key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      // The `merge: true` option makes sure that the params inside the tab screen are preserved
      navigation.navigate({name: state.routes[index].name, merge: true});
    }
  };

  const onLongPress = () => {
    navigation.emit({
      type: 'tabLongPress',
      target: state.routes[index].key,
    });
  };

  const _onPressIn = () => {};

  const _onPressOut = () => {};

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={isFocused ? {selected: true} : {}}
      accessibilityLabel={options.tabBarAccessibilityLabel}
      testID={options.tabBarTestID}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={_onPressIn}
      onPressOut={_onPressOut}
      style={styles.container}>
      <Text style={{color: isFocused ? '#0f0ade' : 'black'}}>
        {label as string}
      </Text>
      <View style={styles.rippleContainer}>
        <Animated.View style={[styles.ripple, animatedS]} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rippleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ripple: {
    backgroundColor: 'transparent',
    borderRadius: 200,
    borderWidth: 8,
    borderColor: '#cdd1e4',
  },
});

export default Tab;
