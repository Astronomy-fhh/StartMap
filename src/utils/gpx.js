import {DOMParser} from 'xmldom';
import xpath from 'xpath';

export function parseGPXFromXML(gpx) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(gpx, 'application/xml');

  // 创建带有命名空间的 XPath 查询
  // const metadataTimeNode = xpath.select1(
  //   '//*[local-name()="metadata"]/*[local-name()="time"]',
  //   xmlDoc,
  // );
  // gpxData.metadata.time = metadataTimeNode ? metadataTimeNode.textContent : '';

  const totalTimeNode = xpath.select1(
    '//*[local-name()="extensions"]/*[local-name()="totalTime"]',
    xmlDoc,
  );
  const useTime = totalTimeNode ? parseFloat(totalTimeNode.textContent) : 0;

  const cumulativeDecreaseNode = xpath.select1(
    '//*[local-name()="extensions"]/*[local-name()="cumulativeDecrease"]',
    xmlDoc,
  );
  const descent = cumulativeDecreaseNode
    ? parseFloat(cumulativeDecreaseNode.textContent)
    : 0;

  const cumulativeClimbNode = xpath.select1(
    '//*[local-name()="extensions"]/*[local-name()="cumulativeClimb"]',
    xmlDoc,
  );
  const ascent = cumulativeClimbNode
    ? parseFloat(cumulativeClimbNode.textContent)
    : 0;

  const totalDistanceNode = xpath.select1(
    '//*[local-name()="extensions"]/*[local-name()="totalDistance"]',
    xmlDoc,
  );
  const distance = totalDistanceNode
    ? parseFloat(totalDistanceNode.textContent)
    : 0;

  // 提取track点信息
  const trackPoints = xpath.select('//*[local-name()="trkpt"]', xmlDoc);
  const points = trackPoints.map(point => {
    const latitude = parseFloat(point.getAttribute('lat'));
    const longitude = parseFloat(point.getAttribute('lon'));
    const eleNode = xpath.select1('*[local-name()="ele"]', point);
    const timeNode = xpath.select1('*[local-name()="time"]', point);
    const altitude = eleNode ? parseFloat(eleNode.textContent) : 0;
    const time = timeNode ? timeNode.textContent : '';
    return {latitude, longitude, altitude, time};
  });

  return {points, useTime, distance, ascent, descent};
}

export function convertTrkToGpx(trk) {
  const {points, startTime, endTime, desc, title} = trk;

  const metadata = `
    <metadata>
      <time>${startTime}</time>
      <desc>${desc}</desc>
      <name>${title}</name>
    </metadata>
  `;

  const trkpts = points
    .map(
      point => `
    <trkpt lat="${point.latitude}" lon="${point.longitude}">
      <ele>${point.altitude}</ele>
      <time>${point.time}</time>
    </trkpt>
  `,
    )
    .join('\n');

  const gpxContent = `<?xml version="1.0" encoding="UTF-8"?>
<gpx creator="StarTrk" version="1.1" xmlns="http://www.topografix.com/GPX/1/1">
  ${metadata}
  <trk>
    <name>${title}</name>
    <desc>${desc}</desc>
    <trkseg>
      ${trkpts}
    </trkseg>
  </trk>
</gpx>`;

  return gpxContent;
}

export function formatTrkForDisplay(trk) {
  const {
    id,
    startTime,
    endTime,
    points,
    useTime,
    distance,
    ascent,
    descent,
    desc,
    title,
    address,
    country,
    city,
    adCode,
    from,
    createTime,
  } = trk;

  // 将时间戳转换为更可读的格式
  const formatDate = dateStr => {
    const date = new Date(dateStr);
    return date.toLocaleString(); // 可以根据需要调整格式
  };

  // 格式化 points 数组
  const formatPoints = (points) => {
    const pointLines = points.map((point, index) => {
      const pointStr = `Point ${index + 1}: Latitude ${point.latitude.toFixed(6)}, Longitude ${point.longitude.toFixed(6)}, Altitude ${point.altitude.toFixed(2)} meters, Time ${formatDate(point.time)}`;

      return pointStr.padEnd(80);
    });
    return pointLines.join('\n');
  };

  return `
Record ID: ${id}
Title: ${title}
Description: ${desc}
Address: ${address}
City: ${city}
Country: ${country}
AdCode: ${adCode}
From: ${from}
Start Time: ${formatDate(startTime)}
End Time: ${formatDate(endTime)}
Create Time: ${formatDate(createTime)}
Duration: ${Math.floor(useTime / 60)} minutes ${useTime % 60} seconds
Distance: ${(distance / 1000).toFixed(2)} km
Ascent: ${ascent} meters
Descent: ${descent} meters
Points:
${formatPoints(points)}
  `;
}
