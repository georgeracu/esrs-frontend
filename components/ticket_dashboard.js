import React, {useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
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

  const {from, to, dateTime}  = route.params;
  console.log(from, to, dateTime);

  return (
    <View style={styles.root}>
    </View>
  );
};

export default TicketDashboard;

const styles = StyleSheet.create({
  root: {
    padding: 20,
    backgroundColor: 'rgba(104, 126, 252, 0.1)',
    ...StyleSheet.absoluteFillObject,
  },
  viewSeeTravels: {
    marginBottom: 10,
  },
  textSeeTravels: {
    fontWeight: 'bold',
    fontSize: 30,
    color: '#190320',
    fontFamily: 'sans-serif-thin',
  },
  ticketsSearchIconContainer: {
    height: 60,
    marginTop: 10,
  },
  ticketsSearchIcon: {
    position: 'absolute',
    right: 20,
    top: 20,
  },
  textInputTicketsSearch: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CCCCCC',
    borderRadius: 8,
    borderWidth: 1,
    padding: 20,
    fontFamily: 'sans-serif-light',
  },
  fab: {
    height: 60,
    width: 60,
    borderRadius: 200,
    position: 'absolute',
    bottom: 20,
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#687DFC',
  },
  textPlusSymbol: {
    fontSize: 30,
    color: '#FFFFFF',
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
  textInputContainer: {
    flexDirection: 'row',
    borderBottomColor: '#CCCCCC',
    borderBottomWidth: 1,
    fontFamily: 'sans-serif-light',
  },
  textInputStationLeft: {
    height: 60,
    padding: 20,
    flexBasis: 1,
    flexGrow: 1,
    borderRightColor: '#CCCCCC',
    borderRightWidth: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 8,
  },
  textInputStationRight: {
    height: 60,
    padding: 20,
    flexBasis: 1,
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    borderTopRightRadius: 8,
  },
  selectDate: {
    fontFamily: 'sans-serif-thin',
    fontSize: 15,
    color: '#FFFFFF',
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modalButtonLeft: {
    color: '#FFFFFF',
    backgroundColor: '#3c3c3d',
    flexBasis: 1,
    flexGrow: 1,
    padding: 20,
    fontFamily: 'sans-serif-medium',
    fontSize: 15,
    borderBottomLeftRadius: 8,
  },
  modalButtonRight: {
    color: '#FFFFFF',
    backgroundColor: '#687DFC',
    flexBasis: 1,
    flexGrow: 1,
    padding: 20,
    fontFamily: 'sans-serif-medium',
    fontSize: 15,
    borderBottomRightRadius: 8,
  },
  journeyView: {
    flexDirection: 'row',
    marginTop: 10,
    height: 80,
  },
  imageTrainLogoContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    padding: 10,
    margin: 1,
    width: 60,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  journeyDetails: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
    padding: 10,
    margin: 1,
    flex: 1,
    color: '#000000',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    alignContent: 'center',
  },
  listItem: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20,
    color: '#000000',
  },
  textModalButton: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: 'sans-serif-medium',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 15,
  },
  dateIcon: {
    marginLeft: 20,
    marginRight: 20,
  },
  dateText: {
    fontFamily: 'sans-serif-thin',
  },
});
