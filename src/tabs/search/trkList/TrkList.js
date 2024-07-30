import React, {useState, useCallback, useEffect} from 'react';
import {FlatList, Text, View, RefreshControl, StyleSheet} from 'react-native';
import {connect} from 'react-redux';

const TrkList = props => {
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    onRefresh();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    props
      .getTrkList()
      .then(newData => {
        console.log('newData:', newData);
        setData([...data, ...newData]);
        setRefreshing(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setRefreshing(false);
      });
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        style={{width: '100%'}}
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <View style={styles.item}>
            <Text style={styles.startTime}>{new Date(item.startTime).toLocaleString()}</Text>
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
  },
  item: {
    height: 180,
    marginHorizontal: 30,
    backgroundColor: 'black',
    marginVertical: 10,
    borderRadius: 20,
  },
  startTime: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    paddingVertical: 10,
  },
});

const stateToProps = state => {
  return {};
};

const dispatchToProps = dispatch => ({
  getTrkList: payload => dispatch.recordList.getList(payload),
});

export default connect(stateToProps, dispatchToProps)(TrkList);
