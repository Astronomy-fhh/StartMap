import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Route from './routes/index';
import localStore from './store';
import Loading from './components/UI/Loading';
import {PersistGate} from 'redux-persist/es/integration/react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import FloatingDebugButton from './debug/debug';
import {StatusBar} from 'react-native';
import {NotifierWrapper} from 'react-native-notifier';
import {PaperProvider} from 'react-native-paper';

class StartMap extends React.Component {
  constructor() {
    super();
    this.state = {loading: true};
  }

  async componentDidMount() {
    this.setState({loading: false});
  }

  render() {
    const {loading} = this.state;
    const {local, store} = localStore();

    if (loading) {
      return <Loading />;
    }
    return (
      <SafeAreaProvider>
        <Provider store={store}>
          <PersistGate loading={<Loading />} persistor={local}>
            <GestureHandlerRootView>
              <NotifierWrapper>
                <PaperProvider>
                  {/*<StatusBar barStyle="light-content" backgroundColor="#fff" />*/}
                  <FloatingDebugButton />
                  <Route />
                </PaperProvider>
              </NotifierWrapper>
            </GestureHandlerRootView>
          </PersistGate>
        </Provider>
      </SafeAreaProvider>
    );
  }
}

export default StartMap;
