import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const MyComponent = () => {
  const scrollY = useSharedValue(0);

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  const headerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: withSpring(scrollY.value > 50 ? -50 : 0) }],
    };
  });

  return (
    <View style={styles.container}>
      {/* 不固定部分 */}
      <Animated.View style={[styles.nonFixedPart, headerStyle]}>
        <Text>Non-Fixed Part</Text>
      </Animated.View>

      {/* 固定部分 */}
      <Animated.View style={[styles.fixedHeader, headerStyle]}>
        <Text>Fixed Header</Text>
      </Animated.View>

      {/* 可滚动内容部分 */}
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        <Text>Scrollable Content</Text>
        {/* 添加更多内容以示例滚动 */}
        <Text>More content...</Text>
        <Text>Even more content...</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  nonFixedPart: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  fixedHeader: {
    height: 60,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
  },
  scrollViewContent: {
    paddingTop: 60, // 留出固定头部的空间
    paddingHorizontal: 16,
  },
});

export default MyComponent;
