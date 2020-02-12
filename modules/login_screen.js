import React, {Component} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.root}>
        <Text style={styles.appName}>REPAYLINE</Text>
        <View>
          <Text style={styles.welcomeMessage}>Hi there</Text>
          <Text style={styles.welcomeMessage}>please login</Text>
          <Text style={styles.welcomeMessage}>to your account.</Text>
        </View>
        <View>
          <View>
            <TextInput style={styles.textInputEmail} placeholder="Email" />
            <TextInput
              style={styles.textInputPassword}
              placeholder="Password"
            />
          </View>
          <Text style={styles.buttonLogMeIn}>Log me in</Text>
        </View>
        <View>
          <Text style={styles.textLoginInfo}>
            Forgot password?{' '}
            <Text style={styles.textLoginInfoLink}>Get it now</Text>
          </Text>
          <Text style={styles.textLoginInfo}>
            Don't have an account?{' '}
            <Text
              style={styles.textLoginInfoLink}
              onPress={() => this.props.navigation.navigate('Register')}>
              Sign up now
            </Text>
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
  textInputEmail: {
    borderColor: '#CCCCCC',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderTopWidth: 1,
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
  buttonLogMeIn: {
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
