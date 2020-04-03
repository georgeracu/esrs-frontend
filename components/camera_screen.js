/* eslint-disable prettier/prettier */
import React, {useState, useRef} from 'react';
import {
  Alert,
  AsyncStorage,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Button,
  PermissionsAndroid,
} from 'react-native';
import Modal from 'react-native-modal';

import {CameraKitCamera} from 'react-native-camera-kit';

const CameraScreen = ({navigation}) => {
  const [isModalVisible, toggleModalVisibility] = useState(false);
  let cameraRef = useRef(null);

  const getPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Train Wallet Camera Permission',
          message:
            'Train Wallet needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
        return true;
      } else {
        console.log('Camera permission denied');
        return false;
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const getImage = async () => {
    let image = null;

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Train Wallet Storage Permission',
          message:
            'Train Wallet needs access to your storage ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the storage');
        if (cameraRef) {
          image = await cameraRef.current.capture(true);
        }
        return image;
      } else {
        console.log('Storage permission denied');
        return image;
      }
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <View style={styles.root}>
      <Text style={styles.appName}>Train Wallet CAMERA</Text>
      {getPermission() ? (
        <CameraKitCamera
          ref={cameraRef}
          style={styles.preview}
          cameraOptions={{
            flashMode: 'auto', // on/off/auto(default)
            focusMode: 'on', // off/on(default)
            zoomMode: 'on', // off/on(default)
            ratioOverlay: '1:1', // optional, ratio overlay on the camera and crop the image seamlessly
            ratioOverlayColor: '#00000077', // optional
          }}
        />
      ) : (
        <Text style={styles.appName}>Need Permission</Text>
      )}
      <View style={{padding: 5}}>
        <Button color="#4F4F4F" title="Capture" onPress={getImage} />
      </View>
    </View>
  );
};

export default CameraScreen;

const styles = StyleSheet.create({
  root: {
    padding: 0,
    flex: 1,
    zIndex: 50,

  },
  appName: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#4F4F4F',
    fontFamily: 'Verdana',
    padding: 5,
    alignContent: 'center',
    textAlign: 'center'
  },
  preview: {
    flex: 1,

  },
});
