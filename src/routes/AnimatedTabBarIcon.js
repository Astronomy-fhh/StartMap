import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import React, {useEffect} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';

const AnimatedTabBarIcon = ({focused, color, size, trkStart}) => {
  const progress = useSharedValue(0);
  const iconColorDefault = '#8e8e8e';
  const iconColorStart = '#ffffff';

  useEffect(() => {
    console.log('trkStart', trkStart.start, trkStart.pause);
    if (trkStart.start) {
      if (trkStart.pause) {
        progress.value = withTiming(1, {duration: 2000});
      } else {
        progress.value = withTiming(0.3, {duration: 2000}, () => {
          progress.value = withRepeat(
            withTiming(1, {duration: 1000}),
            -1,
            true,
          );
        });
      }
    } else {
      progress.value = withTiming(0, {duration: 2000});
    }
  }, [trkStart.start, trkStart.pause]);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      ['#fff', '#7e9300'], // 透明到黄色
    );

    return {
      backgroundColor,
      borderRadius: size / 2,
      padding: 5,
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <Icon
        name={'navigate-outline'}
        size={size}
        color={trkStart.start ? iconColorStart : iconColorDefault}
      />
    </Animated.View>
  );
};

const stateToProps = state => ({
  trkStart: state.trkStart,
});

export default connect(stateToProps)(AnimatedTabBarIcon);
