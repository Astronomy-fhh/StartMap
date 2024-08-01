import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import StickyParallaxHeader from 'react-native-sticky-parallax-header';

const App = () => {
  return (
    <StickyParallaxHeader
    />
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  foreground: {
    height: 250,
    justifyContent: 'flex-end',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  body: {
    padding: 20,
    alignItems: 'center',
  },
  bodyText: {
    fontSize: 16,
    color: '#333',
  },
});

export default App;
