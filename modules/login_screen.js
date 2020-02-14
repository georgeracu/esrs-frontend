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
import auth from '@react-native-firebase/auth';

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.email = '';
    this.password = '';
    this.isEmailCorrect = false;
  }

  /**
   * This signs in an already existing user
   * @param {*} email of the user
   * @param {*} password of the user
   */
  async signIn(email, password) {
    await auth()
      .signInWithEmailAndPassword(email, password)
      .then(userCredential => {
        console.log('Credential: ' + userCredential);
        // Make POST request to backend
        this.props.navigation.navigate('Tickets');
      })
      .catch(error => {
        Alert.alert(
          'Sign Up',
          "Sorry, you don't have an account, please sign up for one",
        );
        console.log(error.message);
      });
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
            <TextInput
              style={styles.textInputEmail}
              placeholder="Email"
              ref={component => (this.textInputEmail = component)}
              onChangeText={text => this.onCheckEmailInput(text)}
            />
            <TextInput
              style={styles.textInputPassword}
              placeholder="Password"
              secureTextEntry={true}
              onChangeText={text => (this.password = text)}
            />
          </View>
          <TouchableOpacity onPress={this.onLogin}>
            <Text style={styles.buttonLogIn}>Log me in</Text>
          </TouchableOpacity>
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
        borderBottomWidth: 0,
      });
    }
  }

  /**
   * Validates the email and password input for empty entries
   */
  onLogin = () => {
    if (this.email === '' || this.password === '') {
      Alert.alert('Sign In', 'Please provide all details');
    } else if (!this.isEmailCorrect) {
      Alert.alert('Sign In', 'Please provide a valid email');
    } else {
      // Make POST request to backend
      this.signIn(this.email, this.password);
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
