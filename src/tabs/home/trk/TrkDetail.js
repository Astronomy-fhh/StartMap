import {AMapSdk, MapType, MapView, Polyline} from 'react-native-amap3d';
import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import BottomSheet, {
  BottomSheetScrollView,
  useBottomSheetTimingConfigs,
} from '@gorhom/bottom-sheet';
import {connect} from 'react-redux';
import {Easing} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment/moment';
import {formatMinutesToTime} from '../../../utils/format';
import EleChart from './EleChart';
const TrkDetail = props => {
  const {trk} = props.route.params;

  const handleSheetChanges = index => {
    console.log('handleSheetChanges', index);
  };
  const bottomSheetRef = useRef(null);

  const animationConfigs = useBottomSheetTimingConfigs({
    duration: 100,
    easing: Easing.exp,
  });

  const currentCameraPosition = useRef({});

  const [stepSpeedExpend, setStepSpeedExpend] = useState(false);

  const toggleStepSpeedExpand = () => {
    setStepSpeedExpend(!stepSpeedExpend);
  };

  const mapViewRef = useRef(null);
  const [polylineColor, setPolylineColor] = useState('#626c2c');
  // const TestPolylinePoints = [
  //   {latitude: 40.006901, longitude: 116.097972},
  //   {latitude: 40.006901, longitude: 116.597},
  //   {latitude: 40.106901, longitude: 116.597},
  //   {latitude: 40.106901, longitude: 116.097972},
  //   {latitude: 40.006901, longitude: 116.097972},
  // ];
  const [polylinePoints, setPolylinePoints] = useState([]);

  useEffect(() => {
    setPolylinePoints(
      trk.points.map(point => {
        return {
          latitude: point.lat,
          longitude: point.lon,
        };
      }),
    );
  }, [trk]);

  // useEffect(() => {
  //   const firstForcePoint = {
  //     target: {
  //       latitude: trk.points[0].lat,
  //       longitude: trk.points[0].lon,
  //     },
  //     zoom: 13,
  //   };
  //   mapViewRef.current.moveCamera(firstForcePoint, 1000);
  // }, [trk]);

  const navigation = useNavigation();

  const onBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    if (trk.points.length > 0) {
      const latitudes = trk.points.map(coord => coord.lat);
      const longitudes = trk.points.map(coord => coord.lon);

      const minLat = Math.min(...latitudes);
      const maxLat = Math.max(...latitudes);
      const minLng = Math.min(...longitudes);
      const maxLng = Math.max(...longitudes);

      const latDiff = maxLat - minLat;
      const lngDiff = maxLng - minLng;
      const midLat = (minLat + maxLat) / 2;
      const midLng = (minLng + maxLng) / 2;

      const maxDiff = Math.max(latDiff, lngDiff);

      function getZoomLevel(maxDiff) {
        if (maxDiff <= 0.0005) {
          return 21;
        }
        if (maxDiff <= 0.001) {
          return 20;
        }
        if (maxDiff <= 0.002) {
          return 19;
        }
        if (maxDiff <= 0.005) {
          return 18;
        }
        if (maxDiff <= 0.01) {
          return 17;
        }
        if (maxDiff <= 0.02) {
          return 16;
        }
        if (maxDiff <= 0.05) {
          return 15;
        }
        if (maxDiff <= 0.1) {
          return 14;
        }
        if (maxDiff <= 0.2) {
          return 13;
        }
        if (maxDiff <= 0.5) {
          return 12;
        }
        if (maxDiff <= 1) {
          return 11;
        }
        if (maxDiff <= 2) {
          return 10;
        }
        if (maxDiff <= 5) {
          return 9;
        }
        if (maxDiff <= 10) {
          return 8;
        }
        if (maxDiff <= 20) {
          return 7;
        }
        if (maxDiff <= 50) {
          return 6;
        }
        if (maxDiff <= 100) {
          return 5;
        }
        if (maxDiff <= 200) {
          return 4;
        }
        if (maxDiff <= 500) {
          return 3;
        }
        return 2;
      }

      const zoom = getZoomLevel(maxDiff);
      console.log(maxLng, minLng, midLng, maxLat, minLat, midLat, zoom);

      currentCameraPosition.current = {
        target: {
          latitude: midLat - latDiff,
          longitude: midLng,
        },
        zoom: zoom - 1,
      };
      mapViewRef.current.moveCamera(currentCameraPosition.current, 200);
    }
  }, [trk]);

  const [mapType, setMapType] = useState(MapType.Night);
  const mapTypeList = [MapType.Standard, MapType.Satellite, MapType.Night];
  const changeMapType = () => {
    const index = mapTypeList.indexOf(mapType);
    const nextIndex = index + 1 >= mapTypeList.length ? 0 : index + 1;
    setMapType(mapTypeList[nextIndex]);
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'grey',
      }}>
      <View style={{flex: 1, width: '100%', height: '100%'}}>
        <MapView
          style={{width: '100%', height: '100%'}}
          ref={mapViewRef}
          initialCameraPosition={currentCameraPosition.current}
          mapType={mapType}
          zoomControlsEnabled={false}
          scaleControlsEnabled={false}
          myLocationEnabled={true}>
          <Polyline width={3} color={'#b4c55b'} points={polylinePoints} />
        </MapView>
        <View style={styles.mapOpBtnColumn}>
          <TouchableOpacity style={styles.button}>
            <Icon name="add" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={changeMapType}>
            <Icon name="layers-sharp" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>
      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        onChange={handleSheetChanges}
        detached={false}
        enableDynamicSizing={false}
        animationConfigs={animationConfigs}
        handleIndicatorStyle={{
          backgroundColor: 'rgba(193,192,192,0.32)',
        }}
        backgroundStyle={{
          backgroundColor: '#fff',
        }}
        snapPoints={['10%', '50%', '90%']}>
        <BottomSheetScrollView>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'flex-start',
              flex: 1,
              paddingBottom: 100,
            }}>
            <View
              style={{
                paddingHorizontal: 40,
              }}>
              <Text style={{color: '#535353'}}>
                {trk.startTime
                  ? moment(trk.startTime).format('YYYY年MM月DD日 HH:mm  ')
                  : ''}
              </Text>
            </View>
            <View style={{paddingTop: 10, paddingHorizontal: 40}}>
              <Text style={{color: '#535353'}}>
                {trk.country} {trk.city}
              </Text>
            </View>
            <View style={styles.separator} />

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 40,
              }}>
              <View style={{alignItems: 'center'}}>
                <View
                  style={{flexDirection: 'column', alignItems: 'flex-start'}}>
                  <Text style={{fontSize: 16, color: '#575757'}}>距离</Text>
                  <Text
                    style={{fontSize: 20, color: '#000', fontWeight: '700'}}>
                    {(trk.distance / 1000).toFixed(2)} km
                  </Text>
                  <View style={{height: 20}} />
                  <Text style={{fontSize: 16, color: '#575757'}}>爬升</Text>
                  <Text
                    style={{fontSize: 20, color: '#000', fontWeight: '700'}}>
                    {trk.ascent.toFixed(0)} m
                  </Text>
                </View>
              </View>
              <View style={{alignItems: 'center'}}>
                <View
                  style={{flexDirection: 'column', alignItems: 'flex-start'}}>
                  <Text style={{fontSize: 16, color: '#575757'}}>用时</Text>
                  <Text
                    style={{fontSize: 20, color: '#000', fontWeight: '700'}}>
                    {formatMinutesToTime(trk.useTime.toFixed(0))}
                  </Text>
                  <View style={{height: 20}} />
                  <Text style={{fontSize: 16, color: '#575757'}}>下降</Text>
                  <Text
                    style={{fontSize: 20, color: '#000', fontWeight: '700'}}>
                    {trk.descent.toFixed(0)} m
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.separator} />
            <EleChart trk={trk} />
            <View style={styles.separator} />
            <TouchableOpacity
              style={{
                height: 40,
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#e1e1e1',
                marginTop: 10,
                marginHorizontal: 10,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{color: '#000', fontSize: 14}}>增加标记</Text>
                <Icon
                  name={'add'}
                  size={18}
                  color="#656565"
                  style={{marginLeft: 2}}
                />
              </View>
            </TouchableOpacity>
          </View>
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  separator: {
    height: 1,
    backgroundColor: '#e1e1e1',
    marginVertical: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 50,
    left: 10,
    zIndex: 999,
    fontWeight: 100,
    shadowColor: '#000',
    shadowOpacity: 0.1,
  },
  mapOpBtnColumn: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    right: 10,
    width: 50,
    top: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,1)',
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
  setCurrentPoint: (payload: any) => dispatch.trkStart.setCurrentPoint(payload),
  checkAddTrkPoint: (payload: any) =>
    dispatch.trkStart.checkAddTrkPoint(payload),
  setStart: (payload: any) => dispatch.trkStart.setStart(payload),
  setPause: (payload: any) => dispatch.trkStart.setPause(payload),
  setLocationInfo: (payload: any) => dispatch.trkStart.setLocationInfo(payload),
});

export default connect(stateToProps, dispatchToProps)(TrkDetail);
