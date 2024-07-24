import React, {useState} from 'react';
import {
  View,
  PanResponder,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FloatingDebugButton = () => {
  const [position, setPosition] = useState({x: 50, y: 50});
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gestureState) => {
      setPosition({
        x: position.x + gestureState.dx,
        y: position.y + gestureState.dy,
      });
    },
  });

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const logAsyncStorageContent = async () => {
    const keys = await AsyncStorage.getAllKeys();
    const items = await AsyncStorage.multiGet(keys);
    console.log('Debug AsyncStorage content:');
    items.forEach(([key, value]) => {
      if (key === 'persist:root') {
        try {
          const parsedValue = JSON.parse(value); // Step 1
          Object.keys(parsedValue).forEach((key) => {
            try {
              const nestedValue = JSON.parse(parsedValue[key]); // Step 3
              console.log(`Key: persist:roo:${key}, Value:`, nestedValue); // Step 4
            } catch (error) {
              console.error(`Error parsing nested JSON for key: ${key}`, error);
            }
          });
        } catch (error) {
          console.error("Error parsing 'persist:root' value", error);
        }
      } else {
        console.log(`Key: ${key}, Value: ${value}`);
      }
    });
  };

  return (
    <View
      {...panResponder.panHandlers}
      style={[styles.floatingButton, {left: position.x, top: position.y}]}>
      <TouchableOpacity onPress={toggleDropdown}>
        <Text style={styles.buttonText}>Debug</Text>
      </TouchableOpacity>
      {isDropdownVisible && (
        <View style={styles.dropdown}>
          <TouchableOpacity
            onPress={logAsyncStorageContent}
            style={styles.dropdownButton}>
            <Text style={styles.buttonText}>打印asyncStorage</Text>
          </TouchableOpacity>
          {/* Add more buttons here */}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 10,
    zIndex: 1000,
  },
  buttonText: {
    color: 'white',
  },
  dropdown: {
    marginTop: 10,
    padding: 5,
  },
  dropdownButton: {
    marginTop: 5,
    padding: 5,
    borderStyle: 'solid',
    backgroundColor: 'blue',
  },
});

export default FloatingDebugButton;
