import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import CircularProgress from './CircularProgress'; // 确保路径正确

const ButtonWithProgress = ({
  onPressEnd,
  innerElement,
  innerPressElement,
  longPressDuration,
}) => {
  const [progress, setProgress] = React.useState(0);
  const [isCounting, setIsCounting] = useState(false);

  let timer = null;

  const handlePressOut = () => {
    console.log('handlePressOut');
    setIsCounting(false);
    timer && clearInterval(timer);
    setProgress(0);
  };

  const progressPer = 100;
  const handlePressIn = () => {
    if (!isCounting) {
      console.log('handlePressIn');
      setIsCounting(true);
      timer = setInterval(() => {
        if (!isCounting && progress > 0) {
          clearInterval(timer);
          return;
        }
        console.log('timer');
        setProgress(prevProgress => {
          if (prevProgress >= 100) {
            clearInterval(timer);
            onPressEnd?.();
            return 0;
          }
          console.log('prevProgress', prevProgress);
          return prevProgress + (progressPer / longPressDuration) * 100;
        });
      }, progressPer);
    }
  };

  return (
    <View>
      <TouchableWithoutFeedback
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}>
        <View style={styles.button}>
          {isCounting ? innerPressElement : innerElement}
        </View>
      </TouchableWithoutFeedback>
      <CircularProgress
        size={80} // 进度环的大小，根据需要调整
        strokeWidth={20} // 进度环的线条宽度，根据需要调整
        progress={progress} // 动态进度值
        style={styles.progress} // 使用绝对定位
      />
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ff8c00',
    borderRadius: 30,
    zIndex: 2,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  progress: {
    position: 'absolute',
    top: -10,
    left: -10,
  },
});

export default ButtonWithProgress;
