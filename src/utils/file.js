import { NativeModules, Platform } from "react-native";

export function refreshMediaLibrary(filePath) {
  if (Platform.OS === 'android') {
    const {MediaScannerConnection} = NativeModules;
    MediaScannerConnection.sc(filePath, null)
      .then(() => {
        console.log('MediaScannerConnection: File scanned successfully');
      })
      .catch(err => {
        console.log('MediaScannerConnection: Failed to scan file', err);
      });
  }
}
