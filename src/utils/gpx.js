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
    const lat = parseFloat(point.getAttribute('lat'));
    const lon = parseFloat(point.getAttribute('lon'));
    const eleNode = xpath.select1('*[local-name()="ele"]', point);
    const timeNode = xpath.select1('*[local-name()="time"]', point);
    const ele = eleNode ? parseFloat(eleNode.textContent) : 0;
    const time = timeNode ? timeNode.textContent : '';
    return {lat, lon, ele, time};
  });

  return {points, useTime, distance, ascent, descent};
}
