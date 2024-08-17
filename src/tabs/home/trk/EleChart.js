import React, {useEffect, useRef, useState} from 'react';
import {PanResponder, Dimensions, View} from 'react-native';
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
import { formatTimeToHHMM } from "../../../utils/format";

const EleChart = props => {
  const apx = (size = 0) => {
    let width = Dimensions.get('window').width;
    return (width / 750) * size;
  };

  const [data, setData] = useState([]);
  const size = useRef(data.length);

  const [eleData, setEleData] = useState([]);

  const maxEle = useRef(0);
  const minEle = useRef(0);

  useEffect(() => {
    console.log(props.trk.points.length);
    if (props.trk && props.trk.points) {
      const tmpEleData = [];
      const tmpData = [];
      let tmpMaxEle = 0;
      const rate = Math.ceil(props.trk.points.length / 100);
      for (const pointIndex in props.trk.points) {
        if (
          pointIndex !== 0 &&
          pointIndex % rate !== 0 &&
          pointIndex !== props.trk.points.length - 1
        ) {
          continue;
        }
        const point = props.trk.points[pointIndex];
        tmpEleData.push(point.altitude);
        tmpData.push({
          time: point.time,
          ele: point.altitude,
        });
        if (point.altitude > tmpMaxEle) {
          tmpMaxEle = point.altitude;
        }
        if (point.altitude < minEle.current) {
          minEle.current = point.altitude;
        }
      }
      setData(tmpData);
      setEleData(tmpEleData);
      maxEle.current = tmpMaxEle;
      size.current = tmpData.length;
    }
  }, [props.trk.points]);

  const [positionX, setPositionX] = useState(-1);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: evt => {
        updatePosition(evt.nativeEvent.locationX);
        return true;
      },
      onPanResponderMove: evt => {
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
      {data.map((_, index) => (
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
      strokeWidth={apx(2)}
      fill="none"
    />
  );

  const CustomText = ({x, y}) => {
    return (
      <G>
        <SvgText
          x={x(0)}
          y={y(maxEle.current) + apx(5)}
          fontSize={apx(20)}
          fill="#617485"
          textAnchor={'start'}>
          {`海拔变化`}
        </SvgText>
        <SvgText
          x={x(data.length - 1)}
          y={y(maxEle.current) + apx(0)}
          fontSize={apx(18)}
          fill="#617485"
          textAnchor={'end'}>
          {`${maxEle.current.toFixed(0)}m`}
        </SvgText>
        <SvgText
          x={x(data.length - 1)}
          y={y(minEle.current) + apx(0)}
          fontSize={apx(18)}
          fill="#617485"
          textAnchor={'end'}>
          {`${minEle.current.toFixed(0)}m`}
        </SvgText>
      </G>
    );
  };

  const CustomGradient = () => (
    <Defs key="gradient">
      <LinearGradient id="gradient" x1="0" y="0%" x2="0%" y2="100%">
        <Stop offset="0%" stopColor="#FEBE18" stopOpacity={0.2} />
        <Stop offset="100%" stopColor="#FEBE18" stopOpacity={0.02} />
      </LinearGradient>
    </Defs>
  );

  const Tooltip = ({x, y, ticks}) => {
    if (positionX < 0) {
      return null;
    }

    const {time, ele} = data[positionX];
    const timeString = formatTimeToHHMM(time);

    return (
      <G x={x(positionX)} key="tooltip">
        <G
          x={positionX > size.current / 2 ? -apx(300 + 10) : apx(10)}
          y={y(ele) - apx(10)}>
          <Rect
            y={-apx(24 + 24 + 20) / 2}
            rx={apx(12)}
            ry={apx(12)}
            width={apx(130)}
            height={apx(96)}
            stroke="rgba(254, 190, 24, 0.27)"
            fill="rgba(255, 255, 255, 0.8)"
          />
          <SvgText x={apx(20)} y={apx(18 + 20)} fill="#617485" opacity={0.65} fontSize={apx(18)}>
            {timeString}
          </SvgText>
          <SvgText
            x={apx(20)}
            fontSize={apx(18)}
            fontWeight="bold"
            fill="rgba(224, 188, 136, 1)">
            {ele.toFixed(0)} m
          </SvgText>
        </G>
        <G x={x}>
          <Line
            y1={ticks[0]}
            y2={ticks[Number(ticks.length - 1)]}
            stroke="#FEBE18"
            strokeWidth={apx(4)}
            strokeDasharray={[6, 3]}
          />
          <Circle
            cy={y(ele)}
            r={apx(20 / 2)}
            stroke="#fff"
            strokeWidth={apx(2)}
            fill="#FEBE18"
          />
        </G>
      </G>
    );
  };

  const verticalContentInset = {top: apx(20), bottom: apx(40)};

  return (
    <View style={{backgroundColor: '#fff', alignItems: 'stretch'}}>
      <View
        style={{
          flexDirection: 'row',
          width: apx(750),
          height: apx(280),
          alignSelf: 'stretch',
          paddingHorizontal: 15,
        }}>
        <View style={{flex: 1}} {...panResponder.current.panHandlers}>
          <AreaChart
            style={{flex: 1}}
            data={data.map(d => d.ele)}
            curve={shape.curveMonotoneX}
            contentInset={{...verticalContentInset}}
            svg={{fill: 'url(#gradient)'}}>
            <CustomLine />
            <CustomGradient />
            <Tooltip />
            <CustomText />
          </AreaChart>
        </View>
        {/*<YAxis*/}
        {/*  style={{width: apx(90)}}*/}
        {/*  data={eleData}*/}
        {/*  min={mimEle.current}*/}
        {/*  max={maxEle.current}*/}
        {/*  numberOfTicks={1}*/}
        {/*  formatLabel={value => `${value}m`}*/}
        {/*  contentInset={verticalContentInset}*/}
        {/*  svg={{fontSize: apx(18), fill: '#617485'}}*/}
        {/*/>*/}
      </View>
      <XAxis
        style={{alignSelf: 'stretch', width: apx(750), height: apx(60)}}
        data={data}
        formatLabel={(value, index) => {
          if (
            index === 0 ||
            index === data.length - 1 ||
            index === Math.floor(data.length / 2)
          ) {
            return formatTimeToHHMM(data[index].time);
          } else {
            return '';
          }
        }}
        contentInset={{left: apx(50), right: apx(130)}}
        svg={{fontSize: apx(18), fill: '#617485', y: apx(20)}}
      />
    </View>
  );
};

export default EleChart;
