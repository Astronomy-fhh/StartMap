interface TrkPointST {
  latitude: number;
  longitude: number;
  altitude?: number; // Optional
  timestamp: number;
}

interface AddTrkST {
  points: TrkPointST[];
}

interface Trk {
  id: number;
  from: string;
  time: string;
  name: string;
  gpx: string;
  gpxPreview: string;
}
