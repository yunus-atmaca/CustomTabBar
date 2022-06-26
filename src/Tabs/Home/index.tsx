import React, {FC} from 'react';
import {StyleSheet, Text, View} from 'react-native';

const Home: FC = ({}) => {
  return (
    <View style={styles.container}>
      <Text>Home Page</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d8fa08',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Home;
