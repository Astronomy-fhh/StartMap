import React, {useEffect, useRef, useState} from 'react';
import {
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import BottomSheet, {
  BottomSheetView,
  useBottomSheetTimingConfigs,
} from '@gorhom/bottom-sheet';
import {connect} from 'react-redux';
import {Easing} from 'react-native-reanimated';
import GeoLocation from '../Map/GeoLocation.tsx';
import {
  Location,
  ReGeocode,
  LocationType,
} from 'react-native-amap-geolocation/src/types.ts';
import {
  ErrorNotification,
  SuccessAlert,
  WarnAlert,
  WarnNotification,
} from '../../../utils/notification';
import {
  request,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';

export const requestPermissions = async (background = true) => {
  if (Platform.OS === 'android') {
    try {
      let status = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      if (status !== RESULTS.GRANTED) {
        WarnNotification(
          '请授权精确定位权限',
          '允许应用在记录过程中，访问设备的精确地理位置。使用 GPS、网络、Wi-Fi 和其他位置提供者来获取设备的精确位置',
          5000,
        );
        return false;
      }

      status = await request(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION);
      if (status !== RESULTS.GRANTED) {
        WarnNotification(
          '请授权模糊定位权限',
          '允许应用在记录过程中，访问设备的大致地理位置。使用网络、Wi-Fi 和移动网络基站等提供者来获取设备的位置',
          5000,
        );
        return false;
      }

      if (background) {
        status = await request(PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION);
        if (status !== RESULTS.GRANTED) {
          WarnNotification(
            '请授权后台定位权限',
            '当应用挂起, 允许应用在记录过程中，持续的运动位置追踪',
            5000,
          );
          return false;
        }
      }
      return true;
    } catch (err) {
      WarnNotification('申请相关设备权限失败');
      return false;
    }
  } else if (Platform.OS === 'ios') {
    const status = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    if (status === RESULTS.GRANTED) {
      return true;
    } else {
      WarnNotification('申请相关设备权限失败');
      return false;
    }
  }
};

const TrkStartScreen = (props: any) => {
  console.log('TrkStartScreen', props);

  const handleSheetChanges = (index: number) => {
    console.log('handleSheetChanges', index);
  };
  const bottomSheetRef = useRef(null);
  const {startLocation, stopLocation, addLocationListen, clearLocationListen} =
    GeoLocation();

  const startHandle = async () => {
    const permissionOk = await requestPermissions();
    if (!permissionOk) {
      return;
    }
    clearLocationListen();
    stopLocation();
    addLocationListen((location: Location & ReGeocode) => {
      console.log('location', location);
      if (location.errorCode) {
        ErrorNotification('定位失败', location.errorInfo || '');
        return;
      }
      if (location.locationType !== LocationType.GPS) {
        WarnAlert('GPS定位信号弱，请移动至开阔地带');
        return;
      }
      console.log('gpsAccuracy', location.gpsAccuracy);
      const currentTrkPoint = {
        latitude: location.latitude,
        longitude: location.longitude,
        altitude: location.altitude,
        speed: location.speed,
        time: new Date(location.timestamp || 0).toISOString(),
        pause: false,
      };
      // 记录第一个点的位置详情
      if (props.trkStart.locationInfo.address === undefined) {
        props.setLocationInfo({
          address: location.address,
          country: location.country,
          city: location.city,
          adCode: location.adCode,
        });
      }
      props.checkAddTrkPoint(currentTrkPoint);
      props.setCurrentPoint(currentTrkPoint);
    });
    startLocation();
    props.setStart(true);
    SuccessAlert('记录已开始', '户外活动 注意安全 结伴而行');
  };

  const animationConfigs = useBottomSheetTimingConfigs({
    duration: 100,
    easing: Easing.exp,
  });

  return (
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
      snapPoints={['12%', '12%']}>
      <BottomSheetView>
        <View style={styles.bottomBtnLine}>
          <TouchableOpacity
            style={[styles.startItemOpBtn, styles.startItemOpBtnBgStart]}
            onPress={startHandle}>
            <Text style={styles.startButtonText}>添加轨迹</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.startItemOpBtn, styles.startItemOpBtnBgStart]}
            onPress={startHandle}>
            <Text style={styles.startButtonText}>开始记录</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {},
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
    width: 160,
    height: 60,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  startItemOpBtnBgStart: {
    backgroundColor: '#000',
  },
  startItemOpBtnBgPause: {
    backgroundColor: '#ff8c00',
  },
  startItemOpBtnBgEnd: {
    backgroundColor: '#ff4500',
  },

  startButtonText: {
    color: 'white',
    fontSize: 20,
  },
  bottomBtnLine: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    paddingBottom: 20,
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

export default connect(stateToProps, dispatchToProps)(TrkStartScreen);
