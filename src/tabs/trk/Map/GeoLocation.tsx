import {useEffect} from 'react';

import {
  addLocationListener as addListener,
  Geolocation,
  init,
  isStarted,
  LocationMode, setAllowsBackgroundLocationUpdates, setDistanceFilter, setLocationCacheEnable,
  setLocationMode, setMockEnable, setInterval,
  start,
  stop
} from "react-native-amap-geolocation";
import {Location, ReGeocode} from 'react-native-amap-geolocation/src/types.ts';
import {Position} from 'react-native-amap-geolocation/src/geolocation.ts';
import {EmitterSubscription} from 'react-native';

let listeners: EmitterSubscription[] = [];
let inited = false;
const GeoLocation = () => {
  useEffect(() => {
    const geoLocationInit = async () => {
      await init({
        android: 'e9566e6d7e8008a27d40d3e93cba6d67',
        ios: '9bd6c82e77583020a73ef1af59d0c759',
      });
    };
    if (!inited) {
      geoLocationInit();
      inited = true;
      console.log('geoLocationInit');
    }
  }, []);

  const startLocation = () => {
    start();
  };
  const stopLocation = () => {
    stop();
    clearLocationListen();
  };

  const clearLocationListen = () => {
    for (const listener of listeners) {
      listener.remove();
    }
    listeners = [];
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
    setInterval(5000);
    setMockEnable(false);
    setLocationCacheEnable(true);
    setLocationMode(LocationMode.Hight_Accuracy);
    setDistanceFilter(1);
    setAllowsBackgroundLocationUpdates(true);
    listeners.push(addListener(handle));
  };

  return {
    startLocation,
    stopLocation,
    getLocation,
    addLocationListen,
    isStartedLocation,
    clearLocationListen,
  };
};

export default GeoLocation;
