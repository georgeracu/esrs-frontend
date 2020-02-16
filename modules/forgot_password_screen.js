import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import validator from 'validator';
import auth from '@react-native-firebase/auth';

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.email = '';
    this.password = '';
    this.isEmailCorrect = false;
  }

  render() {
    return (
      <View style={styles.root}>
        <Text style={styles.appName}>REPAYLINE</Text>
        <View>
          <Text style={styles.forgotPasswordMessageFirstLine}>
            Forgot Password?
          </Text>
          <Text style={styles.forgotPasswordMessage}>enter your email</Text>
          <Text style={styles.forgotPasswordMessage}>to get it.</Text>
        </View>
        <View>
          <View>
            <TextInput
              style={styles.textInputEmail}
              placeholder="Your email"
              ref={component => (this.textInputEmail = component)}
              onChangeText={text => this.onCheckEmailInput(text)}
            />
          </View>
          <TouchableOpacity onPress={this.onLogin}>
            <Text style={styles.buttonLogIn}>Send it to me</Text>
          </TouchableOpacity>
        </View>
        <View />
      </View>
    );
  }

  /**
   * Validates email pattern
   * @param text containing the email
   */
  onCheckEmailInput(text) {
    this.email = text;
    if (!validator.isEmail(text)) {
      this.isEmailCorrect = false;
      this.textInputEmail.setNativeProps({
        borderColor: '#DC7575',
      });
    } else if (validator.isEmail(text)) {
      this.isEmailCorrect = true;
      this.textInputEmail.setNativeProps({
        borderColor: '#CCCCCC',
      });
    }
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
  forgotPasswordMessage: {
    fontSize: 30,
    color: '#CCCCCC',
    fontFamily: 'sans-serif-light',
  },
  forgotPasswordMessageFirstLine: {
    fontFamily: 'sans-serif',
    color: '#CCCCCC',
    fontSize: 30,
  },
  textInputEmail: {
    borderColor: '#CCCCCC',
    borderRadius: 8,
    borderWidth: 1,
    height: 60,
    padding: 20,
    fontFamily: 'sans-serif-light',
  },
  buttonLogIn: {
    backgroundColor: '#687DFC',
    borderRadius: 8,
    color: '#FFFFFF',
    padding: 20,
    textAlign: 'center',
    marginTop: 30,
  },
  textLoginInfo: {
    textAlign: 'center',
    paddingTop: 5,
  },
  textLoginInfoLink: {
    fontWeight: 'bold',
    color: '#687DFC',
  },
});
