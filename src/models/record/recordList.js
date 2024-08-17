import {calculateTrkStats } from '../../utils/trkCalculate';
import { TrkFromRecord } from "../trkList/trkList";
/**
 * @typedef {Object} RecordPoint
 * @property {number} lat - The latitude
 * @property {number} lon - The latitude
 * @property {number} ele - The elevation
 * @property {string} time - The time string
 * @property {boolean} pause - The pause status
 */

/**
 * @typedef {Object} Record
 * @property {number} id - The unique identifier
 * @property {string} startTime - The start time of the record
 * @property {string} endTime - The end time of the record
 * @property {RecordPoint[]} points - Array of tracking points
 * @property {number} useTime - The time used in seconds
 * @property {number} distance - The distance in meters
 * @property {number} ascent - The ascent in meters
 * @property {number} descent - The descent in meters
 * @property {number} stepSpeed - The speed in meters per second
 * @property {string} desc - Description of the record
 * @property {string} title - Name of the record
 * @property {string} address - Address of the record
 * @property {string} country - Country of the record
 * @property {string} city - City of the record
 * @property {string} adCode - AdCode of the record
 */

export const RecordListModel = {
  state: {
    list: [],
  },
  reducers: {
    add(state, payload) {
      return {
        ...state,
        list: [...state.list, payload],
      };
    },
  },
  effects: dispatch => ({
    async getList(payload, rootState) {
      try {
        // 例如：const data = await fetchDataFromAPI();
        return new Promise(resolve => {
          setTimeout(() => {
            const list = rootState.recordList.list.sort((a, b) => {
              return Math.abs(b.id) - Math.abs(a.id);
            });
            resolve(list);
          }, 200);
        });
      } catch (error) {
        throw error;
      }
    },
    async asyncAddFromRecord(payload, rootState) {
      if (payload.points.length < 2) {
        throw new Error('没有足够的轨迹点');
      }

      // 添加记录
      const {
        totalDistance,
        totalTime,
        totalAscent,
        totalDescent,
        kilometerSpeeds,
      } = calculateTrkStats(payload.points);

      const newRecord = {
        id: new Date().getTime() * -1,
        startTime: payload.startTime,
        endTime: payload.endTime,
        points: payload.points,
        distance: totalDistance,
        useTime: totalTime,
        ascent: totalAscent,
        descent: totalDescent,
        title: (payload.locationInfo?.address || '未知位置') + '附近的记录',
        desc: '',
        address: payload.locationInfo?.address || '',
        country: payload.locationInfo?.country || '',
        city: payload.locationInfo?.city || '',
        adCode: payload.locationInfo?.adCode || 0,
        stepSpeed: kilometerSpeeds,
      };
      dispatch.recordList.add(newRecord);

      // 添加轨迹
      const trkPoints = [];
      for (const point of payload.points) {
        if (point.pause) {
          continue;
        }
        trkPoints.push({
          latitude: point.latitude,
          longitude: point.longitude,
          altitude: point.altitude,
          time: new Date(point.time).toISOString(),
        });
      }

      const trk = {
        id: new Date().getTime() * -1,
        startTime: trkPoints[0].time,
        endTime: trkPoints[trkPoints.length - 1].time,
        points: trkPoints,
        useTime: totalTime,
        distance: totalDistance,
        ascent: totalAscent,
        descent: totalDescent,
        title: (payload.locationInfo?.address || '未知位置') + '附近的路线',
        desc: '',
        address: payload.locationInfo?.address || '',
        country: payload.locationInfo?.country || '',
        city: payload.locationInfo?.city || '',
        adCode: payload.locationInfo?.adCode || 0,
        from: TrkFromRecord,
        createTime: new Date().toISOString(),
      };

      dispatch.trkList.add(trk);
    },
  }),
};
