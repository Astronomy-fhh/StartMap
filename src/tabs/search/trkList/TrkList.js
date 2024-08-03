import React, {useState, useCallback, useEffect} from 'react';
import { FlatList, Text, View, RefreshControl, StyleSheet, TouchableOpacity, Image } from "react-native";
import {connect} from 'react-redux';
import moment from 'moment';
import { formatMinutesToTime } from "../../../utils/format";

const TrkList = props => {
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const uri =
    'https://gd-hbimg.huaban.com/d478a9c4bd0167adae79806c6ccaa2d7f59ded5dd101-WmmTdI_fw1200webp';

  useEffect(() => {
    onRefresh();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    props
      .getTrkList()
      .then(newData => {
        console.log('newData:', newData);
        setData(newData);
        setRefreshing(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setRefreshing(false);
      });
  }, [props]);

  return (
    <View style={styles.container}>
      <FlatList
        style={{width: '100%'}}
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <TouchableOpacity>
            <View style={styles.item}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                  paddingLeft: 10,
                  paddingRight: 10,
                }}>
                <Text style={{fontSize: 12, color: '#000'}}>
                  {item.country} {item.city}
                </Text>
                <Text style={{fontSize: 12, color: '#000'}}>
                  {moment(item.startTime).format('YYYY-MM-DD HH:mm')}
                </Text>
              </View>
              {/*<View*/}
              {/*  style={{*/}
              {/*    flexDirection: 'row',*/}
              {/*    justifyContent: 'space-between',*/}
              {/*    width: '100%',*/}
              {/*    paddingLeft: 10,*/}
              {/*    paddingRight: 10,*/}
              {/*  }}>*/}
              {/*  <Text style={{fontSize: 15, color: '#000'}}>*/}
              {/*    {item.title}*/}
              {/*  </Text>*/}
              {/*</View>*/}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                  paddingLeft: 10,
                  paddingRight: 10,
                  paddingBottom: 5,
                }}>
                <View
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                  }}>
                  <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                    <Text
                      style={{fontSize: 22, color: '#000', fontWeight: '700'}}>
                      {item.distance.toFixed(2)}
                    </Text>
                    <Text style={{fontSize: 18, color: '#000', paddingLeft: 5}}>
                      km
                    </Text>
                  </View>
                  <Text style={{fontSize: 14, color: '#000'}}>总距离</Text>
                </View>

                <View
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                  }}>
                  <Text style={{fontSize: 22, color: '#000', fontWeight: '700'}}>
                    {formatMinutesToTime(item.useTime.toFixed(0))}
                  </Text>
                  <Text style={{fontSize: 14, color: '#000'}}>用时</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                  }}>
                  <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                    <Text style={{fontSize: 22, color: '#000', fontWeight: '700'}}>
                      {item.ascent.toFixed(0)}
                    </Text>
                    <Text style={{fontSize: 18, color: '#000', paddingLeft: 5}}>
                      m
                    </Text>
                  </View>
                  <Text style={{fontSize: 14, color: '#000'}}>爬升</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                  }}>
                  <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                    <Text style={{fontSize: 22, color: '#000', fontWeight: '700'}}>
                      {item.descent.toFixed(0)}
                    </Text>
                    <Text style={{fontSize: 18, color: '#000', paddingLeft: 5}}>
                      m
                    </Text>
                  </View>
                  <Text style={{fontSize: 14, color: '#000'}}>下降</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
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
  },
  item: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    height: 130,
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 10,
    borderColor: 'gray',
    borderWidth: 1,
    paddingTop: 10,
  },
});

const stateToProps = state => {
  return {
    recordList : state.recordList,
  };
};

const dispatchToProps = dispatch => ({
  getTrkList: payload => dispatch.recordList.getList(payload),
});

export default connect(stateToProps, dispatchToProps)(TrkList);
