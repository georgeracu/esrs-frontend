import React, {Component} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';

export default class RegisterScreen extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.root}>
        <Text style={styles.appName}>REPAYLINE</Text>
        <View>
          <Text style={styles.welcomeMessage}>Welcome</Text>
          <Text style={styles.welcomeMessage}>sign up and</Text>
          <Text style={styles.welcomeMessage}>reclaim your</Text>
          <Text style={styles.welcomeMessage}>money.</Text>
        </View>
        <View>
          <TextInput style={styles.textInputFullname} placeholder="Fullname" />
          <TextInput style={styles.textInputEmail} placeholder="Email" />
          <TextInput style={styles.textInputPassword} placeholder="Password" />
        </View>
        <Text style={styles.buttonSignUp}>Sign me up</Text>
        <View>
          <Text style={styles.textTermsAndConditions}>
            By creating an account you agree to our
          </Text>
          <Text style={styles.textTermsAndConditions}>
            <Text style={styles.textTermsAndConditonsLink}>
              Terms &amp; Conditions
            </Text>{' '}
            and{' '}
            <Text style={styles.textTermsAndConditonsLink}>Privacy Policy</Text>
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    padding: 20,
    flex: 1,
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
  },
  appName: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#4F4F4F',
    fontFamily: 'Verdana',
  },
  welcomeMessage: {
    fontSize: 30,
    color: '#CCCCCC',
    fontFamily: 'sans-serif-light',
  },
  textInputFullname: {
    borderColor: '#CCCCCC',
    borderWidth: 1,
    height: 60,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    padding: 20,
    fontFamily: 'sans-serif-light',
  },
  textInputEmail: {
    borderColor: '#CCCCCC',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    height: 60,
    padding: 20,
    fontFamily: 'sans-serif-light',
  },
  textInputPassword: {
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    height: 60,
    padding: 20,
    fontFamily: 'sans-serif-light',
  },
  buttonSignUp: {
    backgroundColor: '#687DFC',
    borderRadius: 8,
    color: '#FFFFFF',
    padding: 20,
    textAlign: 'center',
  },
  textTermsAndConditions: {
    textAlign: 'center',
  },
  textTermsAndConditonsLink: {
    fontWeight: 'bold',
    color: '#687DFC',
  },
});
