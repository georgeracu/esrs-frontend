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
import SplashScreen from './components/splash_screen.js';
import LoginScreen from './components/login_screen.js';
import RegisterScreen from './components/register_screen.js';
import ForgotPasswordScreen from './components/forgot_password_screen';
import TicketsScreen from './components/tickets_screen';
import TicketDashboard from './components/ticket_dashboard';
import ClaimsScreen from './components/claims_screen';

function App() {
  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator headerMode="none">
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="Tickets" component={TicketsScreen} />
        <Stack.Screen name="TicketDashboard" component={TicketDashboard} />
        <Stack.Screen name="Claims" component={ClaimsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
