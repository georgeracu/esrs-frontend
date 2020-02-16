/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SplashScreen from './modules/splash_screen.js';
import LoginScreen from './modules/login_screen.js';
import RegisterScreen from './modules/register_screen.js';
import ForgotPasswordScreen from './modules/forgot_password_screen';
import TicketsScreen from './modules/tickets_screen';
import ClaimsScreen from './modules/claims_screen';

function App() {
  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator headerMode="none">
        <Stack.Screen name="Claims" component={ClaimsScreen} />
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="Tickets" component={TicketsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
