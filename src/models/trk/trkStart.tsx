export const trkStartModel = {
  state: {
    start: false,
    pause: false,
    trkPoints: [] as TrkPointST[],
  },
  reducers: {
    addTrkPoints(state: any, payload: TrkPointST) {
      return {
        ...state,
        trkPoints: payload,
      };
    },
    setStart(state: any, payload: boolean) {
      if (payload) {
        return {
          ...state,
          start: true,
          pause: false,
        };
      } else {
        return {
          ...state,
          start: false,
          pause: false,
        };
      }
    },
    setPause(state: any, payload: boolean) {
      return {
        ...state,
        pause: payload,
      };
    },
  },
};
