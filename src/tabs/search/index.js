import React from 'react';
import {StyleSheet, Text, View } from "react-native";
import TrkList from "./trkList/TrkList";

class SearchScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <TrkList />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
  },
});

export default SearchScreen;
