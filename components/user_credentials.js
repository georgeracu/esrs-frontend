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
import generateFCMToken from "../utils/fcm";

const UserCredentialsScreen = ({navigation}) => {

    const [title, setTitle] = useState('Mr');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [country] = useState('United Kingdom');
    const [address, setAddress] = useState('');
    const [townCity, setTownCity] = useState('');
    const [postcode, setPostcode] = useState('');
    const [saveDetailsBtnTxt, toggleSaveDetailsBtnTxt] = useState('Save my claim details');
    const [isSavingDetails, toggleSavingDetailsState] = useState(false);

    /**
     * Validates for empty entries
     */
    const onSaveDetails = () => {
        if ((title === '') || (firstName === '') || (lastName === '') || (phone === '') ||
            (country === '') || (address === '') || (townCity === '') || (postcode === '')) {
            Alert.alert('Save Claim Details', 'Please provide all claim details');
        } else {
            if (!validator.isNumeric(phone)) {
                Alert.alert('Save Claim Details', 'Phone must be number only');
            } else if (phone.length !== 11) {
                Alert.alert('Save Claim Details', 'Phone must be 11 characters');
            } else {
                if (!isSavingDetails) {
                    saveDetails();
                }
            }
        }
    };

    /**
     * This creates a new user credential
     */
    const saveDetails = async () => {
        toggleSaveDetailsBtnTxt('Saving claim details');
        toggleSavingDetailsState(true);

        const id = await AsyncStorage.getItem('id');
        const email = await AsyncStorage.getItem('email');
        const userCredentials = {
            'user_id': id,
            'email': email,
            'title': title,
            'first_name': firstName,
            'last_name': lastName,
            'phone': phone,
            'country': country,
            'address': address,
            'town_city': townCity,
            'postcode': postcode,
        };

        fetch('http://esrs.herokuapp.com/api/auth/user', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userCredentials),
        }).then(async response => {
            if (response.status === 201) {
                await generateFCMToken(id);
                await AsyncStorage.setItem('isSignUpComplete', 'true');
                navigation.reset({
                    index: 0,
                    routes: [{name: 'Tickets'}],
                });
            } else {
                toggleSaveDetailsBtnTxt('Save my claim details');
                toggleSavingDetailsState(false);
            }
        }).catch(error => {
            // Will be improved in later
            console.log(error);
        });
    };

    return (
        <View style={styles.root}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <Text style={styles.appName}>REPAYLINE</Text>
                <View style={styles.scrollViewContents}>
                    <Text style={styles.welcomeMessageFirstLine}>Why we want your info?,</Text>
                    <Text style={styles.welcomeMessage}>Trainlines require them </Text>
                    <Text style={styles.welcomeMessage}>when submitting a claim.</Text>
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
                            autoCapitalize="characters"
                            onChangeText={text => setPostcode(text)}
                        />
                    </View>
                    <TouchableOpacity onPress={onSaveDetails}>
                        <Text style={styles.buttonSaveDetails}>{saveDetailsBtnTxt}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.scrollViewContents}>
                    <Text style={styles.textRegisterInfo}>
                        By providing your details you agree to our
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

export default UserCredentialsScreen;

const styles = StyleSheet.create({
    root: {
        ...StyleSheet.absoluteFillObject,
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
        fontFamily: 'sans-serif-light',
    },
    container_town_city_postcode: {
        flexDirection: 'row',
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#CCCCCC',
    },
    text_input_town_city_postcode: {
        height: 60,
        padding: 20,
        flexBasis: 1,
        flexGrow: 1,
        fontFamily: 'sans-serif-light',
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
    buttonSaveDetails: {
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
        justifyContent: 'space-around',
        flex: 1,
    },
    scrollViewContents: {
        marginTop: 20,
    },
});
