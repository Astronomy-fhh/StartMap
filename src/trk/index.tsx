import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import TrkMapScreen from '../components/Map/TrkMap';
import TrkStartScreen from '../components/Trk/Start';
import {connect} from "react-redux";
import TrkStartingScreen from '../components/Trk/Starting.tsx';

const TrkScreen = (props: any) => {
  const showStart = !props.trkStartStore.start;
  return (
    <View style={styles.container}>
      <TrkMapScreen />
      {showStart ? <TrkStartScreen /> : <TrkStartingScreen />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  text: {
    fontSize: 30,
  },
});

const stateToProps = (state: any) => {
  return {
    trkStartStore: state.trkStart,
  };
};

export default connect(stateToProps)(TrkScreen);
