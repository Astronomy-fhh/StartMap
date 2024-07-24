import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import PersonalProfile from './personProfile/personProfile';

class HomeScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <PersonalProfile />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
