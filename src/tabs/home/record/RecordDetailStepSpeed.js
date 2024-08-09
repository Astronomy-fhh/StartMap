import React from 'react';
import { View } from 'react-native';
import Svg, { Rect, G, Text } from 'react-native-svg';

const RecordDetailStepSpeed = () => {
  const data = [3.4, 4.2, 2.1, 5.2, 3.5, 4.1, 3.9, 4.3, 4.5, 4.7, 5.3,3.4, 4.2, 2.1, 5.2, 3.5, 4.1, 3.9, 4.3, 4.5, 4.7, 5.2]; // 模拟数据
  const barWidth = 16; // 条形高度
  const barSpacing = 8; // 条形间距
  const chartHeight = data.length * (barWidth + barSpacing);
  const chartWidth = 300;
  const maxDataValue = Math.max(...data);
  const rx = 6;
  const ry = 6;
  const barColor = 'rgba(25,24,24,0.8)';
  const offset = 22; // 整体偏移量
  const unitColor = '#555555';

  return (
    <View
      style={{
        flexDirection: 'column',
        paddingVertical: 20,
        flex: 1,
      }}>
      <Svg height={chartHeight + offset} width={chartWidth}>
        <G>
          {/* 画条形图 */}
          {data.map((value, index) => {
            const barHeight = barWidth;
            const barY = index * (barHeight + barSpacing) + offset; // 整体偏移
            const barLength = (value / maxDataValue) * chartWidth;

            return (
              <G key={`bar-${index}`}>
                <Rect
                  x={0}
                  y={barY}
                  width={barLength}
                  height={barHeight}
                  fill={barColor}
                  rx={rx}
                  ry={ry}
                />
                <Text
                  x={rx}
                  y={barY + barHeight / 2}
                  fontSize={10}
                  fill="white"
                  alignmentBaseline="middle"
                  textAnchor="start">
                  {index + 1}
                </Text>
                <Text
                  x={barLength - 20} // 向右偏移
                  y={barY + barHeight / 2}
                  fontSize={10}
                  fill="white"
                  alignmentBaseline="middle"
                  textAnchor="start">
                  {value}
                </Text>
              </G>
            );
          })}
          {/* 添加单位文本 */}
          <Text
            x={rx}
            y={offset - 10}
            fontSize={12}
            fill={unitColor}
            alignmentBaseline="baseline"
            textAnchor="start">
            分段
          </Text>
          <Text
            x={rx + 40}
            y={offset - 10}
            fontSize={12}
            fill={unitColor}
            alignmentBaseline="baseline"
            textAnchor="start">
            km/h
          </Text>
        </G>
      </Svg>
    </View>
  );
};

export default RecordDetailStepSpeed;
