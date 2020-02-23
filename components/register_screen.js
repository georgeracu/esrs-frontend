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
import {sha256} from 'react-native-sha256';

const RegisterScreen = ({navigation}) => {

    const [id, setId] = useState('1'); // Will be updated once the user has been authenticated with firebase
    const [email, setEmail] = useState('');
    const [title, setTitle] = useState('Mr');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [country] = useState('United Kingdom');
    const [address, setAddress] = useState('');
    const [townCity, setTownCity] = useState('');
    const [postcode, setPostcode] = useState('');
    const [password, setPassword] = useState('');
    const [isEmailCorrect, toggleIsEmailCorrect] = useState(true);
    const [signUpBtnTxt, toggleSignUpBtnTxt] = useState('Sign me up');
    const [isSigningUp, toggleSignUpState] = useState(false);

    /**
     * Validates for empty entries
     */
    const onSignUp = () => {
        if ((email === '') || (title === '') || (firstName === '') || (lastName === '') || (phone === '') ||
            (country === '') || (address === '') || (townCity === '') || (postcode === '')) {
            Alert.alert('Sing Up', 'Please provide all details');
        } else {
            if (!isEmailCorrect) {
                Alert.alert('Sing Up', 'Please provide a valid email');
            } else if (!validator.isNumeric(phone)) {
                Alert.alert('Sing Up', 'Phone must be number only');
            } else if (phone.length !== 11) {
                Alert.alert('Sing Up', 'Phone must be 11 characters');
            } else if (password.length < 6) {
                Alert.alert('Sing Up', 'Password must be above 6 characters');
            } else {
                if (!isSigningUp) {
                    signUp(email, password);
                }
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
                setId(credentials.user.uid);
                await AsyncStorage.setItem('id', id);
                await AsyncStorage.setItem('email', email);
                await AsyncStorage.setItem('password', hash);
                // Make POST request to backend
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
                        selectedValue={title}
                        onValueChange={(itemValue) => {
                            setTitle(itemValue);
                        }}
                        mode="dropdown">
                        <Picker.Item label="Mr" value="Mr"/>
                        <Picker.Item label="Mrs" value="Mrs"/>
                        <Picker.Item label="Miss" value="Miss"/>
                        <Picker.Item label="Ms" value="Ms"/>
                        <Picker.Item label="Mx" value="Mx"/>
                        <Picker.Item label="Dr" value="Dr"/>
                    </Picker>
                    <View style={styles.container_first_last_name}>
                        <TextInput
                            style={[styles.text_input_name, {borderRightWidth: 1, borderColor: '#CCCCCC'}]}
                            placeholder="First name"
                            autoCapitalize="words"
                            textContentType="name"
                            onChangeText={text => setFirstName(text)}
                        />
                        <TextInput
                            style={styles.text_input_name}
                            placeholder="Last name"
                            autoCapitalize="words"
                            textContentType="name"
                            onChangeText={text => setLastName(text)}
                        />
                    </View>
                    <TextInput
                        style={styles.text_input}
                        placeholder="Phone number"
                        textContentType="telephoneNumber"
                        onChangeText={text => setPhone(text)}
                    />
                    <TextInput
                        style={[styles.text_input, {borderColor: isEmailCorrect ? '#CCCCCC' : '#DC7575'}]}
                        placeholder="Email"
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
                        style={styles.text_input}
                        placeholder="Password must be above 5 characters"
                        textContentType="password"
                        secureTextEntry={true}
                        onChangeText={text => setPassword(text)}
                    />
                    <TextInput
                        style={styles.text_input_multiline}
                        placeholder="Address"
                        autoCapitalize="words"
                        multiline={true}
                        onChangeText={text => setAddress(text)}
                    />
                    <View style={styles.container_town_city_postcode}>
                        <TextInput
                            style={[styles.text_input_town_city_postcode, {
                                borderRightWidth: 1,
                                borderColor: '#CCCCCC',
                            }]}
                            placeholder="Town/City"
                            autoCapitalize="words"
                            onChangeText={text => setTownCity(text)}
                        />
                        <TextInput
                            style={styles.text_input_town_city_postcode}
                            placeholder="Postcode"
                            textContentType="postalCode"
                            onChangeText={text => setPostcode(text)}
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
    container_first_last_name: {
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
    container_town_city_postcode: {
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
