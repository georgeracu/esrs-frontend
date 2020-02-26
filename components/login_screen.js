/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {
    Alert,
    AsyncStorage,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import validator from 'validator';
import auth from '@react-native-firebase/auth';
import {sha256} from 'react-native-sha256';

const LoginScreen = ({navigation}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isEmailCorrect, toggleIsEmailCorrect] = useState(true);
    const [LogInBtnTxt, toggleLogInBtnTxt] = useState('Log me in');
    const [isLoggingIn, toggleLoginState] = useState(false);

    /**
     * Validates the email and password input for empty entries
     */
    const onLogin = async () => {
        if (email === '' || password === '') {
            Alert.alert('Sign In', 'Please provide all details');
        } else if (!isEmailCorrect) {
            Alert.alert('Sign In', 'Please provide a valid email');
        } else {
            if (!isLoggingIn) {
                await authUser();
            }
        }
    };

    /**
     * This authenticates a user upon sign in
     */
    const authUser = async () => {
        toggleLogInBtnTxt('Logging In');
        toggleLoginState(true);
        const hash = await sha256(password);
        try {
            const credentials = await auth().signInWithEmailAndPassword(email, hash);
            const response = await fetch('http://esrs.herokuapp.com/api/auth/user', {
                headers: {
                    method: 'GET',
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    user_id: credentials.user.uid,
                }
            });
            if (response.status === 200) {
                // Persist user's credentials
                await AsyncStorage.setItem('id', credentials.user.uid);
                await AsyncStorage.setItem('email', email);
                await AsyncStorage.setItem('password', hash);
                await AsyncStorage.setItem('isSignUpComplete', 'true');
                const user = await response.json();
                const modifiedJourneys = user.journeys.map(parsedJourney => ({
                    id: Math.random().toString(),
                    from: parsedJourney.journey_from,
                    to: parsedJourney.journey_to,
                    dateTime: parsedJourney.journey_datetime,
                }));
                await AsyncStorage.setItem('journeys', JSON.stringify(modifiedJourneys));
                navigation.reset({
                    index: 0,
                    routes: [{name: 'Tickets'}],
                });
            } else {
                toggleLogInBtnTxt('Log me in');
                toggleLoginState(false);
            }
        } catch (error) {
            switch (error.code) {
                case 'auth/user-not-found':
                    Alert.alert(
                        'Sign In',
                        "Sorry, you don't have an account, please sign up for one",
                    );
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
        }

        //.then(async (credentials) => {


        // })
        // .catch(error => {
        //     toggleLogInBtnTxt('Log me in');
        //     toggleLoginState(false);
        //
        // });
        toggleLogInBtnTxt('Log me in');
        toggleLoginState(false);
    };

    return (
        <View style={styles.root}>
            <Text style={styles.appName}>REPAYLINE</Text>
            <View>
                <Text style={styles.welcomeMessageFirstLine}>Hi there</Text>
                <Text style={styles.welcomeMessage}>please login</Text>
                <Text style={styles.welcomeMessage}>to your account.</Text>
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
                <TouchableOpacity onPress={onLogin}>
                    <Text style={styles.buttonLogIn}>{LogInBtnTxt}</Text>
                </TouchableOpacity>
            </View>
            <View>
                <Text style={styles.textLoginInfo}>
                    Forgot password?{' '}
                    <Text
                        style={styles.textLoginInfoLink}
                        onPress={() => navigation.navigate('ForgotPassword')}>
                        Get it now
                    </Text>
                </Text>
                <Text style={styles.textLoginInfo}>
                    Don't have an account?{' '}
                    <Text
                        style={styles.textLoginInfoLink}
                        onPress={() => navigation.navigate('Register')}>
                        Sign up now
                    </Text>
                </Text>
            </View>
        </View>
    );
};

export default LoginScreen;

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
    welcomeMessageFirstLine: {
        fontFamily: 'sans-serif',
        color: '#CCCCCC',
        fontSize: 30,
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

