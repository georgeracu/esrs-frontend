/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
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
import AsyncStorage from '@react-native-community/async-storage';
import {sha256} from 'react-native-sha256';
import generateFCMToken from '../utils/fcm';

const RegisterScreen = ({navigation}) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isEmailCorrect, toggleIsEmailCorrect] = useState(true);
    const [signUpBtnTxt, toggleSignUpBtnTxt] = useState('Sign me up');
    const [isSigningUp, toggleSignUpState] = useState(false);

    /**
     * Validates for empty entries
     */
    const onSignUp = () => {
        if (!isEmailCorrect || email === '') {
            Alert.alert('Sing Up', 'Please provide a valid email');
        } else if (password.length < 6) {
            Alert.alert('Sing Up', 'Password must be above 5 characters');
        } else {
            if (!isSigningUp) {
                signUp(email, password);
            }
        }
    };

    /**
     * This creates a new user credential
     */
    const signUp = async () => {
        toggleSignUpBtnTxt('Signing Up');
        toggleSignUpState(true);
        const hash = await sha256(password);
        auth()
            .createUserWithEmailAndPassword(email, hash)
            .then(async credentials => {
                // Persist user's credential and update the user's id with the new one from the firebase auth
                await AsyncStorage.setItem('id', credentials.user.uid);
                await AsyncStorage.setItem('email', email);
                await AsyncStorage.setItem('password', hash);

                const userCredentials = {
                    'user_id': credentials.user.uid,
                    'email': email,
                    'title': '',
                    'first_name': '',
                    'last_name': '',
                    'phone': '',
                    'country': '',
                    'address': '',
                    'town_city': '',
                    'postcode': '',
                };

                const response = await fetch('http://esrs.herokuapp.com/api/auth/user', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userCredentials),
                });

                if (response.status === 201) {
                    await generateFCMToken(credentials.user.uid);
                    navigation.reset({
                        index: 0,
                        routes: [{name: 'Tickets'}],
                    });
                } else {
                    toggleSignUpBtnTxt('Sign me up');
                    toggleSignUpState(false);
                }

            })
            .catch(error => {
                console.log(error);
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
        <View style={styles.root}>
                <Text style={styles.appName}>REPAYLINE</Text>
                <View style={styles.scrollViewContents}>
                    <Text style={styles.welcomeMessageFirstLine}>Welcome,</Text>
                    <Text style={styles.welcomeMessage}>sign up and reclaim</Text>
                    <Text style={styles.welcomeMessage}>your money.</Text>
                </View>
            <View>
                <View>
                    <TextInput
                        style={[styles.textInputEmail, {borderColor: isEmailCorrect ? '#CCCCCC' : '#DC7575'}]}
                        placeholder="Email"
                        defaultValue={email}
                        autoCapitalize="none"
                        textContentType="emailAddress"
                        onChangeText={text => {
                            setEmail(text);
                            if (!validator.isEmail(text)) {
                                toggleIsEmailCorrect(false);
                            } else if (validator.isEmail(text)) {
                                toggleIsEmailCorrect(true);
                            }
                        }}
                    />
                    <TextInput
                        style={styles.textInputPassword}
                        placeholder="Password must be above 5 characters"
                        secureTextEntry={true}
                        onChangeText={text => setPassword(text)}
                    />
                </View>
                <TouchableOpacity onPress={onSignUp}>
                    <Text style={styles.buttonLogIn}>{signUpBtnTxt}</Text>
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
                    and{' '}
                    <Text style={styles.textRegisterInfoLink}>Privacy Policy</Text>
                </Text>
            </View>
        </View>
    );
};

export default RegisterScreen;

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
        fontSize: 25,
        color: '#CCCCCC',
        fontFamily: 'sans-serif-light',
    },
    welcomeMessageFirstLine: {
        fontFamily: 'sans-serif',
        color: '#CCCCCC',
        fontSize: 25,
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
    textRegisterInfo: {
        textAlign: 'center',
    },
    textRegisterInfoLink: {
        fontWeight: 'bold',
        color: '#687DFC',
    },
});
