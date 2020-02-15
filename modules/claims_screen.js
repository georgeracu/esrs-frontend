import React from 'react';
import {View, StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';

const ClaimsScreen = () => {
  return (
    <View style={styles.container}>
      <WebView
        source={{
          uri:
            //need address for claims form
            'https://delayrepay.gwr.com/make-claim',
        }}
      />
    </View>
  );
};
export default ClaimsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
