import { Image, Text, TouchableOpacity, View, StyleSheet, ScrollView } from "react-native";
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
            size={20}
            color={'#000'}
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon
            name="settings-outline"
            size={20}
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
            <Text style={styles.statValue}>1.2w</Text>
            <Text style={styles.statName}>Star</Text>
          </View>
          <View style={styles.statText}>
            <Text style={styles.statValue}>2056</Text>
            <Text style={styles.statName}>下载</Text>
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
    backgroundColor: '#fff',
  },
  header: {
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
    marginHorizontal: 10,
    marginTop: 5,
    borderRadius: 20,
    padding: 15,
    height: 150,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    borderRadius: 35,
    borderWidth: 2,
    borderColor: 'white',
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
    color: '#000',
    fontWeight: 'bold',
  },
  certification: {
    paddingTop: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  certificationText: {
    fontSize: 14,
    color: '#1b1a1a',
    paddingLeft: 5,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  statText: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    fontSize: 16,
    color: '#fff',
    paddingHorizontal: 15,
  },
  statName: {
    color: '#868a6c',
  },
  statValue: {
    color: '#000',
    fontSize: 18,
  },
});

export default Person;
