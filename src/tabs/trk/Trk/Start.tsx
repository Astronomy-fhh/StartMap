import React, {useEffect, useRef, useState} from 'react';
import {
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
const TrkStartScreen = (props: any) => {
  console.log('TrkStartScreen', props);

  const handleSheetChanges = (index: number) => {
    console.log('handleSheetChanges', index);
  };
  const bottomSheetRef = useRef(null);
  const {startLocation, stopLocation, addLocationListen} = GeoLocation();

  const startHandle = () => {
    stopLocation();
    startLocation();
    addLocationListen((location: Location & ReGeocode) => {
      console.log('trking location listen', location);
      if (location.errorCode) {
        console.log('trking location listen error', location.errorInfo);
        return;
      }
      if (location.locationType !== LocationType.GPS) {
        console.log('trking location listen warn', 'locationType is not GPS');
        //return;
      }
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
    props.setStart(true);
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
      snapPoints={['4%', '17%']}>
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
    height: 80,
    borderRadius: 26,
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
