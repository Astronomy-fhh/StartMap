import {KalmanFilter} from './KalmanFilter';
import {SlidingWindowFilter} from './SlidingWindowFilter';
import {SlidingWindowSum} from './SlidingWindowSum';

class TrackStats {
  constructor() {
    this.length = 0;
    this.pauseTime = 0;
    this.totalDistance = 0;
    this.totalTime = 0;
    this.totalAscent = 0;
    this.totalDescent = 0;
    this.currentKilometerDistance = 0;
    this.currentKilometerTime = 0;
    this.kilometerSpeeds = [];
    this.currentAltitude = 0;
    this.previousPoint = null;

    // 初始化卡尔曼滤波器
    this.kalmanX = new KalmanFilter({R: 0.0001, Q: 0.0001});
    this.kalmanY = new KalmanFilter({R: 0.0001, Q: 0.0001});
    this.kalmanSpeed = new KalmanFilter({R: 0.1, Q: 0.1});
    this.kalmanAltitude = new KalmanFilter({R: 5, Q: 1});
    this.slidingWindowFilterAltitude = new SlidingWindowFilter(20);
    this.slidingWindowSumAltitude = new SlidingWindowSum(20, 1);
  }

  haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  processPoint(point) {
    console.log('t1', point);
    this.length++;

    // 跳过暂停点的计算 后面的点计算以暂停点之后的第一个点为起点
    if (point.pause) {
      if (this.previousPoint && this.previousPoint.pause) {
        this.pauseTime +=
          new Date(point.time).getTime() -
          new Date(this.previousPoint.time).getTime();
      }
      this.previousPoint = point;
      return point;
    }

    // 将 accuracy 直接作为测量噪声
    const measurementNoiseLongitude = point.accuracy / 111320; // 将米转换为经度的测量噪声
    const measurementNoiseLatitude = point.accuracy / 111320; // 将米转换为纬度的测量噪声
    const measurementNoiseSpeed = point.accuracy; // 直接作为速度的测量噪声
    const measurementNoiseAltitude = point.accuracy; // 直接作为高度的测量噪声

    // 应用卡尔曼滤波器
    point.longitude = this.kalmanX.filter(
      point.longitude,
      0,
      measurementNoiseLongitude,
    );
    point.latitude = this.kalmanY.filter(
      point.latitude,
      0,
      measurementNoiseLatitude,
    );
    point.speed = this.kalmanSpeed.filter(
      point.speed,
      0,
      measurementNoiseSpeed,
    );
    point.altitude = this.kalmanAltitude.filter(
      point.altitude,
      0,
      measurementNoiseAltitude,
    );
    point.altitude = this.slidingWindowFilterAltitude.filter(point.altitude);

    console.log('t2', point);

    // 第一个点
    if (!this.previousPoint || this.previousPoint.pause) {
      this.previousPoint = point;
      return point;
    }

    const distance = this.haversineDistance(
      this.previousPoint.latitude,
      this.previousPoint.longitude,
      point.latitude,
      point.longitude,
    );

    const timeDiff =
      new Date(point.time).getTime() -
      new Date(this.previousPoint.time).getTime();
    this.totalTime += timeDiff;
    this.currentKilometerDistance += distance;
    this.currentKilometerTime += timeDiff;
    this.totalDistance += distance;

    const altitudeDiff = this.slidingWindowSumAltitude.compare(point.altitude);
    if (altitudeDiff > 0) {
      this.totalAscent += altitudeDiff;
    } else {
      this.totalDescent += -altitudeDiff;
    }

    if (this.currentKilometerDistance >= 1000) {
      const kmSpeed =
        this.currentKilometerDistance /
        1000 /
        (this.currentKilometerTime / 1000 / 3600);
      this.kilometerSpeeds.push(kmSpeed);
      this.currentKilometerDistance = 0;
      this.currentKilometerTime = 0;
    }

    if (point.altitude > 0) {
      this.currentAltitude = point.altitude;
    }

    if (!point.pause) {
      this.previousPoint = point;
    }
    return point;
  }

  getStats() {
    const currentKilometerSpeed =
      this.kilometerSpeeds.length > 0
        ? this.kilometerSpeeds[this.kilometerSpeeds.length - 1]
        : 0;

    const totalTimeEndTime = this.previousPoint ? this.previousPoint.time : 0; // 更新总时间结束时间
    const finalPointIsPaused = this.previousPoint
      ? this.previousPoint.pause
      : true;

    console.log(
      'ts',
      '数据量',
      this.length,
      '总暂停时间',
      this.pauseTime,
      '距离',
      this.totalDistance,
      '时间',
      this.totalTime,
      '当前海拔',
      this.currentAltitude,
      '总爬升',
      this.totalAscent,
      '总下降',
      this.totalDescent,
      '速度',
      this.kilometerSpeeds,
      '当前速度',
      currentKilometerSpeed,
      '最后一个点是否暂停',
      finalPointIsPaused,
      '总时间结束时间',
      new Date(totalTimeEndTime).toLocaleString(),
    );

    return {
      length: this.length,
      totalDistance: this.totalDistance,
      totalTime: this.totalTime,
      totalTimeEndTime,
      currentAltitude: this.currentAltitude,
      totalAscent: this.totalAscent,
      totalDescent: this.totalDescent,
      kilometerSpeeds: this.kilometerSpeeds,
      currentKilometerSpeed: currentKilometerSpeed,
      finalPointIsPaused: finalPointIsPaused,
      pauseTime: this.pauseTime,
    };
  }
}

let trkStats = new TrackStats();
export function resetTrkStats() {
  trkStats = new TrackStats();
}
export {trkStats};
