import {MapType} from 'react-native-amap3d';

export interface TrkPointST {
  latitude: number;
  longitude: number;
  altitude?: number; // Optional
  timestamp: number;
  pause?: boolean;
}

export const trkStartModel = {
  state: {
    start: false,
    startTime: '',
    pause: false,
    pauseTime: 0,
    duration: 0,
    trkTimerBaseTime: 0,
    mapType: MapType.Night,
    currentPoint: {} as TrkPointST,
    trkPoints: [] as TrkPointST[],
  },
  reducers: {
    setTrkPoints(state: any, payload: TrkPointST[]) {
      return {
        ...state,
        trkPoints: payload,
      };
    },
    setCurrentPoint(state: any, payload: TrkPointST) {
      if (!state.start || state.pause) {
        return state;
      }
      return {
        ...state,
        currentPoint: payload,
      };
    },
    setMapType(state: any, payload: MapType) {
      return {
        ...state,
        mapType: payload,
      };
    },
    checkAddTrkPoint(state: any, payload: TrkPointST) {
      if (!state.start || state.pause) {
        console.log('addTrkPoint not start or pause');
        return state;
      }
      return {
        ...state,
        trkPoints: [...state.trkPoints, payload],
      };
    },
    addTrkPoint(state: any, payload: TrkPointST) {
      return {
        ...state,
        trkPoints: [...state.trkPoints, payload],
      };
    },
    setStart(state: any, payload: boolean) {
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
        };
      } else {
        return {
          ...state,
          startTime: '',
          start: false,
          pause: false,
          pauseTime: 0,
          duration: 0,
          trkTimerBaseTime: 0,
        };
      }
    },
    setPause(state: any, payload: boolean) {
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
  },
};
