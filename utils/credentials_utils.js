import {Alert} from 'react-native';
import auth from '@react-native-firebase/auth';

/**
 * This signs in an already existing user
 * @param {*} email of the user
 * @param {*} password of the user
 */
const signIn = (email, password, props) => {
  auth()
    .signInWithEmailAndPassword(email, password)
    .then(() => {
      props.navigation.navigate('Tickets');
    })
    .catch(error => {
      switch (error.code) {
        case 'auth/user-not-found':
          Alert.alert(
            'Sign In',
            "Sorry, you don't have an account, please sign up for one",
          );
          break;
        case 'auth/email-already-in-use':
          Alert.alert('Sign In', `Hey, ${email} is already in use`);
          break;
        case 'auth/invalid-email':
          Alert.alert('Sign In', `Hey, ${email} is invalid`);
          break;
        case 'auth/wrong-password':
          Alert.alert('Sign In', 'Hey, looks like your password is wrong');
          break;
        default:
        // Do nothing
      }
    });
};

module.exports = {
  signIn,
};
