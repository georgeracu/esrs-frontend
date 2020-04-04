import React from 'react';

import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {WebView} from 'react-native-webview';

const ClaimsScreen = ({route, navigation}) => {
  const {service} = route.params;
  let serviceUri = '';
  switch (service) {
    case 'Southern Rail':
      serviceUri = 'https://delayrepay.southernrailway.com/customer-details';
      break;
    case 'Great Western Rail':
      serviceUri = 'https://delayrepay.gwr.com/make-claim';
      break;
    case 'Thameslink':
      serviceUri = 'https://delayrepay.thameslinkrailway.com/customer-details';
      break;
    case 'Avanti West Coast':
      serviceUri = 'https://delayrepay.avantiwestcoast.co.uk/make-claim';
      break;
    case 'C2C':
      serviceUri =
        'https://c2c.delayrepaycompensation.com/index.cfm?action=myclaims.add';
      break;
    case 'East Midlands Railway':
      serviceUri =
        'https://delayrepay.eastmidlandsrailway.co.uk/index.cfm?action=myclaims.add';
      break;
    case 'Gatwick Express':
      serviceUri = 'https://delayrepay.gatwickexpress.com/customer-details';
      break;
    case 'Greater Anglia':
      serviceUri =
        'https://greateranglia.delayrepaycompensation.com/index.cfm?action=myclaims.add';
      break;
    case 'Northern':
      serviceUri = 'https://delay.northernrailway.co.uk/';
      break;
  }
  return (
    <View style={styles.container}>
      <WebView
        source={{
          uri: serviceUri,
        }}
      />
      <View style={styles.ticketButtonsContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Tickets', {})}>
          <View style={styles.returnToDashboardBtn}>
            <Text style={styles.returnToDashboardBtnTxt}>
              RETURN TO DASHBOARD
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default ClaimsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  returnToDashboardBtn: {
    backgroundColor: 'rgb(128,128,128)',
    borderRadius: 10,
    padding: 10,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  returnToDashboardBtnTxt: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: 'sans-serif-medium',
    fontWeight: 'bold',
  },
  ticketButtonsContainer: {
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    backgroundColor: '#FFFFFF',
    padding: 20,
    // marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});
