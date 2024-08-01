import {AMapSdk, MapType, MapView, Polyline} from 'react-native-amap3d';
import React, {useEffect, useRef, useState} from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import BottomSheet, {
  BottomSheetView,
  useBottomSheetTimingConfigs,
} from '@gorhom/bottom-sheet';
import {connect} from 'react-redux';
import {Easing} from 'react-native-reanimated';
const RecordDetail = (props: any) => {
  // const {record} = props.route.params;
  // console.log('record:', record);

  const handleSheetChanges = (index: number) => {
    console.log('handleSheetChanges', index);
  };
  const bottomSheetRef = useRef(null);

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
      snapPoints={['10%', '50%', '90%']}>
      <BottomSheetView>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'flex-start',
            paddingHorizontal: 30,
          }}>
          <View>
            <Text>2024年02月21日 09:23</Text>
          </View>
          <View style={{paddingTop: 10}}>
            <Text>中国 北京</Text>
          </View>
          <View style={styles.separator}></View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={{alignItems: 'center'}}>
              <View style={{flexDirection: 'column', alignItems: 'flex-start'}}>
                <Text style={{fontSize: 16, color: '#575757'}}>距离</Text>
                <Text style={{fontSize: 20, color: '#000', fontWeight: '700'}}>11.20 km</Text>
                <View style={{height: 10}}></View>
                <Text style={{fontSize: 16, color: '#575757'}}>爬升</Text>
                <Text style={{fontSize: 20, color: '#000', fontWeight: '700'}}>1581 m</Text>
              </View>
            </View>
            <View style={{alignItems: 'center'}}>
              <View style={{flexDirection: 'column', alignItems: 'flex-start'}}>
                <Text style={{fontSize: 16, color: '#575757'}}>用时</Text>
                <Text style={{fontSize: 20, color: '#000', fontWeight: '700'}}>{"02:23:34"}</Text>
                <View style={{height: 10}}></View>
                <Text style={{fontSize: 16, color: '#575757'}}>下降</Text>
                <Text style={{fontSize: 20, color: '#000', fontWeight: '700'}}>123 m</Text>
              </View>
            </View>
            <View style={{ alignItems: 'center'}}>
              <View style={{flexDirection: 'column', alignItems: 'flex-start'}}>
                <Text style={{fontSize: 16, color: '#575757'}}>总用时</Text>
                <Text style={{fontSize: 20, color: '#000', fontWeight: '700'}}>02:58:34</Text>
                <View style={{height: 10}}></View>
                <Text style={{fontSize: 16, color: '#575757'}}>均速</Text>
                <Text style={{fontSize: 20, color: '#000', fontWeight: '700'}}>4.21 kph</Text>
              </View>
            </View>
          </View>
          <View style={styles.separator}></View>

          <TouchableOpacity
            style={{
              height: 40,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#e1e1e1',
            }}>
            <Text style={{color: '#000', fontSize: 14}}>显示分段配速</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  separator: {
    height: 1,
    backgroundColor: '#e1e1e1',
    marginVertical: 20,
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

export default connect(stateToProps, dispatchToProps)(RecordDetail);
