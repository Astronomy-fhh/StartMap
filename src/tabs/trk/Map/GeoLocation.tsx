import { useEffect } from "react";

import {
  addLocationListener as addListener,
  Geolocation,
  init,
  isStarted,
  LocationMode,
  setLocationMode,
  start,
  stop
} from "react-native-amap-geolocation";
import { Location, ReGeocode } from "react-native-amap-geolocation/src/types.ts";
import { Position } from "react-native-amap-geolocation/src/geolocation.ts";
import { PermissionsAndroid, Platform } from "react-native";

let initialized = false;

const GeoLocation = () => {
  useEffect(() => {
    const initPermissions = async () => {
      if (Platform.OS === 'android') {
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        ]);
      }
    };
    const geoLocationInit = async () => {
      await init({
        android: 'e9566e6d7e8008a27d40d3e93cba6d67',
        ios: '9bd6c82e77583020a73ef1af59d0c759',
      });
      setLocationMode(LocationMode.Hight_Accuracy);
    };
    if (!initialized) {
      initPermissions();
      geoLocationInit();
      initialized = true;
    }
  }, []);

  const startLocation = () => {
    start();
  };
  const stopLocation = () => {
    stop();
  };

  const isStartedLocation = () => {
    return isStarted();
  };

  const getLocation = (handle: (position: Position) => void) => {
    const error = (error: any) => {
      console.log('error', error);
    };
    Geolocation.getCurrentPosition(handle, error);
  };

  const addLocationListen = (
    handle: (location: Location & ReGeocode) => void,
  ) => {
    addListener(handle);
  };

  return {
    startLocation,
    stopLocation,
    getLocation,
    addLocationListen,
    isStartedLocation,
  };
};

export default GeoLocation;
