/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
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

const RegisterScreen = ({navigation}) => {
  const [userDetails, setUserDetails] = useState({
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
  });
  const [isEmailCorrect, setIsEmailCorrect] = useState(false);
  const [isFormComplete, setIsFormComplete] = useState(false);

  /**
   * Validates email pattern
   * @param text containing the email
   */
  const onCheckEmailInput = (text) => {
    setUserDetails({...userDetails, email: text});
    if (!validator.isEmail(text)) {
      setIsEmailCorrect(false);
    } else if (validator.isEmail(text)) {
      setIsEmailCorrect(true);
    }
  };

  /**
   * This creates a new user credential
   * @param {*} email of the user
   * @param {*} password of the user
   */
  const signUp = async (em, pass) => {
    auth()
      .createUserWithEmailAndPassword(em, pass)
      .then(async credentials => {
        // Persist user's credentials
        await AsyncStorage.setItem('email', em);
        await AsyncStorage.setItem('password', pass);
        // update the user's id with the new one from the firebase auth
        setUserDetails({...userDetails, id: credentials.user.uid});
        // Make POST request to backend
        console.log(userDetails);
        navigation.reset({
          index: 0,
          routes: [{name: 'Tickets'}],
        });
      })
      .catch(error => {
        switch (error.code) {
          case 'auth/email-already-in-use':
            Alert.alert('Sign Up', `Hey, ${em} is already in use`);
            break;
          case 'auth/invalid-email':
            Alert.alert('Sign Up', `Hey, ${em} is invalid`);
            break;
          default:
          // Do nothing for now
        }
      });
  };

  /**
   * Validates for empty entries
   */
  const onSignUp = () => {
    const userKeys = Object.keys(userDetails);
    userKeys.every(key => {
      setIsFormComplete(userDetails[key] !== '');
      return false;
    });
    if (!isFormComplete) {
      Alert.alert('Sing Up', 'Please provide all details');
    } else {
      if (!isEmailCorrect) {
        Alert.alert('Sing Up', 'Please provide a valid email');
      } else if (!validator.isNumeric(userDetails.phoneNumber)) {
        Alert.alert('Sing Up', 'Phone must be number only');
      } else if (userDetails.phoneNumber.length !== 11) {
        Alert.alert('Sing Up', 'Phone must be 11 characters');
      } else if (userDetails.password.length < 6) {
        Alert.alert('Sing Up', 'Password must be at least 6 characters long');
      } else {
        signUp(userDetails.email, userDetails.password);
      }
    }
  };

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
            selectedValue="Mr"
            onValueChange={(itemValue, itemIndex) => {
              setUserDetails({...userDetails, title: itemValue});
            }}
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
            onChangeText={text => setUserDetails({...userDetails, firstName: text})}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Last name"
            textContentType="name"
            onChangeText={text => setUserDetails({...userDetails, lastName: text})}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Phone number"
            textContentType="telephoneNumber"
            onChangeText={text => setUserDetails({...userDetails, phoneNumber: text})}
          />
          <TextInput
            style={[styles.textInput, {borderColor: isEmailCorrect ? '#CCCCCC' : '#DC7575', borderWidth: isEmailCorrect ? 1 : 0}]}
            placeholder="Email"
            textContentType="emailAddress"
            onChangeText={text => onCheckEmailInput(text)}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Password"
            textContentType="password"
            secureTextEntry={true}
            onChangeText={text => setUserDetails({...userDetails, password: text})}
          />
          <TextInput
            style={styles.textInputMultiline}
            placeholder="Address"
            autoCapitalize="words"
            multiline={true}
            onChangeText={text => setUserDetails({...userDetails, address: text})}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Town/City"
            autoCapitalize="words"
            onChangeText={text => setUserDetails({...userDetails, townCity: text})}
          />
          <TextInput
            style={styles.textInputBottom}
            placeholder="Postcode"
            textContentType="postalCode"
            onChangeText={text => setUserDetails({...userDetails, postcode: text})}
          />
          <TouchableOpacity onPress={onSignUp}>
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
};

export default RegisterScreen;

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
