import React, {useRef, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import Svg, {Polyline} from 'react-native-svg';
import ViewShot, {captureRef} from 'react-native-view-shot';

const generateTrackImage = async coordinates => {
  const getPolylinePoints = () => {
    return coordinates
      .map(coord => `${coord.longitude},${coord.latitude}`)
      .join(' ');
  };

  const TrackView = () => (
    <View style={styles.container}>
      <Svg height="300" width="300" viewBox="0 0 100 100">
        <Polyline
          points={getPolylinePoints()}
          fill="none"
          stroke="blue"
          strokeWidth="1"
        />
      </Svg>
    </View>
  );

  // Create a reference to the TrackView component
  const viewShotRef = useRef(null);

  const RenderTrackView = () => (
    <ViewShot ref={viewShotRef} options={{format: 'png', quality: 1.0}}>
      <TrackView />
    </ViewShot>
  );

  // Render the TrackView component and capture its content
  const binaryData = await new Promise(resolve => {
    const onCapture = async () => {
      const uri = await captureRef(viewShotRef.current, {
        format: 'png',
        quality: 1.0,
      });
      const response = await fetch(uri);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        const binaryString = reader.result;
        resolve(binaryString);
      };
      reader.readAsBinaryString(blob);
    };

    // Manually render the view and capture it
    const App = () => {
      useEffect(() => {
        onCapture();
      }, []);

      return <RenderTrackView />;
    };

    // Create a temporary container to render the component
    const {AppRegistry} = require('react-native');
    AppRegistry.registerComponent('TempApp', () => App);
    AppRegistry.runApplication('TempApp', {
      initialProps: {},
      rootTag: document.getElementById('root'),
    });
  });

  return binaryData;
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default generateTrackImage;
