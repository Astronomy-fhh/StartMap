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

const TrkStartScreen = (props: any) => {
  console.log('TrkStartScreen', props);

  const handleSheetChanges = (index: number) => {
    console.log('handleSheetChanges', index);
  };
  const bottomSheetRef = useRef(null);

  const startHandle = () => {
    props.setStart(true);
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      onChange={handleSheetChanges}
      snapPoints={['16%']}>
      <BottomSheetView>
        <View style={styles.bottomBtnLine}>
          <TouchableOpacity
            style={[styles.startItemOpBtn, styles.startItemOpBtnBgStart]}
            onPress={startHandle}>
            <Text style={styles.startButtonText}>开始</Text>
          </TouchableOpacity>
        </View>
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
    marginHorizontal: 20,
  },
  startItemOpBtnBgStart: {
    backgroundColor: 'rgba(27,27,27,0.88)',
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
  bottomBtnLine: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
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

export default connect(stateToProps, dispatchToProps)(TrkStartScreen);
