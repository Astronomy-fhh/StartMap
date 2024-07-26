import 'react-native-gesture-handler';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import HomeScreen from '../home';
import StartScreen from '../start';
import TrkScreen from '../trk';

import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Tab = createBottomTabNavigator();

function MainTab() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
      })}>
      <Tab.Screen
        name="search"
        component={TrkScreen}
        options={{
          title: '探索',
          tabBarLabel: ({focused, color}) => (
            <Text style={[styles.tabLabel, {color}]}>
              {focused ? '探索' : '探索'}
            </Text>
          ),
          tabBarIcon: ({focused, color, size}) => (
            <Icon
              name={focused ? 'star' : 'star-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="start"
        component={StartScreen}
        options={{
          title: '开始',
          tabBarLabel: ({focused, color}) => (
            <Text style={[styles.tabLabel, {color}]}>
              {focused ? '开始' : '开始'}
            </Text>
          ),
          tabBarIcon: ({focused, color, size}) => (
            <Icon
              name={focused ? 'accessibility' : 'accessibility-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="me"
        component={HomeScreen}
        options={{
          title: '我的',
          tabBarLabel: ({focused, color}) => (
            <Text style={[styles.tabLabel, {color}]}>
              {focused ? '我的' : '我的'}
            </Text>
          ),
          tabBarIcon: ({focused, color, size}) => (
            <Icon
              style={[styles.tabIcon, {color}]}
              name={focused ? 'person' : 'person-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const Stack = createNativeStackNavigator();

const Index = (
  <Stack.Navigator>
    <Stack.Screen
      name="Home"
      component={MainTab}
      options={{headerShown: false}}
    />
  </Stack.Navigator>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 10,
    marginBottom: 6, // 调整此值以控制标题距离底部的位置
  },
  tabIcon: {},
});

export default Index;
