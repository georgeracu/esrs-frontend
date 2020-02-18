import React, {Component} from 'react';
import {
  Alert,
  AsyncStorage,
  ScrollView,
  Picker,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import validator from 'validator';
import auth from '@react-native-firebase/auth';

export default class RegisterScreen extends Component {
  constructor(props) {
    super(props);
    this.user = {
      id: '1', // Will be updated once the user has been authenticated
      email: '',
      password: '',
      title: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      country: '',
      address: '',
      townCity: '',
      postcode: '',
    };
    this.state = {
      title: 'Mr',
    };
    this.isEmailCorrect = false;
    this.isformComplete = false;
  }

  /**
   * This creates a new user credential
   * @param {*} email of the user
   * @param {*} password of the user
   */
  async signUp(email, password) {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(async credentials => {
        // Persist user's credentials
        await AsyncStorage.setItem('email', email);
        await AsyncStorage.setItem('password', password);
        // update the user's id with the new one from the firebase auth
        this.user.id = credentials.user.uid;
        // Make POST request to backend
        console.log(this.user);
        this.props.navigation.reset({
          index: 0,
          routes: [{name: 'Tickets'}],
        });
      })
      .catch(error => {
        switch (error.code) {
          case 'auth/email-already-in-use':
            Alert.alert('Sign Up', `Hey, ${email} is already in use`);
            break;
          case 'auth/invalid-email':
            Alert.alert('Sign Up', `Hey, ${email} is invalid`);
            break;
          default:
          // Do nothing for now
        }
      });
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Text style={styles.appName}>REPAYLINE</Text>
          <View style={styles.scrollViewContents}>
            <Text style={styles.welcomeMessageFirstLine}>Welcome</Text>
            <Text style={styles.welcomeMessage}>sign up and reclaim</Text>
            <Text style={styles.welcomeMessage}>your money.</Text>
          </View>
          <View style={styles.scrollViewContents}>
            <Picker
              selectedValue={this.state.title}
              onValueChange={(itemValue, itemIndex) => {
                this.user.title = itemValue;
                this.setState({
                  title: itemValue,
                });
              }}
              ref={component => (this.refPickerTitle = component)}
              mode="dropdown">
              <Picker.Item label="Mr" value="Mr" />
              <Picker.Item label="Mrs" value="Mrs" />
              <Picker.Item label="Miss" value="Miss" />
              <Picker.Item label="Ms" value="Ms" />
              <Picker.Item label="Mx" value="Mx" />
              <Picker.Item label="Dr" value="Dr" />
            </Picker>
            <TextInput
              style={styles.textInputTop}
              placeholder="First name"
              autoCapitalize="words"
              textContentType="name"
              onChangeText={text => (this.user.firstName = text)}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Last name"
              textContentType="name"
              onChangeText={text => (this.user.lastName = text)}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Phone number"
              textContentType="telephoneNumber"
              ref={component => (this.refTextInputPhone = component)}
              onChangeText={text => (this.user.phoneNumber = text)}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Email"
              ref={component => (this.refTextInputEmail = component)}
              textContentType="emailAddress"
              onChangeText={text => this.onCheckEmailInput(text)}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Password"
              textContentType="password"
              secureTextEntry={true}
              onChangeText={text => (this.user.password = text)}
            />
            <TextInput
              style={styles.textInputMultiline}
              placeholder="Address"
              autoCapitalize="words"
              multiline={true}
              onChangeText={text => (this.user.address = text)}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Town/City"
              autoCapitalize="words"
              onChangeText={text => (this.user.townCity = text)}
            />
            <TextInput
              style={styles.textInputBottom}
              placeholder="Postcode"
              textContentType="postalCode"
              onChangeText={text => (this.user.postcode = text)}
            />
            <TouchableOpacity onPress={this.onSignUp}>
              <Text style={styles.buttonSignUp}>Sign me up</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.scrollViewContents}>
            <Text style={styles.textRegisterInfo}>
              By creating an account you agree to our
            </Text>
            <Text style={styles.textRegisterInfo}>
              <Text style={styles.textRegisterInfoLink}>
                Terms &amp; Conditions
              </Text>{' '}
              and{' '}
              <Text style={styles.textRegisterInfoLink}>Privacy Policy</Text>
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  /**
   * Validates email pattern
   * @param text containing the email
   */
  onCheckEmailInput(text) {
    this.user.email = text;
    if (!validator.isEmail(text)) {
      this.isEmailCorrect = false;
      this.refTextInputEmail.setNativeProps({
        borderColor: '#DC7575',
        borderWidth: 1,
      });
    } else if (validator.isEmail(text)) {
      this.isEmailCorrect = true;
      this.refTextInputEmail.setNativeProps({
        borderColor: '#CCCCCC',
        borderTopWidth: 0,
      });
    }
  }

  /**
   * Validates for empty entries
   */
  onSignUp = () => {
    const userKeys = Object.keys(this.user);
    userKeys.every(key => {
      this.isformComplete = this.user[key] !== '';
      return false;
    });
    if (!this.isformComplete) {
      Alert.alert('Sing Up', 'Please provide all details');
    } else {
      if (!this.isEmailCorrect) {
        Alert.alert('Sing Up', 'Please provide a valid email');
      } else if (!validator.isNumeric(this.user.phoneNumber)) {
        Alert.alert('Sing Up', 'Phone must be number only');
      } else if (this.user.phoneNumber.length !== 11) {
        Alert.alert('Sing Up', 'Phone must be 11 characters');
      } else if (this.user.password.length < 6) {
        Alert.alert('Sing Up', 'Password must be at least 6 characters long');
      } else {
        this.signUp(this.user.email, this.user.password);
      }
    }
  };
}

const styles = StyleSheet.create({
  appName: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#4F4F4F',
    fontFamily: 'Verdana',
  },
  welcomeMessage: {
    fontSize: 25,
    color: '#CCCCCC',
    fontFamily: 'sans-serif-light',
  },
  welcomeMessageFirstLine: {
    fontFamily: 'sans-serif',
    color: '#CCCCCC',
    fontSize: 25,
  },
  textInputTop: {
    borderColor: '#CCCCCC',
    borderWidth: 1,
    height: 60,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    padding: 20,
    fontFamily: 'sans-serif-light',
  },
  textInput: {
    borderColor: '#CCCCCC',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    height: 60,
    padding: 20,
    fontFamily: 'sans-serif-light',
  },
  textInputMultiline: {
    borderColor: '#CCCCCC',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    height: 100,
    padding: 20,
    fontFamily: 'sans-serif-light',
  },
  textInputBottom: {
    borderColor: '#CCCCCC',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    height: 60,
    padding: 20,
    fontFamily: 'sans-serif-light',
  },
  buttonSignUp: {
    backgroundColor: '#687DFC',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    color: '#FFFFFF',
    padding: 20,
    textAlign: 'center',
  },
  textRegisterInfo: {
    textAlign: 'center',
  },
  textRegisterInfoLink: {
    fontWeight: 'bold',
    color: '#687DFC',
  },
  scrollView: {
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  scrollViewContents: {
    marginTop: 10,
    marginBottom: 10,
  },
});
