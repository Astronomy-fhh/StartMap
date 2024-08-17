import { StyleSheet, Text, View } from "react-native";
import {useEffect} from 'react';
import {
  setUpdateIntervalForType,
  magnetometer,
  SensorTypes,
} from 'react-native-sensors';
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import Animated from 'react-native-reanimated';

const DirectionSign = () => {
  const direction = useSharedValue(0);

  useEffect(() => {
    setUpdateIntervalForType(SensorTypes.magnetometer, 1000);
    const subscription = magnetometer.subscribe((data: {x: any; y: any}) => {
      const {x, y} = data;
      const angle = Math.atan2(y, x) * (180 / Math.PI);
      const adjustedAngle = angle >= 0 ? angle : angle + 360;

      // 使用 SharedValue 进行动画更新
      direction.value = withSpring(
        adjustedAngle,
        {
          damping: 8,
          stiffness: 100,
          mass: 1,
        },
        isFinished => {
          console.log('isFinished', isFinished);
        },
      );
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{rotate: `${direction.value}deg`}],
    };
  });

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.triangleTop}></View>
      <View style={styles.triangleBottom} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: 8, // 这个值要大于或等于两个三角形宽度的总和
    height: 40,
  },
  triangleTop: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderLeftColor: 'transparent',
    borderRightWidth: 6,
    borderRightColor: 'transparent',
    borderBottomWidth: 20,
    borderBottomColor: '#96a631',
    position: 'absolute',
    top: 0,
  },
  triangleBottom: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderLeftColor: 'transparent',
    borderRightWidth: 6,
    borderRightColor: 'transparent',
    borderTopWidth: 20,
    borderTopColor: '#d0d3c1',
    position: 'absolute',
    bottom: 0,
  },
});

export default DirectionSign;
