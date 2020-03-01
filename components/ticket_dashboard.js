import React, {useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

const TicketDashboard = ({route, navigation}) => {
  const {from, to, dateTime} = route.params;
  console.log(from, to, dateTime);

  return (
    <View style={styles.root}>
      <ImageBackground
        source={require('../resources/wallpaper.png')}
        style={styles.topView}>
        {/*<Text style={styles.welcomeMessageFirstLine}>Manage your</Text>*/}
        {/*<Text style={styles.welcomeMessage}>Ticket</Text>*/}
      </ImageBackground>
      <View style={styles.temp}>
        <Text style={styles.darkContainerTxt}>Ticket: 12345dfsdgw4etryhgfd</Text>
      </View>
      <View style={styles.ticketDetailsContainer}>
        <View style={styles.ticketDetailView}>
          <Image
            style={styles.dateIcon}
            source={require('../resources/arrow.png')}
          />
          <View style={styles.ticketDetailTextContainer}>
            <Text style={styles.ticketDetailLabelText}>From</Text>
            <Text style={styles.ticketDetailText}>{from}</Text>
          </View>
        </View>
        <View style={styles.ticketDetailView}>
          <Image
            style={styles.dateIcon}
            source={require('../resources/map_pin.png')}
          />
          <View style={styles.ticketDetailTextContainer}>
            <Text style={styles.ticketDetailLabelText}>To</Text>
            <Text style={styles.ticketDetailText}>{to}</Text>
          </View>
        </View>
        <View style={styles.ticketDetailView}>
          <Image
            style={styles.dateIcon}
            source={require('../resources/tiny_date.png')}
          />
          <View style={styles.ticketDetailTextContainer}>
            <Text style={styles.ticketDetailLabelText}>Date</Text>
            <Text style={styles.ticketDetailText}>{dateTime}</Text>
          </View>
        </View>
      </View>
      <View style={styles.ticketButtonsContainer}>
        <Text />
        <View style={styles.claimSubmissionBtn}>
          <Text style={styles.claimSubmissionBtnTxt}>Submit claim</Text>
        </View>
      </View>
    </View>
  );
};

export default TicketDashboard;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'space-around',
  },
  topView: {
    backgroundColor: '#687DFC',
    padding: 20,
    flexGrow: 3,

  },
  temp: {
    backgroundColor: '#373759',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    flexGrow: 1,
    padding: 30,
    marginTop: -30,
  },
  welcomeMessageFirstLine: {
    fontFamily: 'sans-serif',
    color: '#FFFFFF',
    fontSize: 35,
  },
  welcomeMessage: {
    fontSize: 35,
    color: '#FFFFFF',
    fontFamily: 'sans-serif',
  },
  ticketDetailsContainer: {
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    backgroundColor: '#DCDCF0',
    padding: 20,
    marginTop: -30,
    flexGrow: 1,
  },
  ticketDetailView: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,
    flexDirection: 'row',
  },
  ticketDetailLabelText: {
    color: '#445587',
    fontFamily: 'sans-serif-thin',
  },
  ticketDetailText: {
    color: '#242133',
    fontFamily: 'sans-serif',
  },
  ticketDetailTextContainer: {
    marginLeft: 20,
  },
  ticketButtonsContainer: {
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    backgroundColor: '#FFFFFF',
    padding: 30,
    marginTop: -30,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  claimSubmissionBtn: {
    backgroundColor: '#5C5FC9',
    borderRadius: 15,
    padding: 20,
    width: 150,
  },
  claimSubmissionBtnTxt: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: 'sans-serif-medium',
  },
  darkContainerTxt: {
    color: '#FFFFFF',
    fontSize: 20,
  },
});
