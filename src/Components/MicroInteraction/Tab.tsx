import React, {FC} from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import {
  BottomTabDescriptorMap,
  BottomTabNavigationEventMap,
} from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import {
  NavigationHelpers,
  ParamListBase,
  TabNavigationState,
} from '@react-navigation/native';

type Props = {
  descriptors: BottomTabDescriptorMap;
  index: number;
  navigation: NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>;
  state: TabNavigationState<ParamListBase>;
  onClick: (label: string) => void;
};

const Tab: FC<Props> = ({descriptors, index, navigation, state, onClick}) => {
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

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={isFocused ? {selected: true} : {}}
      accessibilityLabel={options.tabBarAccessibilityLabel}
      testID={options.tabBarTestID}
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.container}>
      <Text style={{color: isFocused ? 'red' : '#222'}}>{label as string}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Tab;
