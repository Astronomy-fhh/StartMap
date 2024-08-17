import React, {useEffect} from 'react';
import {View, Text, Button, StyleSheet, TouchableOpacity} from 'react-native';
import TrkMapScreen from './Map/TrkMap.tsx';
import TrkStartScreen from './Trk/Start.tsx';
import {connect} from 'react-redux';
import TrkStartingScreen from './Trk/Starting.tsx';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const TrkScreen = (props: any) => {
  const showStart = !props.trkStart.start;
  const navigation = useNavigation();

  const onBack = () => {
    navigation.goBack();
  };

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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 50,
    left: 10,
    zIndex: 999,
    fontWeight: 100,
    shadowColor: '#000',
    shadowOpacity: 0.1,
  },
});

const stateToProps = (state: any) => {
  return {
    trkStart: state.trkStart,
  };
};

export default connect(stateToProps)(TrkScreen);
