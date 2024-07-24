import { MapType } from "react-native-amap3d";

export const mapModel = {
  state: {
    initialCameraPosition: {
      target: {
        latitude: 39.91095,
        longitude: 116.37296,
      },
      zoom: 14,
    },
    mapType: MapType.Standard,
  }, // 初始状态
  reducers: {
    updateCameraPosition(state, payload) {
      console.log('更新位置', payload);
      return {
        ...state,
        initialCameraPosition: payload,
      };
    },
    updateMapType(state, payload) {
      return {
        ...state,
        mapType: payload,
      };
    },
  },
};
