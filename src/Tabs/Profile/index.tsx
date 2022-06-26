import React, {FC} from 'react';
import {StyleSheet, Text, View} from 'react-native';

const Profile: FC = ({}) => {
  return (
    <View style={styles.container}>
      <Text>Profile Page</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Profile;
