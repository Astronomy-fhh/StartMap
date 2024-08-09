import React, {useState} from 'react';
import {View, Button, StyleSheet} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import {DOMParser} from 'xmldom';
import xpath from 'xpath';
import {connect} from 'react-redux';
import {parseGPXFromXML} from '../utils/gpx';
import moment from 'moment';
import { TrkFromImport, TrkFromRecord } from "../models/trkList/trkList";

// 定义GPX结构体
const gpxData = {
  totalTime: 0,
  cumulativeDecrease: 0,
  cumulativeClimb: 0,
  totalDistance: 0,
  trackPoints: [],
};

const ImportGpx = props => {
  const handleFilePicker = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      const fileUri = res[0].uri;

      const gpxContent = await RNFS.readFile(fileUri, 'utf8');
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(gpxContent, 'application/xml');
      console.log('Parsed XML Document:', xmlDoc);

      const gpxData = parseGPXFromXML(gpxContent);
      console.log('useTime:', gpxData.useTime);
      console.log('ascent:', gpxData.ascent);
      console.log('descent:', gpxData.descent);
      console.log('distance:', gpxData.distance);
      gpxData.points.forEach((point, index) => {
        console.log(
          `Point ${index + 1}: lat=${point.lat}, lon=${point.lon}, ele=${
            point.ele
          }, time=${point.time}`,
        );
      });
      gpxData.title = '外部导入的轨迹' + moment().format('YYYYMMDDHHmm');
      gpxData.from = TrkFromImport;
      props
        .asyncAddFromImport(gpxData)
        .then(r => {
          console.log('add trk success:');
        })
        .catch(e => {
          console.log('add trk failed:', e);
        });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the picker');
      } else {
        console.log('Unknown error: ', err);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Button title="import GPX" onPress={handleFilePicker} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});

const stateToProps = state => {
  return {
    // trkStart: state.trkStart,
  };
};

const dispatchToProps = dispatch => ({
  asyncAddFromImport: payload => dispatch.trkList.asyncAddFromImport(payload),
});

export default connect(stateToProps, dispatchToProps)(ImportGpx);
