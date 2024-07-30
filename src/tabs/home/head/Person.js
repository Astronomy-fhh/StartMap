import {Image, Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import React from 'react';
import TabBar from './TabBar';

const uri =
  'https://gd-hbimg.huaban.com/d478a9c4bd0167adae79806c6ccaa2d7f59ded5dd101-WmmTdI_fw1200webp';

const Person = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Icon
            name="scan-outline"
            size={30}
            color={'#000'}
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon
            name="settings-outline"
            size={30}
            color={'#000'}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.profileContainer}>
        <View style={styles.profileHeader}>
          <Image source={{uri}} style={styles.profileImage} />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>这是我的名字</Text>
            <View style={styles.certification}>
              <Icon name="checkmark-circle-outline" size={14} color={'#868a6c'} />
              <Text style={styles.certificationText}>专业户外认证</Text>
            </View>
          </View>
        </View>
        <View style={styles.stats}>
          <View style={styles.statText}>
            <Text style={styles.statName}>Star:</Text>
            <Text style={styles.statValue}>1.2w</Text>
          </View>
          <View style={styles.statText}>
            <Text style={styles.statName}>下载:</Text>
            <Text style={styles.statValue}>2056</Text>
          </View>
        </View>
      </View>
      <View style={{flex: 1, paddingTop: 10}}>
        <TabBar />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    marginTop: 10,
  },
  header: {
    height: 50,
    marginHorizontal: 10,
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  icon: {
    paddingRight: 20,
  },
  profileContainer: {
    backgroundColor: '#000',
    height: 140,
    marginHorizontal: 10,
    marginTop: 5,
    borderRadius: 20,
    padding: 15,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#fff',
    width: 70,
    height: 70,
  },
  profileInfo: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingLeft: 20,
  },
  profileName: {
    fontSize: 23,
    color: '#d5e18c',
    fontWeight: 'bold',
  },
  certification: {
    paddingTop: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  certificationText: {
    fontSize: 14,
    color: '#868a6c',
    paddingLeft: 5,
  },
  stats: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginTop: 10,
  },
  statText: {
    flexDirection: 'row',
    fontSize: 16,
    color: '#fff',
    paddingHorizontal: 15,
  },
  statName: {
    color: '#868a6c',
  },
  statValue: {
    color: '#b3c63f',
    paddingLeft: 5,
  },
});

export default Person;
