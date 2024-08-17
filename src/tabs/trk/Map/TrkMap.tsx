import {AMapSdk, MapType, MapView, Polyline, Marker} from 'react-native-amap3d';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Text,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  PermissionsAndroid,
} from 'react-native';
import GeoLocation from './GeoLocation.tsx';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import MIcon from 'react-native-vector-icons/MaterialIcons';

import {Location, ReGeocode} from 'react-native-amap-geolocation/src/types.ts';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {WarnNotification} from '../../../utils/notification';
import {requestPermissions} from '../Trk/Start.tsx';
import LocationMarker from './LocationMarker.tsx';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { magnetometer, SensorTypes, setUpdateIntervalForType } from "react-native-sensors";
import DirectionSign from "./DirectionSign.tsx";

const TestPolylinePoints = [
  {latitude: 40.006901, longitude: 116.097972},
  {latitude: 40.006901, longitude: 116.597},
  {latitude: 40.106901, longitude: 116.597},
  {latitude: 40.106901, longitude: 116.097972},
  {latitude: 40.006901, longitude: 116.097972},
];

const TrkMapScreen = (props: any) => {
  const navigation = useNavigation();
  const mapViewRef = useRef(null);
  const [polylinePoints, setPolylinePoints] = useState(TestPolylinePoints);
  const [polylineColor, setPolylineColor] = useState('#b4c55b');
  const {
    getLocation,
    startLocation,
    stopLocation,
    addLocationListen,
    isStartedLocation,
  } = GeoLocation();
  const [mapType, setMapType] = useState(MapType.Standard);
  const [currentCameraPosition, setCurrentCameraPosition] = useState({
    zoom: 15,
    target: {
      latitude: 40.006901,
      longitude: 116.397972,
    },
  });
  const mapTypeList = [MapType.Standard, MapType.Satellite, MapType.Night];

  useEffect(() => {
    console.log('setCurrentCameraPosition', props.trkStart.currentPoint);
    if (
      props.trkStart.currentPoint.latitude > 0 &&
      props.trkStart.currentPoint.longitude > 0
    ) {
      setCurrentCameraPosition({
        zoom: 19,
        target: {
          latitude: props.trkStart.currentPoint.latitude,
          longitude: props.trkStart.currentPoint.longitude,
        },
      });
    }
  }, [props.trkStart.currentPoint]);

  useEffect(() => {
    setMapType(props.trkStart.mapType);
  }, [props.trkStart.mapType]);

  useEffect(() => {
    AMapSdk.init(
      Platform.select({
        android: 'e9566e6d7e8008a27d40d3e93cba6d67',
        ios: '186d3464209b74effa4d8391f441f14d',
      }),
    );
    // 定位模块已经初始化了权限
  }, []);

  useEffect(() => {
    setPolylinePoints(props.trkStart.points || []);
  }, [props.trkStart.points]);

  const changeMapType = () => {
    const index = mapTypeList.indexOf(mapType);
    const nextIndex = index + 1 >= mapTypeList.length ? 0 : index + 1;
    props.setMapType(mapTypeList[nextIndex]);
  };

  // 进界面后第一次镜头聚焦到上个定位点
  useFocusEffect(
    useCallback(() => {
      const currentPoint = props.trkStart.currentPoint;
      if (currentPoint.latitude > 0 && currentPoint.longitude > 0) {
        const moveCameraPosition = {
          zoom: 19,
          target: {
            latitude: props.trkStart.currentPoint.latitude,
            longitude: props.trkStart.currentPoint.longitude,
          },
        };
        console.log('useFocusEffect', moveCameraPosition);
        if (mapViewRef.current) {
          mapViewRef.current.moveCamera(moveCameraPosition, 1000);
        }
      }
      return () => {};
    }, []),
  );

  const refreshLocation = async () => {
    const permissionOk = await requestPermissions(false);
    if (!permissionOk) {
      return;
    }
    // 如果在持续定位中 则移动镜头到当前位置 不重新定位了 否则需要重新开启
    if (props.trkStart.start && !props.trkStart.pause) {
      mapViewRef.current.moveCamera(currentCameraPosition, 1000);
    } else {
      getLocation(position => {
        console.log('refreshLocation', position);
        const newCameraPosition = {
          zoom: 19,
          target: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        };
        setCurrentCameraPosition(newCameraPosition);
        mapViewRef.current.moveCamera(newCameraPosition, 1000);
      });
    }
  };

  const onBack = () => {
    navigation.goBack();
  };


  const locationMarkerRef = useRef(null);
  const [directionAngle, setDirectionAngle] = useState(0);

  // useEffect(() => {
  //   setUpdateIntervalForType(SensorTypes.magnetometer, 1000);
  //   const subscription = magnetometer.subscribe((data: {x: any; y: any}) => {
  //     const {x, y} = data;
  //     const angle = Math.atan2(y, x) * (180 / Math.PI);
  //     const adjustedAngle = angle >= 0 ? angle : angle + 360;
  //     setDirectionAngle(adjustedAngle);
  //   });
  //
  //   return () => {
  //     subscription.unsubscribe();
  //   };
  // }, []);

  useEffect(() => {
    if (locationMarkerRef.current) {
      locationMarkerRef.current.update();
      console.log('directionAngle', directionAngle);
    }
  }, [directionAngle]);

  return (
    <View style={styles.container}>
      <MapView
        compassEnabled={false}
        ref={mapViewRef}
        style={styles.map}
        mapType={mapType}
        initialCameraPosition={currentCameraPosition}
        zoomControlsEnabled={false}
        scaleControlsEnabled={false}
        trafficEnabled={false}
        buildingsEnabled={false}
        myLocationEnabled={false}>
        <Polyline width={6} color={polylineColor} points={polylinePoints} />
        <Marker
          ref={locationMarkerRef}
          position={currentCameraPosition.target || {}}>
          <LocationMarker directionAngle={directionAngle} />
        </Marker>
      </MapView>
      <View
        style={{
          position: 'absolute',
          top: 10,
          flexDirection: 'row',
          justifyContent: 'center',
          width: 50,
          height: 50,
        }}>
        {/*<DirectionSign />*/}
      </View>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Icon
          // name={props.trkStart.start ? 'chevron-down' : 'close'}
          name={'chevron-down'}
          size={20}
          color="#000"
        />
      </TouchableOpacity>
      <View style={styles.mapOpBtnColumn}>
        <TouchableOpacity style={[styles.button, styles.settingButton]}>
          <Icon name="settings" size={20} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.mapTypeButton]}
          onPress={changeMapType}>
          <Icon name="map" size={20} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.locationButton]}>
          <MIcon
            name="my-location"
            size={20}
            color="#000"
            onPress={refreshLocation}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'grey',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mapOpBtnColumn: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    top: 0,
    right: 0,
    width: 38,
    height: '100%',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    width: 38,
    height: 38,
  },
  settingButton: {
    position: 'absolute',
    right: 10,
    top: 30,
  },
  mapTypeButton: {
    position: 'absolute',
    right: 10,
    top: 100,
  },
  locationButton: {
    position: 'absolute',
    right: 10,
    bottom: '30%',
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,1)',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 100,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    position: 'absolute',
    left: 10,
    top: 30,
  },
  cone: {
    width: 10,
    height: 100,
    backgroundColor: 'yellow',
    // borderLeftWidth: 0,
    // borderLeftColor: 'transparent',
    // borderRightWidth: 0,
    // borderRightColor: 'transparent',
    // borderBottomWidth: 100,
    // borderBottomColor: 'yellow',
  },
});

const stateToProps = (state: any) => {
  return {
    trkStart: state.trkStart,
  };
};

const dispatchToProps = dispatch => ({
  setMapType: (payload: any) => dispatch.trkStart.setMapType(payload),
});

export default connect(stateToProps, dispatchToProps)(TrkMapScreen);
