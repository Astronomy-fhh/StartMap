class KalmanFilter {
  constructor({R = 1, Q = 1, A = 1, B = 0, C = 1}) {
    this.R = R; // 测量噪声协方差
    this.Q = Q; // 过程噪声协方差
    this.A = A; // 状态转移矩阵
    this.B = B; // 控制矩阵
    this.C = C; // 观测矩阵
    this.covariance = NaN; // 误差协方差
    this.value = NaN; // 估计值
  }

  filter(measurement, controlInput = 0, accuracy = null) {
    if (isNaN(this.value)) {
      // 初始化
      this.value = (1 / this.C) * measurement;
      this.covariance = (1 / this.C) * this.R * (1 / this.C);
    } else {
      // 预测
      const predValue = this.A * this.value + this.B * controlInput;
      const predCovariance = this.A * this.covariance * this.A + this.Q;

      // 更新测量噪声协方差（如果提供了 accuracy）
      const R = accuracy !== null ? accuracy : this.R;

      // 卡尔曼增益
      const kalmanGain =
        predCovariance * this.C * (1 / (this.C * predCovariance * this.C + R));

      // 更新
      this.value = predValue + kalmanGain * (measurement - this.C * predValue);
      this.covariance = (1 - kalmanGain * this.C) * predCovariance;
    }
    return this.value;
  }
}

export {KalmanFilter};
