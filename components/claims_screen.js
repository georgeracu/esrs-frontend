import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {WebView} from 'react-native-webview';

const ClaimsScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <WebView
        source={{
          uri:
            //need address for claims form
            'https://delayrepay.gwr.com/make-claim',
        }}
      />
      <TouchableOpacity onPress={() => navigation.navigate('Tickets', {})}>
        <View style={styles.returnToDashboardBtn}>
          <Text style={styles.returnToDashboardBtnTxt}>
            RETURN TO DASHBOARD
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
export default ClaimsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  returnToDashboardBtn: {
    backgroundColor: '#5C5FC9',
    borderRadius: 15,
    padding: 10,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 36,
  },
  returnToDashboardBtnTxt: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: 'sans-serif-medium',
  },
});
