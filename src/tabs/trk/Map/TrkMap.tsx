import {AMapSdk, MapType, MapView, Polyline} from 'react-native-amap3d';
import React, { useCallback, useEffect, useRef, useState } from "react";
import {Text, Platform, StyleSheet, TouchableOpacity, View} from 'react-native';
import GeoLocation from './GeoLocation.tsx';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { Location, ReGeocode } from "react-native-amap-geolocation/src/types.ts";
import { useFocusEffect } from "@react-navigation/native";

const TestPolylinePoints = [
  {latitude: 40.006901, longitude: 116.097972},
  {latitude: 40.006901, longitude: 116.597},
  {latitude: 40.106901, longitude: 116.597},
  {latitude: 40.106901, longitude: 116.097972},
  {latitude: 40.006901, longitude: 116.097972},
];

const TrkMapScreen = (props: any) => {
  const mapViewRef = useRef(null);
  const [polylinePoints, setPolylinePoints] = useState(TestPolylinePoints);
  const [polylineColor, setPolylineColor] = useState('#c146ea');
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
    console.log('setCurrentCameraPosition');

    setCurrentCameraPosition({
      zoom: 19,
      target: {
        latitude: props.trkStart.currentPoint.latitude,
        longitude: props.trkStart.currentPoint.longitude,
      },
    });
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

  const refreshLocation = () => {
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

  return (
    <View style={styles.container}>
      <MapView
        ref={mapViewRef}
        style={styles.map}
        mapType={mapType}
        initialCameraPosition={currentCameraPosition}
        zoomControlsEnabled={false}
        scaleControlsEnabled={false}
        myLocationEnabled={true}>
        <Polyline width={3} color={polylineColor} points={polylinePoints} />
      </MapView>
      <View style={styles.mapOpBtnColumn}>
        <TouchableOpacity style={styles.button}>
          <Icon name="add" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={changeMapType}>
          <Icon name="map" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Icon
            name="locate"
            size={24}
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
    justifyContent: 'center',
    borderRadius: 10,
    top: 200,
    right: 10,
    width: 50,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
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
