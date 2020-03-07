import React, {useEffect} from 'react';
import {AsyncStorage, StyleSheet, Text, View} from 'react-native';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';

const SplashScreen = ({navigation}) => {
  useEffect(() => {
    fetchDetails();
  });

  const fetchDetails = async () => {
    const id = await AsyncStorage.getItem('id');
    const email = await AsyncStorage.getItem('email');
    const password = await AsyncStorage.getItem('password');
    const isSignUpComplete = await AsyncStorage.getItem('isSignUpComplete');
    if (id === null) {
      const fcmToken = await messaging().getToken();
      await AsyncStorage.setItem('fcm_token', fcmToken);
      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
    } else {
      if (isSignUpComplete === 'false') {
        navigation.reset({
          index: 0,
          routes: [{name: 'UserCredentials'}],
        });
      } else {
        await authUser(email, password);
      }
    }
  };

  /**
   * This authenticates a user upon subsequent app launch
   * @param {*} email of the user
   * @param {*} password of the user
   */
  const authUser = async (email, password) => {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        navigation.reset({
          index: 0,
          routes: [{name: 'Tickets'}],
        });
      })
      .catch(err => {
        console.log(err);
        navigation.reset({
          index: 0,
          routes: [{name: 'Login'}],
        });
      });
  };

  return (
    <View style={styles.root}>
      <Text style={styles.appName}>REPAYLINE</Text>
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
