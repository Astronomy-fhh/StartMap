import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Person from './head/Person';
import PersonScroll from './head/PersonScroll';
import {useNavigation} from '@react-navigation/native';

const HomeScreen = ({navigation}) => {
  const toRecordDetail = item => {
    console.log(navigation.getState());
    navigation.navigate('RecordDetail');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toRecordDetail}>
        <Text>Go to Details</Text>
      </TouchableOpacity>
      <Person />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
