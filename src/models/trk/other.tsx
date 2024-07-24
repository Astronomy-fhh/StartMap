import RNFS from 'react-native-fs';
import {Alert} from 'react-native';

export const saveFile = async (fileContent: any, fileName: string) => {
  try {
    const path = `${RNFS.DocumentDirectoryPath}/${fileName}`;
    await RNFS.writeFile(path, fileContent, 'utf8');
    Alert.alert('Success', `GPX file saved to ${path}`);
  } catch (error) {
    Alert.alert('Error', `Failed to save GPX file: ${error as Error}`);
  }
};

export function createGpx(points: TrkPointST[]): string {
  let gpxData = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="YourAppName" xmlns="http://www.topografix.com/GPX/1/1">
  <trk>
    <name>Your Track Name</name>
    <trkseg>`;

  points.forEach(point => {
    gpxData += `
      <trkpt lat="${point.latitude}" lon="${point.longitude}">
        <ele>${point.altitude}</ele>
        <time>${new Date(point.timestamp).toISOString()}</time>
      </trkpt>`;
  });

  gpxData += `
    </trkseg>
  </trk>
</gpx>`;

  return gpxData;
}
