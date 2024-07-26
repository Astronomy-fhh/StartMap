import {AMapSdk, MapType, MapView, Polyline} from 'react-native-amap3d';
import React, {useEffect, useRef, useState} from 'react';
import {PermissionsAndroid, Platform, StyleSheet, View} from 'react-native';

const TestPolylinePoints = [
  {latitude: 40.006901, longitude: 116.097972},
  {latitude: 40.006901, longitude: 116.597},
  {latitude: 40.106901, longitude: 116.597},
  {latitude: 40.106901, longitude: 116.097972},
  {latitude: 40.006901, longitude: 116.097972},
];

interface Props {}

const TrkMapScreen = (props: Props) => {
  const mapViewRef = useRef(null);
  const [currentMapType, setCurrentMapType] = useState(MapType.Standard);
  const [polylinePoints, setPolylinePoints] = useState(TestPolylinePoints);
  const [polylineColor, setPolylineColor] = useState('#c146ea');

  useEffect(() => {
    AMapSdk.init(
      Platform.select({
        android: 'e9566e6d7e8008a27d40d3e93cba6d67',
        ios: '186d3464209b74effa4d8391f441f14d',
      }),
    );
    const initPermissions = async () => {
      if (Platform.OS === 'android') {
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        ]);
      }
    };
    initPermissions();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapViewRef}
        style={styles.map}
        mapType={currentMapType}
        distanceFilter={10}
        headingFilter={30}
        myLocationButtonEnabled={true}
        myLocationEnabled={true}>
        <Polyline width={3} color={polylineColor} points={polylinePoints} />
      </MapView>
    </View>
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
});

export default TrkMapScreen;
