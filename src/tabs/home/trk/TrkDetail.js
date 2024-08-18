import {AMapSdk, MapType, MapView, Polyline} from 'react-native-amap3d';
import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetView,
  useBottomSheetTimingConfigs,
} from '@gorhom/bottom-sheet';
import {connect} from 'react-redux';
import {Easing} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment/moment';
import {formatMinutesToTime, formatTimeRange} from '../../../utils/format';
import EleChart from './EleChart';
import {IconButton, Menu} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { convertTrkToGpx, formatTrkForDisplay } from "../../../utils/gpx";
import RNFS from "react-native-fs";
import { ErrorNotification, SuccessNotification } from "../../../utils/notification";
import { getZoomLevel } from "../../../utils/map";
import { refreshMediaLibrary } from "../../../utils/file";

const TrkDetail = props => {
  const {trk} = props.route.params;

  const navigation = useNavigation();

  const [visible, setVisible] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const deleteTrk = () => {
    props.deleteTrk(trk.id);
    navigation.goBack();
  };

  const exportGpx = async () => {
    const gpxContent = convertTrkToGpx(trk);
    console.log(gpxContent);
    const fileName = `${trk.title || trk.startTime}.gpx`;
    try {
      const path = `${RNFS.DownloadDirectoryPath}/${fileName}`;
      await RNFS.writeFile(path, gpxContent, 'utf8');
      SuccessNotification('已导出至下载目录', fileName);
    } catch (error) {
      ErrorNotification('导出失败', error.message || '未知错误');
    }
  };

  const exportDebug = async () => {
    const gpxContent = formatTrkForDisplay(trk);
    console.log(gpxContent);
    const fileName = `${trk.title || trk.startTime}_debug.log`;
    try {
      const path = `${RNFS.DownloadDirectoryPath}/${fileName}`;
      await RNFS.writeFile(path, gpxContent, 'utf8');
      SuccessNotification('已导出至下载目录', fileName);
    } catch (error) {
      ErrorNotification('导出失败', error.message || '未知错误');
    }
  };

  React.useEffect(() => {
    navigation.setOptions({
      headerRightStyle: {
        marginRight: 50,
      },
      headerRight: () => (
        <Menu
          visible={visible}
          contentStyle={styles.menu}
          onDismiss={closeMenu}
          anchorPosition="bottom"
          anchor={
            <IconButton
              icon={() => (
                <MaterialCommunityIcons
                  name="dots-vertical"
                  size={24}
                  color="#000"
                />
              )}
              onPress={openMenu}
            />
          }>
          <Menu.Item
            style={styles.menuItem}
            onPress={exportGpx}
            title="导出GPX文件"
            titleStyle={styles.menuItemTitle}
          />
          <Menu.Item
            style={styles.menuItem}
            onPress={deleteTrk}
            title="删除"
            titleStyle={styles.menuItemTitle}
          />
          <Menu.Item
            style={styles.menuItem}
            onPress={exportDebug}
            title="debug导出结构文件"
            titleStyle={styles.menuItemTitle}
          />
        </Menu>
      ),
    });
  }, [navigation, visible]);

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
          latitude: point.latitude,
          longitude: point.longitude,
        };
      }),
    );
  }, [trk]);

  const onBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    if (trk.points.length > 0) {
      const latitudes = trk.points.map(coord => coord.latitude);
      const longitudes = trk.points.map(coord => coord.longitude);

      const minLat = Math.min(...latitudes);
      const maxLat = Math.max(...latitudes);
      const minLng = Math.min(...longitudes);
      const maxLng = Math.max(...longitudes);

      const latDiff = maxLat - minLat;
      const lngDiff = maxLng - minLng;
      const midLat = (minLat + maxLat) / 2;
      const midLng = (minLng + maxLng) / 2;

      const maxDiff = Math.max(latDiff, lngDiff);
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
            <Icon name="add" size={20} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={changeMapType}>
            <Icon name="layers-sharp" size={20} color="#000" />
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
        snapPoints={['11%', '58%']}>
        <BottomSheetView>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'flex-start',
            }}>
            <View style={{height: '12%'}}>
              <View
                style={{
                  paddingHorizontal: 20,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text style={{color: '#535353'}}>
                  {trk.startTime
                    ? formatTimeRange(trk.startTime, trk.endTime)
                    : ''}
                </Text>
              </View>
              <View
                style={{
                  paddingHorizontal: 20,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingTop: 20,
                }}>
                <Text style={{color: '#777777', fontSize: 13}}>
                  {trk.title || ''}
                </Text>
              </View>
            </View>
            <View style={styles.separator} />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 40,
              }}>
              <View
                style={{
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  height: '25%',
                }}>
                <Text style={{fontSize: 16, color: '#575757'}}>距离</Text>
                <Text
                  style={{fontSize: 20, color: '#454545', fontWeight: '700'}}>
                  {(trk.distance / 1000).toFixed(2)} km
                </Text>
                <View style={{height: 20}} />
                <Text style={{fontSize: 16, color: '#575757'}}>爬升</Text>
                <Text
                  style={{fontSize: 20, color: '#454545', fontWeight: '700'}}>
                  {trk.ascent.toFixed(0)} m
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  height: '25%',
                }}>
                <Text style={{fontSize: 16, color: '#575757'}}>用时</Text>
                <Text
                  style={{fontSize: 20, color: '#454545', fontWeight: '700'}}>
                  {formatMinutesToTime((trk.useTime / 1000).toFixed(0))}
                </Text>
                <View style={{height: 20}} />
                <Text style={{fontSize: 16, color: '#575757'}}>下降</Text>
                <Text
                  style={{fontSize: 20, color: '#454545', fontWeight: '700'}}>
                  {trk.descent.toFixed(0)} m
                </Text>
              </View>
            </View>
            <View style={styles.separator} />
            <EleChart trk={trk} />
          </View>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  separator: {
    height: 1,
    backgroundColor: '#e1e1e1',
    marginVertical: '5%',
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
    right: 20,
    width: 38,
    top: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,1)',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    height: 38,
    width: 38,
  },
  menu: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
  },
  menuItem: {
    backgroundColor: '#ffffff', // 背景颜色
  },
  menuItemTitle: {
    color: '#333',
    fontSize: 15,
  },
});

const stateToProps = state => {
  return {
    trkStart: state.trkStart,
  };
};

const dispatchToProps = dispatch => ({
  setCurrentPoint: payload => dispatch.trkStart.setCurrentPoint(payload),
  checkAddTrkPoint: payload => dispatch.trkStart.checkAddTrkPoint(payload),
  setStart: payload => dispatch.trkStart.setStart(payload),
  setPause: payload => dispatch.trkStart.setPause(payload),
  setLocationInfo: payload => dispatch.trkStart.setLocationInfo(payload),
  deleteTrk: payload => dispatch.trkList.delete(payload),
});

export default connect(stateToProps, dispatchToProps)(TrkDetail);
