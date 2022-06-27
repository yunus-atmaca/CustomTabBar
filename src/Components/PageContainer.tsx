import React, {FC} from 'react';
import {StyleSheet, View, ViewProps} from 'react-native';

import {Constants} from '../utils';

type Props = {};

const PageContainer: FC<Props & ViewProps> = props => {
  return <View style={[styles.container, props.style]} {...props} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: Constants.TAB_HEIGHT_B,
  },
});

export default PageContainer;
