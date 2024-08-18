import {MapType} from 'react-native-amap3d';

export const trkStartModel = {
  state: {
    start: false,
    startTime: '',
    endTime: '',
    pause: false,
    pauseTime: 0,
    duration: 0,
    trkTimerBaseTime: 0,
    mapType: MapType.Night,
    currentPoint: {},
    points: [],
    locationInfo: {},
    trkStats: {},
  },
  reducers: {
    setLocationInfo(state, payload) {
      return {
        ...state,
        locationInfo: payload,
      };
    },
    setTrkPoints(state, payload) {
      return {
        ...state,
        points: payload,
      };
    },
    setCurrentPoint(state, payload) {
      if (!state.start || state.pause) {
        return state;
      }
      return {
        ...state,
        currentPoint: payload,
      };
    },
    setMapType(state, payload) {
      return {
        ...state,
        mapType: payload,
      };
    },
    checkAddTrkPoint(state, payload) {
      if (!state.start || state.pause) {
        return state;
      }
      return {
        ...state,
        points: [...state.points, payload],
        currentPoints: payload,
      };
    },
    addTrkPoint(state, payload) {
      return {
        ...state,
        points: [...state.points, payload],
      };
    },
    setStart(state, payload) {
      if (payload) {
        const date = new Date();
        const now = date.getTime();
        return {
          ...state,
          start: true,
          startTime: date.toISOString(),
          trkTimerBaseTime: now,
          pause: false,
          pauseTime: now,
          duration: 0,
          locationInfo: {},
          points: [],
          currentPoint: {},
          trkStats: {},
        };
      } else {
        return {
          ...state,
          start: false,
          endTime: new Date().toISOString(),
          pause: false,
          pauseTime: 0,
          duration: 0,
          trkTimerBaseTime: 0,
        };
      }
    },
    setPause(state, payload) {
      const now = new Date().getTime();
      if (payload) {
        const duration = state.duration + now - state.pauseTime;
        return {
          ...state,
          pause: true,
          pauseTime: now,
          duration: duration,
          trkTimerBaseTime: -duration,
        };
      } else {
        return {
          ...state,
          pause: false,
          pauseTime: now,
          trkTimerBaseTime: now - state.duration,
        };
      }
    },
    setTrkStats(state, payload) {
      return {
        ...state,
        trkStats: payload,
      };
    },
  },
};
