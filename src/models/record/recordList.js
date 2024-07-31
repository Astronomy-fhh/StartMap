// eslint-disable-next-line no-unused-vars
import {TrkPointST} from '../trk/trkStart.tsx';
import { calculateTrkStats } from "../../utils/trkCalculate";

/**
 * @typedef {Object} Record
 * @property {number} id - The unique identifier
 * @property {string} startTime - The start time of the record
 * @property {string} endTime - The end time of the record
 * @property {TrkPointST[]} points - Array of tracking points
 * @property {number} useTime - The time used in seconds
 * @property {number} distance - The distance in meters
 * @property {number} ascent - The ascent in meters
 * @property {number} descent - The descent in meters
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
      if (payload.points.length === 0) {
        return state;
      }

      // 计算统计值
      const {totalDistance, totalTime, totalAscent, totalDescent} =
        calculateTrkStats(payload.points);

      const newRecord = {
        id: new Date().getTime() * -1,
        startTime: payload.startTime,
        endTime: payload.endTime,
        points: payload.points,
        distance: totalDistance,
        useTime: totalTime,
        ascent: totalAscent,
        descent: totalDescent,
        title: (payload.locationInfo?.address || '未知位置') + '附近的活动',
        desc: '',
        from: '',
        address: payload.locationInfo?.address || '',
        country: payload.locationInfo?.country || '',
        city: payload.locationInfo?.city || '',
        adCode: payload.locationInfo?.adCode || 0,
      };
      console.log('add newRecord', newRecord);
      return {
        ...state,
        list: [...state.list, newRecord],
      };
    },
  },
  effects: dispatch => ({
    async getList(payload, rootState) {
      try {
        // 例如：const data = await fetchDataFromAPI();
        return new Promise(resolve => {
          setTimeout(() => {
            // 通过 state 而不是 rootState 获取最新的数据
            const list = rootState.recordList.list.sort((a, b) => {
              return new Date(b.endTime) - new Date(a.endTime);
            });
            resolve(list);
          }, 1000);
        });
      } catch (error) {
        throw error;
      }
    },
  }),
};
