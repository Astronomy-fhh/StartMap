import React, {useEffect, useRef, useState} from 'react';
import {PanResponder, Dimensions, Text, View} from 'react-native';
import {AreaChart, XAxis, YAxis} from 'react-native-svg-charts';
import {
  Circle,
  Defs,
  G,
  Line,
  LinearGradient,
  Path,
  Rect,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import * as shape from 'd3-shape';

const generateElevationData = numPoints => {
  let data = [0];
  for (let i = 1; i < numPoints; i++) {
    const lastValue = data[data.length - 1];
    const change = Math.floor(Math.random() * 100) - 5; // Change between -5 and 5
    data.push(Math.max(0, lastValue + change)); // Ensure elevation doesn't go negative
  }
  return data;
};

function ElevationChart() {
  const apx = (size = 0) => {
    let width = Dimensions.get('window').width;
    return (width / 750) * size;
  };

  const [dateList, setDateList] = useState([
    '15:09',
    '15:10',
    '15:11',
    '15:12',
  ]);
  const [elevationList, setElevationList] = useState(generateElevationData(50));
  const size = useRef(elevationList.length);

  const [positionX, setPositionX] = useState(-1);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderTerminationRequest: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        updatePosition(evt.nativeEvent.locationX);
        return true;
      },
      onPanResponderMove: (evt, gestureState) => {
        updatePosition(evt.nativeEvent.locationX);
        return true;
      },
      onPanResponderRelease: () => {
        setPositionX(-1);
      },
    }),
  );

  const updatePosition = x => {
    const YAxisWidth = apx(130);
    const x0 = apx(0);
    const chartWidth = apx(750) - YAxisWidth - x0;
    const xN = x0 + chartWidth;
    const xDistance = chartWidth / size.current;
    if (x <= x0) {
      x = x0;
    }
    if (x >= xN) {
      x = xN;
    }

    let value = ((x - x0) / xDistance).toFixed(0);
    if (value >= size.current - 1) {
      value = size.current - 1;
    }

    setPositionX(Number(value));
  };

  const CustomGrid = ({x, y, ticks}) => (
    <G>
      {ticks.map(tick => (
        <Line
          key={tick}
          x1="0%"
          x2="100%"
          y1={y(tick)}
          y2={y(tick)}
          stroke="#EEF3F6"
        />
      ))}
      {elevationList.map((_, index) => (
        <Line
          key={index.toString()}
          y1="0%"
          y2="100%"
          x1={x(index)}
          x2={x(index)}
          stroke="#EEF3F6"
        />
      ))}
    </G>
  );

  const CustomLine = ({line}) => (
    <Path
      key="line"
      d={line}
      stroke="#FEBE18"
      strokeWidth={apx(6)}
      fill="none"
    />
  );

  const CustomGradient = () => (
    <Defs key="gradient">
      <LinearGradient id="gradient" x1="0" y="0%" x2="0%" y2="100%">
        <Stop offset="0%" stopColor="#FEBE18" stopOpacity={0.25} />
        <Stop offset="100%" stopColor="#FEBE18" stopOpacity={0.02} />
      </LinearGradient>
    </Defs>
  );

  const Tooltip = ({x, y, ticks}) => {
    if (positionX < 0) {
      return null;
    }

    const date = dateList[positionX % dateList.length];

    return (
      <G x={x(positionX)} key="tooltip">
        <G
          x={positionX > size.current / 2 ? -apx(300 + 10) : apx(10)}
          y={y(elevationList[positionX]) - apx(10)}>
          <Rect
            y={-apx(24 + 24 + 20) / 2}
            rx={apx(12)}
            ry={apx(12)}
            width={apx(200)}
            height={apx(96)}
            stroke="rgba(254, 190, 24, 0.27)"
            fill="rgba(255, 255, 255, 0.8)"
          />
          <SvgText x={apx(20)} fill="#617485" opacity={0.65} fontSize={apx(24)}>
            {date}
          </SvgText>
          <SvgText x={apx(20)} fill="#617485" opacity={0.65} fontSize={apx(24)}>
            {date}
          </SvgText>
          <SvgText
            x={apx(20)}
            y={apx(24 + 20)}
            fontSize={apx(24)}
            fontWeight="bold"
            fill="rgba(224, 188, 136, 1)">
            {elevationList[positionX]} m
          </SvgText>
        </G>
        <G x={x}>
          <Line
            y1={ticks[0]}
            y2={ticks[Number(ticks.length)]}
            stroke="#FEBE18"
            strokeWidth={apx(4)}
            strokeDasharray={[6, 3]}
          />
          <Circle
            cy={y(elevationList[positionX])}
            r={apx(20 / 2)}
            stroke="#fff"
            strokeWidth={apx(2)}
            fill="#FEBE18"
          />
        </G>
      </G>
    );
  };

  const verticalContentInset = {top: apx(40), bottom: apx(40)};

  return (
    <View
      style={{
        backgroundColor: '#fff',
        alignItems: 'stretch',
      }}>
      <View
        style={{
          flexDirection: 'row',
          width: apx(750),
          height: apx(300),
          alignSelf: 'stretch',
          paddingRight: 20,
        }}>
        <View style={{flex: 1}} {...panResponder.current.panHandlers}>
          <AreaChart
            style={{flex: 1}}
            data={elevationList}
            curve={shape.curveMonotoneX}
            contentInset={{...verticalContentInset}}
            svg={{fill: 'url(#gradient)'}}>
            <CustomLine />
            {/*<CustomGrid />*/}
            <CustomGradient />
            <Tooltip />
          </AreaChart>
        </View>
        <YAxis
          style={{width: apx(100), paddingRight: 20}}
          data={[0, 2000, 4000]} // 固定数值
          min={0}
          max={4000}
          numberOfTicks={3}
          formatLabel={value => `${value}`} // 自定义标签格式
          contentInset={verticalContentInset}
          svg={{fontSize: apx(20), fill: '#617485'}}
        />
      </View>
      <XAxis
        style={{
          alignSelf: 'stretch',
          width: apx(750),
          height: apx(60),
        }}
        numberOfTicks={7}
        data={elevationList}
        formatLabel={(value, index) =>
          (index % dateList.length) % 2 === 0
            ? dateList[index % dateList.length]
            : ''
        }
        contentInset={{
          left: apx(50),
          right: apx(130),
        }}
        svg={{
          fontSize: apx(20),
          fill: '#617485',
          y: apx(20),
        }}
      />
    </View>
  );
}

export default ElevationChart;
