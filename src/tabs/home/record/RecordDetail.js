import {AMapSdk, MapType, MapView, Polyline} from 'react-native-amap3d';
import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  LayoutAnimation,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetView,
  useBottomSheetTimingConfigs,
} from '@gorhom/bottom-sheet';
import {connect} from 'react-redux';
import {Easing} from 'react-native-reanimated';
import RecordDetailStepSpeed from './RecordDetailStepSpeed';
import RecordDetailElevationChart from './RecordDetailElevationChart';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from "@react-navigation/native"; // 确保安装了 react-native-vector-icons
const RecordDetail = (props: any) => {
  // const {record} = props.route.params;
  // console.log('record:', record);

  const navigator = useNavigation();
  console.log('detail', navigator.getState());

  const handleSheetChanges = (index: number) => {
    console.log('handleSheetChanges', index);
  };
  const bottomSheetRef = useRef(null);

  const animationConfigs = useBottomSheetTimingConfigs({
    duration: 100,
    easing: Easing.exp,
  });

  const [stepSpeedExpend, setStepSpeedExpend] = useState(false);

  const toggleStepSpeedExpand = () => {
    setStepSpeedExpend(!stepSpeedExpend);
  };

  const mapViewRef = useRef(null);
  const [polylineColor, setPolylineColor] = useState('#c146ea');
  const TestPolylinePoints = [
    {latitude: 40.006901, longitude: 116.097972},
    {latitude: 40.006901, longitude: 116.597},
    {latitude: 40.106901, longitude: 116.597},
    {latitude: 40.106901, longitude: 116.097972},
    {latitude: 40.006901, longitude: 116.097972},
  ];
  const [polylinePoints, setPolylinePoints] = useState(TestPolylinePoints);

  const navigation = useNavigation();

  const onBack = () => {
    navigation.goBack();
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'grey',
      }}>
      <MapView
        style={{width: '100%', height: '100%'}}
        ref={mapViewRef}
        mapType={MapType.Night}
        // initialCameraPosition={currentCameraPosition}
        zoomControlsEnabled={false}
        scaleControlsEnabled={false}
        myLocationEnabled={true}>
        <Polyline width={3} color={polylineColor} points={polylinePoints} />
      </MapView>
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
              paddingHorizontal: 30,
              flex: 1,
              paddingBottom: 100,
            }}>
            <View>
              <Text style={{color: '#535353'}}>2024年02月21日 09:23</Text>
            </View>
            <View style={{paddingTop: 10}}>
              <Text style={{color: '#535353'}}>中国 北京</Text>
            </View>
            <View style={styles.separator} />

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View style={{alignItems: 'center'}}>
                <View
                  style={{flexDirection: 'column', alignItems: 'flex-start'}}>
                  <Text style={{fontSize: 16, color: '#575757'}}>距离</Text>
                  <Text
                    style={{fontSize: 20, color: '#000', fontWeight: '700'}}>
                    11.20 km
                  </Text>
                  <View style={{height: 10}} />
                  <Text style={{fontSize: 16, color: '#575757'}}>爬升</Text>
                  <Text
                    style={{fontSize: 20, color: '#000', fontWeight: '700'}}>
                    1581 m
                  </Text>
                </View>
              </View>
              <View style={{alignItems: 'center'}}>
                <View
                  style={{flexDirection: 'column', alignItems: 'flex-start'}}>
                  <Text style={{fontSize: 16, color: '#575757'}}>用时</Text>
                  <Text
                    style={{fontSize: 20, color: '#000', fontWeight: '700'}}>
                    {'02:23:34'}
                  </Text>
                  <View style={{height: 10}} />
                  <Text style={{fontSize: 16, color: '#575757'}}>下降</Text>
                  <Text
                    style={{fontSize: 20, color: '#000', fontWeight: '700'}}>
                    123 m
                  </Text>
                </View>
              </View>
              <View style={{alignItems: 'center'}}>
                <View
                  style={{flexDirection: 'column', alignItems: 'flex-start'}}>
                  <Text style={{fontSize: 16, color: '#575757'}}>总用时</Text>
                  <Text
                    style={{fontSize: 20, color: '#000', fontWeight: '700'}}>
                    02:58:34
                  </Text>
                  <View style={{height: 10}} />
                  <Text style={{fontSize: 16, color: '#575757'}}>均速</Text>
                  <Text
                    style={{fontSize: 20, color: '#000', fontWeight: '700'}}>
                    4.21 kph
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.separator} />
            <RecordDetailElevationChart />
            <View style={styles.separator} />
            <RecordDetailElevationChart />
            <View style={styles.separator} />
            <TouchableOpacity
              onPress={toggleStepSpeedExpand}
              style={{
                height: 40,
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#e1e1e1',
                marginTop: 10,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{color: '#000', fontSize: 14}}>分段配速</Text>
                <Icon
                  name={stepSpeedExpend ? 'expand-less' : 'expand-more'}
                  size={18}
                  color="#656565"
                  style={{marginLeft: 2}}
                />
              </View>
            </TouchableOpacity>
            {stepSpeedExpend ? <RecordDetailStepSpeed /> : null}
            <TouchableOpacity
              style={{
                height: 40,
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#e1e1e1',
                marginTop: 10,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{color: '#000', fontSize: 14}}>查看路线</Text>
                <Icon
                  name="navigate-next"
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
