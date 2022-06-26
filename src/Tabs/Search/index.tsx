import React, {FC} from 'react';
import {StyleSheet, Text, View} from 'react-native';

const Search: FC = ({}) => {
  return (
    <View style={styles.container}>
      <Text>Search Page</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ff9470',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Search;
