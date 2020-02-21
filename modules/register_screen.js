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
  const [isEmailCorrect, toggleIsEmailCorrect] = useState(true);
  const [isFormComplete, toggleIsFormComplete] = useState(false);
  const [signUpBtnTxt, toggleSignUpBtnTxt] = useState('Sign me up');
  const [isSigningUp, toggleSignUpState] = useState(false);

  /**
   * Validates for empty entries
   */
  const onSignUp = () => {
    const userKeys = Object.keys(userDetails);
    userKeys.every(key => {
      toggleIsFormComplete(userDetails[key] !== '');
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
        if (!isSigningUp) {
          signUp(userDetails.email, userDetails.password);
        }
      }
    }
  };

  /**
   * This creates a new user credential
   * @param {*} email of the user
   * @param {*} password of the user
   */
  const signUp = async (email, password) => {
    toggleSignUpBtnTxt('Signing Up');
    toggleSignUpState(true);
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(async credentials => {
        // Persist user's credentials
        await AsyncStorage.setItem('id', credentials.user.uid);
        await AsyncStorage.setItem('email', email);
        await AsyncStorage.setItem('password', password);
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
        toggleSignUpBtnTxt('Sign me up');
        toggleSignUpState(false);
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
  };

  return (
    <View style={{flex: 1}}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.appName}>REPAYLINE</Text>
        <View style={styles.scrollViewContents}>
          <Text style={styles.welcomeMessageFirstLine}>Welcome,</Text>
          <Text style={styles.welcomeMessage}>sign up and reclaim</Text>
          <Text style={styles.welcomeMessage}>your money.</Text>
        </View>
        <View style={styles.scrollViewContents}>
          <Picker
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
          <View style={styles.container_first_last_name}>
            <TextInput
                style={[styles.text_input_name, {borderRightWidth: 1, borderColor: '#CCCCCC'}]}
                placeholder="First name"
                autoCapitalize="words"
                textContentType="name"
                onChangeText={text => setUserDetails({...userDetails, firstName: text})}
            />
            <TextInput
                style={styles.text_input_name}
                placeholder="Last name"
                autoCapitalize="words"
                textContentType="name"
                onChangeText={text => setUserDetails({...userDetails, lastName: text})}
            />
          </View>
          <TextInput
            style={styles.text_input}
            placeholder="Phone number"
            textContentType="telephoneNumber"
            onChangeText={text => setUserDetails({...userDetails, phoneNumber: text})}
          />
          <TextInput
            style={[styles.text_input, {borderColor: isEmailCorrect ? '#CCCCCC' : '#DC7575'}]}
            placeholder="Email"
            textContentType="emailAddress"
            onChangeText={text => {
              setUserDetails({...userDetails, email: text});
              if (!validator.isEmail(text)) {
                toggleIsEmailCorrect(false);
              } else if (validator.isEmail(text)) {
                toggleIsEmailCorrect(true);
              }
            }}
          />
          <TextInput
            style={styles.text_input}
            placeholder="Password must be above 5 characters"
            textContentType="password"
            secureTextEntry={true}
            onChangeText={text => setUserDetails({...userDetails, password: text})}
          />
          <TextInput
            style={styles.text_input_multiline}
            placeholder="Address"
            autoCapitalize="words"
            multiline={true}
            onChangeText={text => setUserDetails({...userDetails, address: text})}
          />
          <View style={styles.container_town_city_postcode}>
            <TextInput
                style={[styles.text_input_town_city_postcode, {borderRightWidth: 1, borderColor: '#CCCCCC'}]}
                placeholder="Town/City"
                autoCapitalize="words"
                onChangeText={text => setUserDetails({...userDetails, townCity: text})}
            />
            <TextInput
                style={styles.text_input_town_city_postcode}
                placeholder="Postcode"
                textContentType="postalCode"
                onChangeText={text => setUserDetails({...userDetails, postcode: text})}
            />
          </View>
          <TouchableOpacity onPress={onSignUp}>
            <Text style={styles.buttonSignUp}>{signUpBtnTxt}</Text>
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
  container_first_last_name:  {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    fontFamily: 'sans-serif-light',
  },
  text_input_name: {
    height: 60,
    padding: 20,
    flexBasis: 1,
    flexGrow: 1,
  },
  container_town_city_postcode:  {
    flexDirection: 'row',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#CCCCCC',
    fontFamily: 'sans-serif-light',
  },
  text_input_town_city_postcode: {
    height: 60,
    padding: 20,
    flexBasis: 1,
    flexGrow: 1,
  },
  text_input: {
    borderColor: '#CCCCCC',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    height: 60,
    padding: 20,
    fontFamily: 'sans-serif-light',
  },
  text_input_multiline: {
    borderColor: '#CCCCCC',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    height: 100,
    textAlignVertical: 'top',
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
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  scrollViewContents: {
    marginTop: 20,
  },
});
