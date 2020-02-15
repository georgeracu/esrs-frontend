import React, {Component} from 'react';
import {AsyncStorage, StyleSheet, Text, View} from 'react-native';
import credentialsUtils from '../utils/credentials_utils';

export default class SplashScreen extends Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    const email = await AsyncStorage.getItem('email');
    const password = await AsyncStorage.getItem('password');
    const credential = email + password; // Concatenating empty or null values give you "" or 0
    if (credential === '' || credential === 0) {
      this.props.navigation.navigate('Login');
    } else {
      await credentialsUtils.signIn(email, password, this.props);
    }
  }

  render() {
    return (
      <View style={styles.root}>
        <Text style={styles.appName}>REPAYLINE</Text>
      </View>
    );
  }
}

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
