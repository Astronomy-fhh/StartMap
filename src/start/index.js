import React, {useRef, useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Platform,
  PermissionsAndroid,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import {AMapSdk, MapView, MapType, Polyline} from 'react-native-amap3d';
import {connect} from 'react-redux';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import {
  init as GepLocationInit,
  Geolocation,
  addLocationListener as GeoAddLocationListener,
  start as GeoStart,
  stop as GeoStop,
} from 'react-native-amap-geolocation';

// import {
//   init as GepLocationInit,
//   Geolocation,
//   addLocationListener as GeoAddLocationListener,
//   start as GeoStart,
//   stop as GeoStop,
// } from './mockLocation';

const StartScreen = props => {
  const [mapTypeIndex, setMapTypeIndex] = useState(0);
  const mapViewRef = useRef(null);
  const bottomSheetRef = useRef(null);
  const [startPoints, setStartPoints] = useState([]);
  const [isGeoInitialized, setIsGeoInitialized] = useState(false);


  const [start, setStart] = useState(false);
  const [pause, setPause] = useState(false);

  const mapTypes = [
    {type: MapType.Standard, name: '标准'},
    {type: MapType.Satellite, name: '卫星'},
    {type: MapType.Night, name: '夜间'},
    {type: MapType.Navi, name: '导航'},
  ];

  const toggleMapType = () => {
    setMapTypeIndex(prevIndex => (prevIndex + 1) % mapTypes.length);
  };

  const updateCameraPosition = coords => {
    const newCameraPosition = {
      target: {
        latitude: coords.latitude,
        longitude: coords.longitude,
      },
      zoom: 18,
    };
    props.updateCameraPosition(newCameraPosition);
    mapViewRef.current.moveCamera(newCameraPosition, 1000);
  };

  const refreshPosition = () => {
    Geolocation.getCurrentPosition(
      ({coords}) => {
        updateCameraPosition(coords);
      },
      error => console.log(error),
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  useEffect(() => {
    const initialize = async () => {
      AMapSdk.init(
        Platform.select({
          android: 'e9566e6d7e8008a27d40d3e93cba6d67',
          ios: '186d3464209b74effa4d8391f441f14d',
        }),
      );

      if (Platform.OS === 'android') {
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        ]);
      }

      await GepLocationInit({
        android: 'e9566e6d7e8008a27d40d3e93cba6d67',
        ios: '9bd6c82e77583020a73ef1af59d0c759',
      });
      setIsGeoInitialized(true);
      refreshPosition();
    };
    initialize();
  }, []);

  const handleSheetChanges = index => {
    console.log('handleSheetChanges', index);
  };

  useEffect(() => {
    if (!isGeoInitialized) {
      return;
    }
    const locationListener = location => {
      console.log('运动中更新位置：', location);
      const newCameraPosition = {
        target: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
        zoom: 18,
      };
      //props.updateCameraPosition(newCameraPosition);
      mapViewRef.current.moveCamera(newCameraPosition, 1000);
      setStartPoints(currentLine => [
        ...currentLine,
        {
          latitude: location.latitude,
          longitude: location.longitude,
          altitude: location.altitude,
          timestamp: location.timestamp,
        },
      ]);
    };

    if (start && !pause) {
      GeoAddLocationListener(locationListener);
      GeoStart();
    } else {
      GeoStop();
    }

    return () => {
      if (start) {
        GeoStop();
      }
    };
  }, [start, pause, isGeoInitialized]);

  const currentMapType = mapTypes[mapTypeIndex].type;
  const currentMapTypeName = mapTypes[mapTypeIndex].name;

  const startHandle = () => {
    if (!start) {
      setStart(true);
      setPause(false);
    }
  };
  const stopHandle = () => {
    if (start) {
      setStart(false);
      setPause(false);
      props.addTrk({points: startPoints});

      Alert.alert('Success', '轨迹保存成功');
      setStartPoints([]);
    }
  };
  const pauseHandle = () => {
    setPause(!pause);
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapViewRef}
        style={styles.map}
        mapType={currentMapType}
        initialCameraPosition={props.map.initialCameraPosition}
        distanceFilter={10}
        headingFilter={30}
        myLocationEnabled={true}>
        <Polyline width={5} color="rgba(255, 0, 0, 0.5)" points={startPoints} />
      </MapView>
      <BottomSheet
        ref={bottomSheetRef}
        onChange={handleSheetChanges}
        snapPoints={['30%', '80%']}>
        <BottomSheetView>
          <View style={styles.startItemContainer}>
            <View style={styles.startItemRow}>
              <View style={styles.startItemColumn}>
                <Text style={styles.startItemValue}>
                  0:00
                  <Text style={styles.startItemUnit} />
                </Text>
                <Text style={styles.startItemLabel}>时间</Text>
              </View>
              <View style={styles.startItemColumn}>
                <Text style={styles.startItemValue}>
                  0.0<Text style={styles.startItemUnit}> km</Text>
                </Text>
                <Text style={styles.startItemLabel}>距离</Text>
              </View>
              <View style={styles.startItemColumn}>
                <Text style={styles.startItemValue}>
                  0<Text style={styles.startItemUnit}> m</Text>
                </Text>
                <Text style={styles.startItemLabel}>爬升</Text>
              </View>
            </View>
            <View style={styles.startItemRow}>
              <View style={styles.startItemColumn}>
                <Text style={styles.startItemValue}>
                  0<Text style={styles.startItemUnit}> m</Text>
                </Text>
                <Text style={styles.startItemLabel}>海拔</Text>
              </View>
              <View style={styles.startItemColumn}>
                <Text style={styles.startItemValue}>
                  0.0<Text style={styles.startItemUnit}> kph</Text>
                </Text>
                <Text style={styles.startItemLabel}>速度</Text>
              </View>
              <View style={styles.startItemColumn}>
                <Text style={styles.startItemValue}>
                  0.0<Text style={styles.startItemUnit}> km</Text>
                </Text>
                <Text style={styles.startItemLabel}>总距离</Text>
              </View>
            </View>
          </View>
        </BottomSheetView>
      </BottomSheet>
      <View style={styles.pickerContainer}>
        <TouchableOpacity style={styles.mapTypeBtn} onPress={toggleMapType}>
          <Text>{currentMapTypeName}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.mapTypeBtn} onPress={refreshPosition}>
          <Text>定位</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.startItemOpContainer}>
        {!start && (
          <TouchableOpacity
            style={[styles.startItemOpBtn, styles.startItemOpBtnBgStart]}
            onPress={startHandle}>
            <Text style={styles.startButtonText}>开始</Text>
          </TouchableOpacity>
        )}
        {start && (
          <>
            <TouchableOpacity
              style={[styles.startItemOpBtn, styles.startItemOpBtnBgPause]}
              onPress={pauseHandle}>
              <Text style={styles.startButtonText}>
                {pause ? '继续' : '暂停'}
              </Text>
            </TouchableOpacity>
          </>
        )}
        {start && pause && (
          <>
            <TouchableOpacity
              style={[styles.startItemOpBtn, styles.startItemOpBtnBgEnd]}
              onPress={stopHandle}>
              <Text style={styles.startButtonText}>{'结束'}</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
      <View />
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
  pickerContainer: {
    position: 'absolute',
    top: 50,
    right: 10,
  },
  mapTypeBtn: {
    backgroundColor: '#b1b1b1',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#000',
    width: 50,
    height: 50,
  },
  startItemContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingLeft: 20,
  },
  startItemRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 10,
    width: '100%',
  },
  startItemColumn: {
    width: 70,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  startItemValue: {
    color: '#2f4f4f',
    fontSize: 24,
    fontWeight: 'bold',
  },
  startItemUnit: {
    color: '#696969',
    fontSize: 14,
    fontWeight: 'bold',
  },
  startItemLabel: {
    color: '#696969',
    fontSize: 14,
  },

  startItemOpContainer: {
    position: 'absolute',
    bottom: 35,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  startItemOpBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  startItemOpBtnBgStart: {
    backgroundColor: '#efa352',
  },
  startItemOpBtnBgPause: {
    backgroundColor: '#ff8c00',
  },
  startItemOpBtnBgEnd: {
    backgroundColor: '#ff4500',
  },

  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  circularProgress: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const mapStateToProps = state => {
  console.log('Mapping state to props', state.map);
  return {
    map: state.map,
  };
};

const mapDispatchToProps = dispatch => ({
  updateCameraPosition: payload => dispatch.map.updateCameraPosition(payload),
  updateMapType: payload => dispatch.map.updateMapType(payload),
  addTrk: payload => dispatch.trk.addTrk(payload),
});

export default connect(mapStateToProps, mapDispatchToProps)(StartScreen);
