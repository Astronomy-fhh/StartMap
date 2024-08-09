import 'react-native-gesture-handler';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../tabs/home';
import TrkScreen from '../tabs/trk';
import SearchScreen from '../tabs/search';
import RecordDetail from '../tabs/home/record/RecordDetail';
import {NavigationContainer} from '@react-navigation/native';
import TrkDetail from '../tabs/home/trk/TrkDetail';
import TrkList from "../tabs/home/trk/TrkList";

const Tab = createBottomTabNavigator();

function MainTab() {
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
            <Icon
              name={focused ? 'navigate' : 'navigate-outline'}
              size={34}
              color={color}
            />
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
}

const Stack = createNativeStackNavigator();

function Route() {
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
              color: '#000',
              fontWeight: 'normal',
              fontSize: 18,
            },
          }}
        />
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

export default Route;
