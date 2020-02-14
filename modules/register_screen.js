import React, {Component} from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import validator from 'validator';

export default class RegisterScreen extends Component {
  constructor(props) {
    super(props);
    this.fullname = '';
    this.email = '';
    this.password = '';
    this.isEmailCorrect = false;
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
          <View>
            <TextInput
              style={styles.textInputFullname}
              placeholder="Fullname"
              onChangeText={text => (this.fullname = text)}
            />
            <TextInput
              style={styles.textInputEmail}
              placeholder="Email"
              ref={component => (this.textInputEmail = component)}
              onChangeText={text => this.onCheckEmailInput(text)}
            />
            <TextInput
              style={styles.textInputPassword}
              placeholder="Password"
              onChangeText={text => (this.password = text)}
            />
          </View>
          <TouchableOpacity onPress={this.onSignUp}>
            <Text style={styles.buttonSignUp}>Sign me up</Text>
          </TouchableOpacity>
        </View>
        <View>
          <Text style={styles.textRegisterInfo}>
            By creating an account you agree to our
          </Text>
          <Text style={styles.textRegisterInfo}>
            <Text style={styles.textRegisterInfoLink}>
              Terms &amp; Conditions
            </Text>{' '}
            and <Text style={styles.textRegisterInfoLink}>Privacy Policy</Text>
          </Text>
        </View>
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
        borderWidth: 1,
      });
    } else if (validator.isEmail(text)) {
      this.isEmailCorrect = true;
      this.textInputEmail.setNativeProps({
        borderColor: '#CCCCCC',
        borderTopWidth: 0,
        borderBottomWidth: 0,
      });
    }
  }

  /**
   * Validates the fullname, email and password input for empty entries
   */
  onSignUp = () => {
    if (this.fullname === '' || this.email === '' || this.password === '') {
      Alert.alert('Please provide all details');
    } else if (!this.isEmailCorrect) {
      Alert.alert('Please provide a valid email');
    } else {
      // Make POST request to backend
      this.props.navigation.navigate('Tickets');
    }
  };
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
    marginTop: 30,
  },
  textRegisterInfo: {
    textAlign: 'center',
  },
  textRegisterInfoLink: {
    fontWeight: 'bold',
    color: '#687DFC',
  },
});
