import { StyleSheet, View } from 'react-native';

const LocationMarker = (props: any) => {
  return (
    <View style={styles.locationMarker}>
      <View style={styles.locationMarkerInner} />
      {/*<View*/}
      {/*  style={[*/}
      {/*    styles.triangle,*/}
      {/*    {*/}
      {/*      transform: [{ rotate: `${props.directionAngle || 0}deg` }],*/}
      {/*    },*/}
      {/*  ]}*/}
      {/*>*/}
      {/*  <View style={styles.triangleTop} />*/}
      {/*  <View style={styles.triangleBottom} />*/}
      {/*</View>*/}
    </View>
  );
};

const styles = StyleSheet.create({
  locationMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative', // Ensure relative positioning for child absolute positioning
  },
  locationMarkerInner: {
    zIndex: 21,
    width: 14,
    height: 14,
    backgroundColor: '#b5c654',
    borderRadius: 7,
  },
  triangle: {
    position: 'absolute',
    zIndex: 20,
    width: 14,
    height: 50,
  },
  triangleBottom: {
    width: 16,
    height: 25,
    backgroundColor: 'transparent',
  },
  triangleTop: {
    width: 14,
    height: 25,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderBottomWidth: 16,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#66702e',
  },
});

export default LocationMarker;
