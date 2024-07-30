// 模拟 init 方法
export const init = () => {
  console.log('Geolocation initialized');
};

let startLat = 40.02851612019045;
let startLng = 116.434004785794;

// 模拟 Geolocation 对象
export const Geolocation = {
  getCurrentPosition: (successCallback, errorCallback, options) => {
    // 模拟返回的位置信息
    const position = {
      coords: {
        latitude: startLat,
        longitude: startLng,
        accuracy: 100,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      },
      timestamp: Date.now(),
    };

    // 模拟成功回调
    if (successCallback) {
      successCallback(position);
    }
  },
};

// 位置监听器列表
let listeners = [];

// 模拟 addLocationListener 方法
export const addLocationListener = listener => {
  listeners.push(listener);
  console.log('Mock Location listener added');
};

// 模拟 start 方法
export const start = () => {
  console.log('Mock Geolocation started');
  // 模拟位置更新
  mockLocationUpdate();
};

let mockLocationUpdateInterval = null;

// 模拟 stop 方法
export const stop = () => {
  console.log('Mock Geolocation stopped');
  clearInterval(mockLocationUpdateInterval);
  listeners = [];
};

// 模拟位置更新
const mockLocationUpdate = () => {
  mockLocationUpdateInterval = setInterval(() => {
    startLat = startLat + Math.random() * 0.0001;
    startLng = startLng + Math.random() * 0.0001;
    const altitude = Math.random() * 1000;

    const location = {
      latitude: startLat,
      longitude: startLng,
      accuracy: 100,
      altitude: altitude,
      altitudeAccuracy: null,
      heading: null,
      speed: Math.random() * 10,
      timestamp: Date.now(),
    };

    listeners.forEach(listener => listener(location));
  }, 2000); // 每 5 秒更新一次
};
