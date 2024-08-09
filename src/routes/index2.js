import React, { useEffect, useRef } from "react";
import { View, Text, Button, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RecordDetail from "../tabs/home/record/RecordDetail";
import TrkMapScreen from "../tabs/trk/Map/TrkMap";
import TrkScreen from "../tabs/trk";
import { MapType, MapView, Polyline } from "react-native-amap3d";
import TestMapView from "./TestMapView";

// Tab Navigator
const Tab = createBottomTabNavigator();

function Feed({ navigation }) {
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('Navigation state:', navigation.getState());
    });

    return unsubscribe;
  }, [navigation]);
  return (
    <View style={styles.container}>
      <Text>Feed Screen</Text>
      <Button
        title="Go to Profile"
        onPress={() => navigation.navigate('RecordDetails')}
      />
    </View>
  );
}

function Messages() {
  return (
    <View style={styles.container}>
      <Text>Messages Screen</Text>
    </View>
  );
}

function Home() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Hmo" component={Feed} />
      <Tab.Screen name="Messages" component={Messages} />
    </Tab.Navigator>
  );
}

// Stack Navigator
const Stack = createNativeStackNavigator();

function Profile() {
  return (
    <View style={styles.container}>
      <Text>Profile Screen</Text>
    </View>
  );
}


function RecordDetailS({navigation}) {
  const mapViewRef = useRef(null);

  return (
    <TestMapView />
  );
}

function Settings() {
  return (
    <View style={styles.container}>
      <Text>Settings Screen</Text>
    </View>
  );
}


function Route() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{headerShown: false}}
        />
        <Stack.Screen name="RecordDetails" component={RecordDetailS} />
        <Stack.Screen name="Settings" component={Settings} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Route;
