import {createGpx} from './other.tsx';

export const trkModel = {
  state: {
    localTrkList: [] as Trk[],
  },
  reducers: {
    addTrk(state: any, addTrk: AddTrkST) {
      const gpxStr = createGpx(addTrk.points);
      // const gpxPreview = (generateTrackImage(addTrk.points) as unknown as string) || '';
      // console.log('gpxPreview', gpxPreview);
      const newTrk: Trk = {
        id: 0,
        from: 'local',
        time: new Date().toISOString(),
        name: '未命名',
        gpx: gpxStr,
        gpxPreview: '111',
      };
      return {
        ...state,
        localTrkList: state.localTrkList.concat(newTrk),
      };
    },
  },
};
