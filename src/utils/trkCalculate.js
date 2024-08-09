// 使用 Haversine 公式计算地球上两点之间的距离
function haversineDistance(latency1, longitude1, latency2, longitude2) {
  const R = 6371e3; // 地球半径，单位为米
  const φ1 = (latency1 * Math.PI) / 180; // 将纬度转换为弧度
  const φ2 = (latency2 * Math.PI) / 180; // 将纬度转换为弧度
  const Δφ = ((latency2 - latency1) * Math.PI) / 180; // 纬度差值
  const Δλ = ((longitude2 - longitude1) * Math.PI) / 180; // 经度差值

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // 返回距离，单位为米
}

// 根据数据点计算统计信息
export function calculateTrkStats(data) {
  let totalDistance = 0; // 总距离
  let totalTime = 0; // 总时间
  let totalAscent = 0; // 总爬升高度
  let totalDescent = 0; // 总下降高度
  let currentKilometerDistance = 0; // 当前公里距离
  let currentKilometerTime = 0; // 当前公里时间
  let kilometerSpeeds = []; // 每公里的平均速度数组
  let currentAltitude = 0; // 当前海拔高度

  let previousPoint = data[0]; // 上一个数据点

  let j = 0;
  // 跳过暂停点 刚开始就有可能是暂停点
  while (j < data.length && data[j].pause) {
    j++;
  }
  for (let i = j; i < data.length; i++) {
    const point = data[i];

    // 计算两个点之间的距离
    const distance = haversineDistance(
      previousPoint.latitude,
      previousPoint.longitude,
      point.latitude,
      point.longitude,
    );

    // 计算两个点之间的时间差，单位为秒
    const timeDiff =
      (new Date(point.time) - new Date(previousPoint.time)) / 1000;
    totalTime += timeDiff; // 累积总时间
    currentKilometerDistance += distance; // 累积当前公里距离
    currentKilometerTime += timeDiff; // 累积当前公里时间
    totalDistance += distance; // 累积总距离

    // 计算海拔高度差
    const altitudeDiff = point.altitude - previousPoint.altitude;
    if (altitudeDiff > 0) {
      totalAscent += altitudeDiff; // 累积爬升高度
    } else {
      totalDescent += -altitudeDiff; // 累积下降高度
    }

    // 如果当前公里距离超过或等于1000米，计算平均速度
    if (currentKilometerDistance >= 1000) {
      const kmSpeed =
        currentKilometerDistance / 1000 / (currentKilometerTime / 3600); // 计算公里速度，单位为 km/h
      // const speedInSecondsPerKm = 3600 / kmSpeed; // 转换为秒每公里
      kilometerSpeeds.push(kmSpeed); // 保存当前公里速度
      currentKilometerDistance = 0; // 重置当前公里距离
      currentKilometerTime = 0; // 重置当前公里时间
    }

    if (point.altitude > 0) {
      currentAltitude = point.altitude;
    }

    // 如果点是暂停状态，不能作为前驱点
    if (point.pause) {
      // 跳过当前暂停点，找到暂停后的第一个有效点
      while (i < data.length && data[i].pause) {
        i++;
      }
      // 如果有有效点，重新设置 previousPoint
      if (i < data.length) {
        previousPoint = data[i];
      }
      continue;
    }

    previousPoint = point; // 更新上一个数据点
  }

  // 处理最后一段未满一公里的部分
  if (currentKilometerDistance > 0) {
    const lastKmSpeed =
      currentKilometerDistance / 1000 / (currentKilometerTime / 3600);
    // const lastSpeedInSecondsPerKm = 3600 / lastKmSpeed; // 转换为秒每公里
    kilometerSpeeds.push(lastKmSpeed);
  }

  const currentKilometerSpeed =
    kilometerSpeeds.length > 0
      ? kilometerSpeeds[kilometerSpeeds.length - 1]
      : 0;

  const finalPointIsPaused =
    data.length > 0 ? data[data.length - 1].pause : true;
  const totalTimeEndTime = data.length > 0 ? data[data.length - 1].time : 0; // 更新总时间结束时间

  console.log(
    'trkCal',
    '距离',
    totalDistance,
    '时间',
    totalTime,
    '当前海拔',
    currentAltitude,
    '总爬升',
    totalAscent,
    '总下降',
    totalDescent,
    '速度',
    kilometerSpeeds,
    '当前速度',
    currentKilometerSpeed,
    '最后一个点是否暂停',
    finalPointIsPaused,
    '总时间结束时间',
    new Date(totalTimeEndTime).toLocaleString(),
  );

  return {
    totalDistance: totalDistance, // 总距离，转换为公里
    totalTime, // 总时间，单位为秒
    totalTimeEndTime, // 总时间结束时间
    currentAltitude: currentAltitude, // 当前海拔高度
    totalAscent, // 总爬升高度
    totalDescent, // 总下降高度
    kilometerSpeeds, // 每公里的平均速度数组
    currentKilometerSpeed: currentKilometerSpeed, // 当前公里的平均速度
    finalPointIsPaused, // 最后一个点是否是暂停状态
  };
}
