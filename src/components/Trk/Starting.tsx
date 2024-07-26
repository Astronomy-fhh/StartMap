import {AMapSdk, MapType, MapView, Polyline} from 'react-native-amap3d';
import React, {useEffect, useRef, useState} from 'react';
import {
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import {connect} from 'react-redux';

const TrkStartingScreen = (props: any) => {
  console.log('TrkStartScreen', props);

  const [showBtn, setShowBtn] = useState(false);

  const handleSheetChanges = (index: number) => {
    console.log('handleSheetChanges', index);
    setShowBtn(index === 1);
  };
  const bottomSheetRef = useRef(null);

  const pauseHandle = () => {
    props.setPause(!props.trkStart.pause);
  };
  const stopHandle = () => {
    props.setStart(false);
  }

  return (
    <BottomSheet
      ref={bottomSheetRef}
      onChange={handleSheetChanges}
      snapPoints={['18%', '30%']}>
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
        {showBtn && (
          <View style={styles.bottomBtnLine}>
            <TouchableOpacity
              style={[styles.startItemOpBtn, styles.startItemOpBtnBgPause]}
              onPress={pauseHandle}>
              <Text style={styles.startButtonText}>
                {props.trkStart.pause ? '继续' : '暂停'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.startItemOpBtn, styles.startItemOpBtnBgEnd]}
              onPress={stopHandle}>
              <Text style={styles.startButtonText}>{'结束'}</Text>
            </TouchableOpacity>
          </View>
        )}
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
    marginHorizontal: 40,
  },
  startItemOpBtnBgStart: {
    backgroundColor: 'rgba(27,27,27,0.88)',
  },
  startItemOpBtnBgPause: {
    backgroundColor: 'rgba(27,27,27,0.88)',
  },
  startItemOpBtnBgEnd: {
    backgroundColor: 'rgba(27,27,27,0.88)',
  },
  bottomBtnLine: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingTop: 20,
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

const stateToProps = (state: any) => {
  return {
    trkStart: state.trkStart,
  };
};

const dispatchToProps = dispatch => ({
  addTrkPoints: (payload: any) => dispatch.trkStart.addTrkPoints(payload),
  setStart: (payload: any) => dispatch.trkStart.setStart(payload),
  setPause: (payload: any) => dispatch.trkStart.setPause(payload),
});

export default connect(stateToProps, dispatchToProps)(TrkStartingScreen);
