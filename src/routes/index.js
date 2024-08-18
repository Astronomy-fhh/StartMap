import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View, Text, StyleSheet, StatusBar, Button} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../tabs/home';
import TrkScreen from '../tabs/trk';
import SearchScreen from '../tabs/search';
import RecordDetail from '../tabs/home/record/RecordDetail';
import {NavigationContainer} from '@react-navigation/native';
import TrkDetail from '../tabs/home/trk/TrkDetail';
import TrkList from '../tabs/home/trk/TrkList';
import {connect} from 'react-redux';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import AnimatedTabBarIcon from "./AnimatedTabBarIcon";

const Tab = createBottomTabNavigator();


const MainTab = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarActiveTintColor: '#b3c63f',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0,
          height: 50,
        },
      })}>
      <Tab.Screen
        name="Rec"
        component={TrkList}
        options={{
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
        name="Trk"
        component={TrkScreen}
        options={{
          tabBarStyle: {
            display: 'none',
          },
          title: '开始',
          tabBarLabelStyle: {
            display: 'none',
          },
          tabBarIcon: ({focused, color, size}) => (
            <AnimatedTabBarIcon focused={focused} color={color} size={32} />
          ),
        }}
      />
      <Tab.Screen
        name="Home"
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
};

const Stack = createNativeStackNavigator();

const Route = props => {
  // useEffect(() => {
  //   if (props.trkStart.start) {
  //     if (props.trkStart.pause) {
  //       StatusBar.setHidden(false, 'slide');
  //       StatusBar.setBackgroundColor('rgba(171,177,132,0.82)');
  //       StatusBar.setBarStyle('light-content', true);
  //     } else {
  //       StatusBar.setHidden(false, 'slide');
  //       StatusBar.setBackgroundColor('rgba(147,168,32,0.79)');
  //       StatusBar.setBarStyle('light-content');
  //     }
  //   } else {
  //     StatusBar.setBackgroundColor('#fff');
  //     StatusBar.setBarStyle('dark-content');
  //   }
  // }, [props.trkStart]);

  StatusBar.setBarStyle('dark-content', true);
  StatusBar.setBackgroundColor('#fff');

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="MainTab"
          component={MainTab}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="RecordDetail"
          component={RecordDetail}
          options={{
            headerTitle: '记录详情',
            headerTitleStyle: {
              color: '#000',
              fontWeight: 'normal',
              fontSize: 18,
            },
          }}
        />
        <Stack.Screen
          name="TrkDetail"
          component={TrkDetail}
          options={{
            headerTitle: '路线详情',
            headerTitleStyle: {
              fontWeight: 'normal',
              fontSize: 18,
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 12,
    marginBottom: 6,
    color: '#932c2c',
  },
  tabLabelFocus: {
    fontSize: 10,
    marginBottom: 6,
    color: 'yellow',
  },
  tabIcon: {},
});

const stateToProps = state => {
  return {
    trkStart: state.trkStart,
  };
};

const dispatchToProps = dispatch => ({});

export default connect(stateToProps, dispatchToProps)(Route);
