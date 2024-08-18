class SlidingWindowFilter {
  constructor(windowSize = 10) {
    this.windowSize = windowSize; // 滑动窗口大小
    this.window = []; // 存储窗口中的值
  }

  filter(newValue) {
    // 将新值加入窗口
    this.window.push(newValue);

    // 确保窗口大小不超过设定值
    if (this.window.length > this.windowSize) {
      this.window.shift(); // 移除最旧的值
    }

    // 计算加权和
    const weightedSum = this.window.reduce((sum, val) => sum + val, 0);

    // 计算加权平均值
    return this.window.length > 0 ? weightedSum / this.window.length : 0;
  }
}

export {SlidingWindowFilter};
