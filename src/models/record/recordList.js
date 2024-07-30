// eslint-disable-next-line no-unused-vars
import {TrkPointST} from '../trk/trkStart.tsx';

/**
 * @typedef {Object} Record
 * @property {number} id - The unique identifier
 * @property {string} startTime - The start time of the record
 * @property {string} endTime - The end time of the record
 * @property {TrkPointST[]} points - Array of tracking points
 * @property {string} desc - Description of the record
 * @property {string} name - Name of the record
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
      const newRecord = {
        id: 0,
        startTime: payload.startTime,
        endTime: payload.endTime,
        points: payload.points,
        name: '',
        desc: '',
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
            const list = rootState.recordList.list;
            resolve(list);
          }, 1000);
        });
      } catch (error) {
        throw error;
      }
    },
  }),
};
