import React from 'react';
import {SafeAreaView} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer>
        <SafeAreaView style={{flex: 1, backgroundColor: 'blue'}}></SafeAreaView>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;
