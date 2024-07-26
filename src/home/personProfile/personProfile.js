import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {Provider as PaperProvider, Card} from 'react-native-paper';

const initialLayout = {width: Dimensions.get('window').width};

const uri = 'https://gd-hbimg.huaban.com/d478a9c4bd0167adae79806c6ccaa2d7f59ded5dd101-WmmTdI_fw1200webp';
const mapUri = 'https://img.88icon.com/download/jpg/20200803/bd9c05b3ca77f8a8e319521a5ac7f97b_512_512.jpg!bg';

const listData = [
  {
    id: '1',
  },
  {
    id: '2',
  },
  {
    id: '3',
  },
  {
    id: '4',
  },
  {
    id: '5',
  },
  {
    id: '6',
  },
  {
    id: '7',
  },
  {
    id: '8',
  },
  {
    id: '9',
  },
  {
    id: '10',
  },
  {
    id: '11',
  },
  {
    id: '12',
  },
];

const renderCard = ({item}) => (
  <Card style={{marginTop: 20}}>
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        padding: 10,
        justifyContent: 'flex-start',
      }}>
      <View
        style={{
          borderStyle: 'solid',
          borderWidth: 1,
          borderColor: 'black',
          borderRadius: 10,
        }}>
        <Image
          source={{uri: mapUri}}
          style={{width: 100, height: 100, borderRadius: 10}}
        />
      </View>

      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          paddingLeft: 30,
          justifyContent: 'space-around',
          paddingTop: 10,
        }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            paddingLeft: 0,
            justifyContent: 'space-around',
          }}>
          <View>
            <Text style={{color: 'black', fontSize: 18}}>5KM</Text>
            <Text style={{color: 'black', fontSize: 14}}>里程</Text>
          </View>
          <View>
            <Text style={{color: 'black', fontSize: 18}}>1200m</Text>
            <Text style={{color: 'black', fontSize: 14}}>累计爬升</Text>
          </View>
          <View>
            <Text style={{color: 'black', fontSize: 18}}>5.2h</Text>
            <Text style={{color: 'black', fontSize: 14}}>时间</Text>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            paddingLeft: 100,
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <View>
            <Text style={{color: 'black', fontSize: 18}}>5</Text>
            <Text style={{color: 'black', fontSize: 14}}>难度</Text>
          </View>
          <View>
            <Text style={{color: 'black', fontSize: 18}}>1.2w</Text>
            <Text style={{color: 'black', fontSize: 14}}>Star</Text>
          </View>
        </View>
      </View>
    </View>
  </Card>
);

const FirstRoute = () => (
  <FlatList
    data={listData}
    renderItem={renderCard}
    keyExtractor={item => item.id}
    contentContainerStyle={styles.list}
  />
);

const SecondRoute = () => <Text>111</Text>;

const PersonalProfile = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'first', title: '记录'},
    {key: 'second', title: '轨迹'},
    {key: 'fourth', title: '探索轨迹'},
  ]);

  const CustomTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={styles.indicator}
      style={styles.tabBar}
      labelStyle={styles.label}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.head}>
        <Image source={{uri}} style={styles.avatar} />
        <View>
          <Text style={styles.name}>你猜我是谁</Text>
          <Text style={styles.ip}>ip属地：北京</Text>
        </View>
        <View>
          <Text style={styles.followNum}>1233</Text>
          <Text style={styles.followType}>关注</Text>
        </View>
        <View>
          <Text style={styles.followNum}>1233</Text>
          <Text style={styles.followType}>粉丝</Text>
        </View>
      </View>

      <TabView
        navigationState={{index, routes}}
        renderScene={SceneMap({
          first: FirstRoute,
          second: SecondRoute,
          third: SecondRoute,
          fourth: SecondRoute,
        })}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        style={styles.tabView}
        renderTabBar={props => <CustomTabBar {...props} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#bf6a6a',
    width: '100%',
    height: '100%',
  },
  head: {
    backgroundColor: '#d9cee6',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingBottom: 20,
    paddingTop: 20,
  },
  avatar: {
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#fff',
    width: 60,
    height: 60,
  },
  name: {
    fontSize: 24,
    color: '#3c3232',
    paddingBottom: 5,
  },
  ip: {
    fontSize: 12,
    color: '#000',
  },
  followNum: {
    fontSize: 18,
    color: '#000',
  },
  followType: {
    fontSize: 12,
    color: '#000',
  },
  tabView: {
    backgroundColor: '#fff',
  },
  card: {
    marginTop: 10,
  },
  tabBar: {
    backgroundColor: '#6200ee', // Tab bar background color
  },
  indicator: {
    backgroundColor: '#ffffff', // Indicator color
  },
  label: {
    color: '#ffffff', // Label color
  },
});

export default PersonalProfile;
