import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import BottomSheet, {
  BottomSheetView,
  useBottomSheetTimingConfigs,
} from '@gorhom/bottom-sheet';
import {connect} from 'react-redux';
import {Easing} from 'react-native-reanimated';
import GeoLocation from '../Map/GeoLocation.tsx';
import {calculateTrkStats} from '../../../utils/trkCalculate';
import {
  formatMinutesToSeconds,
  formatMinutesToTime,
} from '../../../utils/format';
import {useFocusEffect} from '@react-navigation/native';
import { ErrorNotification, SuccessNotification, WarnNotification } from "../../../utils/notification";

const TrkStartingScreen = (props: any) => {
  const [showBtn, setShowBtn] = useState(false);
  const {startLocation, stopLocation} = GeoLocation();
  const [totalTimeShowVal, setTotalTimeShowVal] = useState('00:00');
  const [totalDistanceVal, setTotalDistanceVal] = useState('0.0');
  const [totalAscentVal, setTotalAscentVal] = useState('0');
  const [totalDescentVal, setTotalDescentVal] = useState('0');
  const [kilometerSpeedsVal, setKilometerSpeedsVal] = useState<number[]>([]);
  const [currentKilometerSpeedVal, setCurrentKilometerSpeedVal] = useState('0');
  const [currentAltitudeVal, setCurrentAltitudeVal] = useState('0');
  let finalPointIsPausedVal = useRef(false);
  let timerBaseTime = useRef(0);
  let totalTimeVal = useRef(0);

  useEffect(() => {
    timerBaseTime.current = new Date().getTime();
  }, [props.trkStart.start]);

  useFocusEffect(
    React.useCallback(() => {
      let interval: any;
      if (props.trkStart.trkTimerBaseTime === 0) {
        setTotalTimeShowVal('00:00');
      } else if (props.trkStart.trkTimerBaseTime < 0) {
        setTotalTimeShowVal(
          formatMinutesToTime(
            Math.floor(props.trkStart.trkTimerBaseTime / 1000) * -1,
          ),
        );
      } else {
        interval = setInterval(() => {
          const minuteDiff = Math.ceil(
            (new Date().getTime() - props.trkStart.trkTimerBaseTime) / 1000,
          );
          setTotalTimeShowVal(formatMinutesToTime(minuteDiff));
        }, 100);
      }
      return () => {
        clearInterval(interval);
      };
    }, [props.trkStart.trkTimerBaseTime]),
  );

  useFocusEffect(
    React.useCallback(() => {
      const {
        totalDistance,
        totalTime,
        totalTimeEndTime,
        totalAscent,
        totalDescent,
        kilometerSpeeds,
        currentKilometerSpeed,
        currentAltitude,
        finalPointIsPaused,
      } = calculateTrkStats(props.trkStart.points);

      setTotalDistanceVal((totalDistance / 1000).toFixed(2));
      setTotalAscentVal(totalAscent.toFixed(0));
      setTotalDescentVal(totalDescent.toFixed(0));
      setKilometerSpeedsVal(kilometerSpeeds);
      setCurrentKilometerSpeedVal(currentKilometerSpeed.toFixed(2));
      setCurrentAltitudeVal(currentAltitude.toFixed(0));
      finalPointIsPausedVal.current = finalPointIsPaused;
      totalTimeVal.current = totalTime;
      timerBaseTime.current = new Date().getTime() - totalTime;
      console.log('ret', finalPointIsPaused, totalTimeEndTime, totalTime);
    }, [props.trkStart.points]),
  );

  const handleSheetChanges = (index: number) => {
    console.log('handleSheetChanges', index);
    setShowBtn(index === 1);
  };
  const bottomSheetRef = useRef(null);

  const pauseHandle = () => {
    if (props.trkStart.pause) {
      props.setPause(false);
      startLocation();
    } else {
      props.setPause(true);
      stopLocation();
      // 使用上个点保留一个暂停点
      const currentTrkPoint = {
        latitude: props.trkStart.currentPoint.latitude || 0,
        longitude: props.trkStart.currentPoint.longitude || 0,
        altitude: props.trkStart.currentPoint.altitude || 0,
        speed: 0,
        time: new Date().getTime(),
        pause: true,
      };
      props.addTrkPoint(currentTrkPoint);
      props.setCurrentPoint(currentTrkPoint);
    }
  };
  const stopHandle = () => {
    stopLocation();
    props.setStart(false);
    if (props.trkStart.points.length < 5) {
      WarnNotification('本次记录时间太短，记录无效', '');
      return;
    }
    props
      .asyncAddFromRecord({
        ...props.trkStart,
        ...{endTime: new Date().toISOString()},
      })
      .then(() => {
        SuccessNotification('记录已保存');
      })
      .catch((e: {message: any}) => {
        ErrorNotification('记录保存失败', e.message || '未知错误');
      });
    props.setTrkPoints([]);
  };

  const animationConfigs = useBottomSheetTimingConfigs({
    duration: 100,
    easing: Easing.exp,
  });

  return (
    <BottomSheet
      ref={bottomSheetRef}
      onChange={handleSheetChanges}
      animationConfigs={animationConfigs}
      handleIndicatorStyle={{
        backgroundColor: 'rgba(193,192,192,0.32)',
      }}
      backgroundStyle={{
        backgroundColor: '#fff',
      }}
      snapPoints={['18%', '30%']}>
      <BottomSheetView>
        <View style={styles.startItemContainer}>
          <View style={styles.startItemRow}>
            <View style={styles.startItemColumnLeft}>
              <Text style={styles.startItemValue}>
                {totalTimeShowVal}
                <Text style={styles.startItemUnit} />
              </Text>
              <Text style={styles.startItemLabel}>时间</Text>
            </View>
            <View style={styles.startItemColumn}>
              <Text style={styles.startItemValue}>
                {totalDistanceVal}
                <Text style={styles.startItemUnit}> km</Text>
              </Text>
              <Text style={styles.startItemLabel}>距离</Text>
            </View>
            <View style={styles.startItemColumnRight}>
              <Text style={styles.startItemValue}>
                {totalAscentVal}
                <Text style={styles.startItemUnit}> m</Text>
              </Text>
              <Text style={styles.startItemLabel}>爬升</Text>
            </View>
          </View>
          <View style={styles.startItemRow}>
            <View style={styles.startItemColumnLeft}>
              <Text style={styles.startItemValue}>
                {currentAltitudeVal}
                <Text style={styles.startItemUnit}> m</Text>
              </Text>
              <Text style={styles.startItemLabel}>海拔</Text>
            </View>
            <View style={styles.startItemColumn}>
              <Text style={styles.startItemValue}>
                {currentKilometerSpeedVal}
                <Text style={styles.startItemUnit}> kph</Text>
              </Text>
              <Text style={styles.startItemLabel}>速度</Text>
            </View>
            <View style={styles.startItemColumnRight}>
              <Text style={styles.startItemValue}>
                {totalDescentVal}
                <Text style={styles.startItemUnit}> m</Text>
              </Text>
              <Text style={styles.startItemLabel}>下降</Text>
            </View>
          </View>
        </View>
        {showBtn ? (
          <View style={styles.bottomBtnLine}>
            <TouchableOpacity
              style={[styles.startItemOpBtn, styles.startItemOpBtnBgPause]}
              onPress={pauseHandle}>
              <Text
                style={
                  props.trkStart.pause
                    ? styles.startButtonTextColor
                    : styles.startButtonText
                }>
                {props.trkStart.pause ? '继续' : '暂停'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.startItemOpBtn, styles.startItemOpBtnBgEnd]}
              onPress={stopHandle}>
              <Text style={styles.startButtonText}>{'结束'}</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </BottomSheetView>
    </BottomSheet>
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
  startItemContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#fff',
    paddingBottom: 10,
    borderRadius: 20,
  },
  startItemRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    paddingTop: 10,
  },
  startItemColumn: {
    width: '30%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 10,
  },
  startItemColumnRight: {
    width: '20%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  startItemColumnLeft: {
    width: '30%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 30,
  },

  startItemValue: {
    color: '#000000',
    fontSize: 32,
    fontWeight: '500',
  },
  startItemUnit: {
    color: '#696969',
    fontSize: 14,
    fontWeight: '400',
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
    marginHorizontal: 30,
  },
  startItemOpBtnBgPause: {
    backgroundColor: '#000',
  },
  startItemOpBtnBgEnd: {
    backgroundColor: '#000',
  },
  bottomBtnLine: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingTop: 30,
    paddingBottom: 10,
  },
  startButtonText: {
    color: 'white',
    fontSize: 20,
  },

  startButtonTextColor: {
    // color: '#626c2c',
    color: '#b5c654',
    fontSize: 20,
  },
});

const stateToProps = (state: any) => {
  return {
    trkStart: state.trkStart,
  };
};

const dispatchToProps = dispatch => ({
  setStart: (payload: any) => dispatch.trkStart.setStart(payload),
  setPause: (payload: any) => dispatch.trkStart.setPause(payload),
  setTrkPoints: (payload: any) => dispatch.trkStart.setTrkPoints(payload),
  addTrkPoint: (payload: any) => dispatch.trkStart.addTrkPoint(payload),
  setCurrentPoint: (payload: any) => dispatch.trkStart.setCurrentPoint(payload),
  asyncAddFromRecord: (payload: any) =>
    dispatch.recordList.asyncAddFromRecord(payload),
});

export default connect(stateToProps, dispatchToProps)(TrkStartingScreen);
