import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import RecordList from "../list/RecordList";

const TabBar = () => {
  const Tab = createMaterialTopTabNavigator();

  function HomeScreen() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Home!</Text>
      </View>
    );
  }

  function SettingsScreen() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Settings!</Text>
      </View>
    );
  }

  function MyTabBar({state, descriptors, navigation}) {
    return (
      <View style={styles.tabContainer}>
        {state.routes.map((route, index) => {
          const {options} = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={index}
              accessibilityRole="button"
              accessibilityState={isFocused ? {selected: true} : {}}
              onPress={onPress}
              style={[
                styles.tabButton,
                // {backgroundColor: isFocused ? '#000' : '#000'},
              ]}>
              <Text
                style={[
                  styles.tabText,
                  {
                    paddingBottom: 3,
                    color: isFocused ? '#b3c63f' : '#000',
                    borderBottomColor: isFocused ? '#b3c63f' : '#fff',
                    borderBottomWidth: 1,
                  },
                ]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  return (
    <Tab.Navigator tabBar={props => <MyTabBar {...props} />}>
      <Tab.Screen name="记录" component={RecordList} />
      <Tab.Screen name="路线" component={SettingsScreen} />
      <Tab.Screen name="STAR" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 0,
    paddingHorizontal: 10,
  },
  tabButton: {
    width: '23%',
    alignItems: 'center',
    borderRadius: 13,
    paddingBottom: 10,
    paddingHorizontal: '5%',
  },
  tabText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default TabBar;
