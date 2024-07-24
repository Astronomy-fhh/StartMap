import {init} from '@rematch/core';
import createPersistPlugin, {getPersistor} from '@rematch/persist';
import createLoadingPlugin from '@rematch/loading';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {models} from '../models';

// Create plugins
const persistPlugin = createPersistPlugin({
  key: 'root',
  storage: AsyncStorage,
  blacklist: [],
});
const loadingPlugin = createLoadingPlugin({});

const localStore = () => {
  const store = init({
    models,
    redux: {
      middlewares: [],
    },
    plugins: [persistPlugin, loadingPlugin],
  });

  const local = getPersistor();

  return {local, store};
};

export default localStore;
