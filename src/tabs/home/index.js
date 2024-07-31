import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Person from './head/Person';
import PersonScroll from "./head/PersonScroll";

class HomeScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Person />
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
