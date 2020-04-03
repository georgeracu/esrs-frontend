import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-community/async-storage';

const SplashScreen = ({navigation}) => {
  useEffect(() => {
    fetchDetails();
  });

  const fetchDetails = async () => {
    const email = await AsyncStorage.getItem('email');
    const password = await AsyncStorage.getItem('password');
    await authUser(email, password);
  };

  /**
   * This authenticates a user upon subsequent app launch
   * @param {*} email of the user
   * @param {*} password of the user
   */
  const authUser = async (email, password) => {
    if (email === null || password === null) {
      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
    } else {
      auth()
        .signInWithEmailAndPassword(email, password)
        .then(async () => {
          navigation.reset({
            index: 0,
            routes: [{name: 'Tickets'}],
          });
        })
        .catch(err => {
          navigation.reset({
            index: 0,
            routes: [{name: 'Login'}],
          });
        });
    }
  };

  return (
    <View style={styles.root}>
      <Text style={styles.appName}>Train Wallet</Text>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  root: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  appName: {
    fontWeight: 'bold',
    fontSize: 25,
    color: '#4F4F4F',
    fontFamily: 'Verdana',
    textAlign: 'center',
  },
});
