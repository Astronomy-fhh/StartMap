import {calculateTrkStats} from '../../utils/trkCalculate';

/**
 * @typedef {Object} TrkPoint
 * @property {number} lat - The latitude
 * @property {number} lon - The latitude
 * @property {number} ele - The elevation
 * @property {string} time - The time string
 */

/**
 * @typedef {Object} ImportTrk
 * @property {TrkPoint[]} points - Array of tracking points
 * @property {number} useTime - The latitude
 * @property {number} distance - The latitude
 * @property {number} ascent - The elevation
 * @property {descent} descent - The elevation
 */

/**
 * @typedef {Object} Trk
 * @property {number} id - The unique identifier
 * @property {string} startTime - The start time of the record
 * @property {string} endTime - The end time of the record
 * @property {TrkPoint[]} points - Array of tracking points
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
 * @property {number} from - From
 */

export const TrkFromRecord = 1;
export const TrkFromImport = 2;
export const TrkFromNames = {
  [TrkFromRecord]: '本地记录',
  [TrkFromImport]: '外部导入',
};

export const TrkListModel = {
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
            // 通过 state 而不是 rootState 获取最新的数据
            const list = rootState.trkList.list.sort((a, b) => {
              return Math.abs(b.id) - Math.abs(a.id);
            });
            console.log('list:', list);
            resolve(list);
          }, 100);
        });
      } catch (error) {
        throw error;
      }
    },
    async asyncAddFromImport(payload, rootState) {
      if (payload.points.length === 0) {
        throw new Error('No points in the GPX file');
      }

      const trk = {
        id: new Date().getTime() * -1,
        startTime: payload.points[0].time,
        endTime: payload.points[payload.points.length - 1].time,
        points: payload.points,
        useTime: payload.useTime || 0,
        distance: payload.distance || 0,
        ascent: payload.ascent || 0,
        descent: payload.descent || 0,
        desc: '',
        title: payload.title || 0,
        address: '',
        country: '',
        city: '',
        adCode: '',
        from: TrkFromImport,
      };
      dispatch.trkList.add(trk);
    },
  }),
};
