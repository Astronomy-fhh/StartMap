import React, {useState, useCallback, useEffect} from 'react';
import {
  FlatList,
  Text,
  View,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import {connect} from 'react-redux';
import moment from 'moment';
import {formatMinutesToTime} from '../../../utils/format';
import {useNavigation} from "@react-navigation/native";
import {TrkFromNames } from "../../../models/trkList/trkList";

const RecordList = props => {
  const navigation = useNavigation();

  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const uri =
    'https://gd-hbimg.huaban.com/d478a9c4bd0167adae79806c6ccaa2d7f59ded5dd101-WmmTdI_fw1200webp';

  useEffect(() => {
    onRefresh();
  }, [props]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    props
      .getRecordList()
      .then(newData => {
        setData(newData);
        for (const newDatum of newData) {
          console.log(newDatum.startTime, newDatum.endTime, newDatum.useTime);
        }
        setRefreshing(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setRefreshing(false);
      });
  }, []);

  const toRecordDetail = item => {
    navigation.navigate('RecordDetail', {record: item});
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={{width: '100%'}}
        data={data}
        keyExtractor={(item, index) => item.id.toString()}
        renderItem={({item}) => (
          <View>
            <TouchableOpacity
              onPress={() => {
                toRecordDetail(item);
              }}>
              <View style={styles.item}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '100%',
                    paddingLeft: 10,
                    paddingRight: 10,
                    paddingTop: 5,
                  }}>
                  <Text style={{fontSize: 14, color: '#000'}}>
                    {moment(item.startTime).format('YYYY年MM月DD日 HH:mm') +
                      '-' +
                      moment(item.endTime).format('HH:mm')}
                  </Text>
                  {/*<Text style={{fontSize: 14, color: '#000', paddingLeft: 30}}>*/}
                  {/*  {TrkFromNames[item.from] || ''}*/}
                  {/*</Text>*/}
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    width: '100%',
                    paddingLeft: 10,
                    paddingRight: 10,
                  }}>
                  <Text style={{fontSize: 12, color: '#575757'}}>
                    {item.title || ''}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    width: '100%',
                    paddingLeft: 10,
                    paddingRight: 10,
                    paddingBottom: 10,
                  }}>
                  <View
                    style={{
                      flexDirection: 'column',
                      justifyContent: 'flex-start',
                    }}>
                    <Text style={{fontSize: 14, color: '#575757'}}>距离</Text>
                    <View
                      style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                      <Text
                        style={{
                          fontSize: 15,
                          color: '#000',
                          fontWeight: '700',
                        }}>
                        {(item.distance / 1000).toFixed(2)}
                      </Text>
                      <Text
                        style={{fontSize: 15, color: '#000', paddingLeft: 5}}>
                        km
                      </Text>
                    </View>
                  </View>

                  <View style={styles.separator} />

                  <View
                    style={{
                      flexDirection: 'column',
                      justifyContent: 'flex-start',
                    }}>
                    <Text style={{fontSize: 14, color: '#575757'}}>用时</Text>
                    <View
                      style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                      <Text
                        style={{
                          fontSize: 15,
                          color: '#000',
                          fontWeight: '700',
                        }}>
                        {formatMinutesToTime((item.useTime / 1000).toFixed(0))}
                      </Text>
                      <Text
                        style={{
                          fontSize: 15,
                          color: '#000',
                          paddingLeft: 5,
                        }}
                      />
                    </View>
                  </View>
                  <View style={styles.separator} />

                  <View
                    style={{
                      flexDirection: 'column',
                      justifyContent: 'flex-start',
                    }}>
                    <Text style={{fontSize: 14, color: '#575757'}}>总用时</Text>
                    <View
                      style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                      <Text
                        style={{
                          fontSize: 15,
                          color: '#000',
                          fontWeight: '700',
                        }}>
                        {formatMinutesToTime(
                          (
                            (new Date(item.endTime).getTime() -
                              new Date(item.startTime).getTime()) /
                            1000
                          ).toFixed(0),
                        )}
                      </Text>
                      <Text
                        style={{
                          fontSize: 15,
                          color: '#000',
                          paddingLeft: 5,
                        }}
                      />
                    </View>
                  </View>
                  <View style={styles.separator} />

                  <View
                    style={{
                      flexDirection: 'column',
                      justifyContent: 'flex-start',
                    }}>
                    <Text style={{fontSize: 14, color: '#575757'}}>爬升</Text>
                    <View
                      style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                      <Text
                        style={{
                          fontSize: 15,
                          color: '#000',
                          fontWeight: '700',
                        }}>
                        {item.ascent.toFixed(0)}
                      </Text>
                      <Text
                        style={{fontSize: 15, color: '#000', paddingLeft: 5}}>
                        m
                      </Text>
                    </View>
                  </View>
                  <View style={styles.separator} />

                  <View
                    style={{
                      flexDirection: 'column',
                      justifyContent: 'flex-start',
                    }}>
                    <Text style={{fontSize: 14, color: '#575757'}}>下降</Text>
                    <View
                      style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                      <Text
                        style={{
                          fontSize: 15,
                          color: '#000',
                          fontWeight: '700',
                        }}>
                        {item.descent.toFixed(0)}
                      </Text>
                      <Text
                        style={{fontSize: 15, color: '#000', paddingLeft: 5}}>
                        m
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
            <View style={styles.separator2} />
          </View>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#b3c63f"
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    paddingTop: 20,
    backgroundColor: '#fff',
  },
  item: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    height: 110,
    marginHorizontal: 20,
    marginVertical: 10,
    paddingTop: 5,
    borderRadius: 10,
    // borderWidth: 1,
    borderColor: '#757575',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    backgroundColor: '#ececec',
  },
  separator: {
    width: 1,
    backgroundColor: '#cdcdcd',
    marginHorizontal: 18,
    marginVertical: 3,
  },
  separator2: {
    height: 1,
    backgroundColor: '#cdcdcd',
    marginHorizontal: 20,
    marginVertical: 3,
  },
});

const stateToProps = state => {
  return {
    trkList: state.trkList,
  };
};

const dispatchToProps = dispatch => ({
  getRecordList: payload => dispatch.recordList.getList(payload),
});

export default connect(stateToProps, dispatchToProps)(RecordList);
