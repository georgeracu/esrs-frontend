import React, {useEffect, useState} from 'react';
import {
  Alert,
  BackHandler,
  FlatList,
  Image,
  ImageBackground,
  Picker,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import {stations} from '../utils/stations';
import Modal from 'react-native-modal';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useFocusEffect} from '@react-navigation/native';
const TicketDashboard = ({route, navigation}) => {
  const {
    id,
    from,
    to,
    dateTime,
    medium,
    type,
    price,
    number,
    NRailNumber,
  } = route.params;

  const [journeyFrom, setJourneyFrom] = useState(from);
  const [journeyTo, setJourneyTo] = useState(to);
  const [journeyDay, setJourneyDay] = useState(dateTime.split(' ')[0]);
  const [journeyTime, setJourneyTime] = useState(dateTime.split(' ')[1]);
  const [journeyLocation, toggleJourneyLocation] = useState('JF'); // Were JF denotes journeyFrom and JT is journeyTo

  const [dateTimeMode, toggleDateTimeMode] = useState('date');
  const [shouldShowDateTime, toggleShowDateTime] = useState(false);

  const [journeyMedium, setJourneyMedium] = useState(medium);
  const [ticketType, setTicketType] = useState(type);
  const [ticketNumber, setTicketNumber] = useState(number);
  const [ticketPrice, setTicketPrice] = useState(price);
  const [nationalRailNumber, setNationalRailNumber] = useState(NRailNumber);

  const [isModalVisible, toggleModalVisibility] = useState(false);

  const [stationsSuggestions, setStationsSuggestions] = useState([]);

  const [journeys, setJourneys] = useState([]);

  useEffect(() => {
    async function getPersistedJourneys() {
      const persistedJourneys = await AsyncStorage.getItem('journeys');
      if (persistedJourneys != null) {
        const parsedJourneysJson = JSON.parse(persistedJourneys);
        setJourneys(parsedJourneysJson);
      }
    }
    getPersistedJourneys();

    messaging().onMessage(remoteMessage => {
      console.log('FCM Message Data:', JSON.stringify(remoteMessage));
    });
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.reset({
          index: 0,
          routes: [{name: 'Tickets'}],
        });
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );

  /**
   * Returns matching stations
   * @param stationName
   */
  const searchJourneys = stationName => {
    journeyLocation === 'JF'
      ? setJourneyFrom(stationName)
      : setJourneyTo(stationName);
    const results = stations.names.filter(station => {
      return station.toLowerCase().startsWith(stationName.toLowerCase());
    });
    if (stationName === '') {
      setStationsSuggestions([]);
    } else {
      setStationsSuggestions(results.slice(0, 5));
    }
  };

  /**
   * Adds a new journey
   */
  const updateJourney = async () => {
    setJourneyFrom(journeyFrom);
    setJourneyTo(journeyTo);
    setJourneyDay(journeyDay);
    setJourneyTime(journeyTime);
    setJourneyMedium(journeyMedium);
    setTicketType(ticketType);
    setTicketPrice(ticketPrice);
    setTicketNumber(ticketNumber);
    setNationalRailNumber(nationalRailNumber);

    const newJourney = {
      journey_from: journeyFrom,
      journey_to: journeyTo,
      journey_datetime: `${journeyDay} ${journeyTime}`,
      journey_medium: journeyMedium,
      ticket_type: ticketType,
      ticket_price: ticketPrice,
      ticket_number: ticketNumber,
      national_rail_number: nationalRailNumber,
    };

    const newJourneys = journeys.map(journey => {
      if (journey.journey_id === id) {
        newJourney.journey_id = journey.journey_id;
        return newJourney;
      }
    });

    AsyncStorage.setItem('journeys', JSON.stringify(newJourneys));

    delete newJourney.id;

    fetch('http://esrs.herokuapp.com/api/auth/user/journey', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        user_id: id,
      },
      body: JSON.stringify(newJourney),
    });
  };

  /**
   * Validate journey inputs
   */
  const validateJourney = () => {
    if (
      !stations.codes.includes(journeyFrom) ||
      !stations.codes.includes(journeyTo) ||
      ticketNumber === '' ||
      ticketPrice === ''
    ) {
      Alert.alert('Add Journey', 'Oops, looks like you are missing something');
    } else if (journeyFrom === journeyTo) {
      Alert.alert(
        'Add Journey',
        "Oops, Departure and Destination can't be same",
      );
    } else {
      updateJourney();
      toggleModalVisibility(false);
    }
  };

  /**
   * Cancel adding a journey
   */
  const cancelJourney = () => {
    toggleModalVisibility(false);
  };

  /**
   * Delete journey
   */
  const deleteJourney = async () => {
    Alert.alert(
      'Delete Journey',
      'Are you sure you want to delete your journeys?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            const otherJourneys = journeys.filter(
              journey => journey.journey_id !== id,
            );
            await AsyncStorage.setItem(
              'journeys',
              JSON.stringify(otherJourneys),
            );
            navigation.reset({
              index: 0,
              routes: [{name: 'Tickets'}],
            });
            // fetch('http://esrs.herokuapp.com/api/auth/user/journey', {
            //   method: 'DELETE',
            //   headers: {
            //     Accept: 'application/json',
            //     'Content-Type': 'application/json',
            //     user_id: id,
            //   },
            // });
          },
        },
      ],
    );
  };

  return (
    <View style={styles.root}>
      <ImageBackground
        source={require('../resources/wallpaper.png')}
        style={styles.topView}
      />
      <View style={styles.darkContainer}>
        <Image source={require('../resources/ticket-white.png')} />
        <View style={styles.darkContainerTxts}>
          <Text style={styles.darkContainerTxtBold}>{ticketNumber}</Text>
          <Text
            style={[styles.darkContainerTxtBold, styles.darkContainerTxtLight]}>
            {ticketType}
          </Text>
          <Text
            style={[styles.darkContainerTxtBold, styles.darkContainerTxtLight]}>
            £{ticketPrice}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            toggleModalVisibility(!isModalVisible);
          }}>
          <Image source={require('../resources/edit.png')} />
        </TouchableOpacity>
      </View>
      <View style={styles.ticketDetailsContainer}>
        <View style={styles.ticketDetailView}>
          <Image source={require('../resources/arrow.png')} />
          <View style={styles.ticketDetailTextContainer}>
            <Text style={styles.ticketDetailLabelText}>From</Text>
            <Text style={styles.ticketDetailText}>{journeyFrom}</Text>
          </View>
        </View>
        <View style={styles.ticketDetailView}>
          <Image source={require('../resources/map_pin.png')} />
          <View style={styles.ticketDetailTextContainer}>
            <Text style={styles.ticketDetailLabelText}>To</Text>
            <Text style={styles.ticketDetailText}>{journeyTo}</Text>
          </View>
        </View>
        <View style={styles.ticketDetailView}>
          <Image source={require('../resources/round-trip.png')} />
          <View style={styles.ticketDetailTextContainer}>
            <Text style={styles.ticketDetailLabelText}>Journey Medium</Text>
            <Text style={styles.ticketDetailText}>{journeyMedium}</Text>
          </View>
        </View>
        <View style={styles.ticketDetailView}>
          <Image source={require('../resources/tiny_date.png')} />
          <View style={styles.ticketDetailTextContainer}>
            <Text style={styles.ticketDetailLabelText}>Date</Text>
            <Text style={styles.ticketDetailText}>
              {`${journeyDay} ${journeyTime}`}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.ticketButtonsContainer}>
        <TouchableOpacity onPress={deleteJourney}>
          <View style={[styles.claimSubmissionBtn, styles.deleteBtn]}>
            <Text style={styles.claimSubmissionBtnTxt}>Delete</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View style={styles.claimSubmissionBtn}>
            <Text style={styles.claimSubmissionBtnTxt}>Submit claim</Text>
          </View>
        </TouchableOpacity>
      </View>
      <Modal isVisible={isModalVisible}>
        <View style={styles.modal}>
          <View style={styles.textInputContainer}>
            <TextInput
              value={journeyFrom}
              style={styles.textInputStationLeft}
              placeholder="Depart"
              onChangeText={text => searchJourneys(text)}
              onFocus={() => toggleJourneyLocation('JF')}
            />
            <TextInput
              value={journeyTo}
              style={styles.textInputStationRight}
              placeholder="Dest"
              onChangeText={text => searchJourneys(text)}
              onFocus={() => toggleJourneyLocation('JT')}
            />
            <TouchableOpacity
              style={styles.date}
              onPress={() => toggleShowDateTime(true)}>
              <Text style={styles.dateText}>
                {journeyDay} {journeyTime}
              </Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={stationsSuggestions}
            keyExtractor={station => station}
            showsHorizontalScrollIndicator={true}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() => {
                  journeyLocation === 'JF'
                    ? setJourneyFrom(stations.stationsAndCodes.get(item))
                    : setJourneyTo(stations.stationsAndCodes.get(item));
                  setStationsSuggestions([]);
                }}>
                <Text style={styles.listItem}>{item}</Text>
              </TouchableOpacity>
            )}
          />
          <View style={styles.pickerContainer}>
            <Picker
              style={styles.picker}
              selectedValue={journeyMedium}
              onValueChange={itemValue => {
                setJourneyMedium(itemValue);
              }}
              mode="dropdown">
              <Picker.Item label="Paper" value="Paper" />
              <Picker.Item label="Touch Smartcard" value="Touch Smartcard" />
              <Picker.Item
                label="E-ticket/M-ticket"
                value="E-ticket/M-ticket"
              />
              <Picker.Item label="Oyster Card" value="Oyster Card" />
              <Picker.Item label="Contactless" value="Contactless" />
              <Picker.Item
                label="Smartcard (other Train Company)"
                value="Smartcard other Train Company"
              />
            </Picker>

            <Picker
              style={styles.picker}
              selectedValue={ticketType}
              onValueChange={itemValue => {
                setTicketType(itemValue);
              }}
              mode="dropdown">
              <Picker.Item label="Single" value="Single" />
              <Picker.Item label="Return" value="Return" />
              <Picker.Item label="Weekly season" value="Weekly season" />
              <Picker.Item label="Rover" value="Rover" />
              <Picker.Item label="Ranger" value="Ranger" />
              <Picker.Item
                label="Daily travel card"
                value="Daily travel card"
              />
              <Picker.Item label="Carnet" value="Carnet" />
            </Picker>
          </View>

          <TextInput
            value={ticketNumber}
            style={styles.textInputBasic}
            placeholder="Ticket Number"
            onChangeText={text => setTicketNumber(text)}
          />

          <TextInput
            value={ticketPrice}
            style={styles.textInputBasic}
            placeholder="Ticket Price"
            keyboardType={'numeric'}
            onChangeText={text => setTicketPrice(text)}
          />

          <TextInput
            value={nationalRailNumber}
            style={styles.textInputBasic}
            placeholder="National rail voucher"
            onChangeText={text => setNationalRailNumber(text)}
          />

          <View style={styles.modalButtonsContainer}>
            <TouchableOpacity
              style={styles.modalButtonLeft}
              onPress={() => cancelJourney()}>
              <Text style={styles.textModalButton}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButtonRight}
              onPress={() => validateJourney()}>
              <Text style={styles.textModalButton}>Edit Journey</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {shouldShowDateTime && (
        <DateTimePicker
          timeZoneOffsetInMinutes={0}
          value={new Date()}
          mode={dateTimeMode}
          is24Hour={true}
          display="default"
          onChange={(event, newDate) => {
            if (event.type === 'dismissed') {
              toggleShowDateTime(false);
              toggleDateTimeMode('date');
            } else {
              if (dateTimeMode === 'date') {
                toggleShowDateTime(false);
                toggleDateTimeMode('time');
                toggleShowDateTime(true);
                setJourneyDay(moment(newDate).format('DD-MM-YYYY'));
              } else if (dateTimeMode === 'time') {
                toggleShowDateTime(false);
                toggleDateTimeMode('date');
                setJourneyTime(moment(newDate).format('HH:mm'));
              }
            }
          }}
        />
      )}
    </View>
  );
};

export default TicketDashboard;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'space-around',
    backgroundColor: '#373759',
  },
  topView: {
    backgroundColor: '#687DFC',
    padding: 20,
    flexGrow: 3,
  },
  darkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#373759',
    padding: 20,
  },
  darkContainerTxts: {
    flexDirection: 'column',
  },
  darkContainerTxtBold: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'sans-serif-medium',
    textAlign: 'center',
  },
  darkContainerTxtLight: {
    fontFamily: 'sans-serif-light',
  },
  ticketDetailsContainer: {
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    backgroundColor: '#DCDCF0',
    padding: 20,
    flexGrow: 1,
  },
  ticketDetailView: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    padding: 15,
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
    padding: 20,
    marginTop: -30,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  claimSubmissionBtn: {
    backgroundColor: '#5C5FC9',
    borderRadius: 15,
    padding: 15,
    width: 150,
  },
  deleteBtn: {
    backgroundColor: '#FA6B6B',
  },
  claimSubmissionBtnTxt: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: 'sans-serif-medium',
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    maxHeight: 400,
    elevation: 15,
  },
  textInputContainer: {
    flexDirection: 'row',
    borderBottomColor: '#CCCCCC',
    borderBottomWidth: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    fontFamily: 'sans-serif-light',
  },
  textInputStationLeft: {
    height: 50,
    padding: 10,
    flexBasis: 1,
    flexGrow: 1,
    borderRightColor: '#CCCCCC',
    borderRightWidth: 1,
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
    borderTopLeftRadius: 8,
  },
  textInputStationRight: {
    height: 50,
    padding: 10,
    flexBasis: 1,
    flexGrow: 1,
    borderRightColor: '#CCCCCC',
    borderRightWidth: 1,
    textAlign: 'center',
    backgroundColor: '#FFFFFF',
  },
  textInputBasic: {
    fontFamily: 'sans-serif-light',
    height: 50,
    padding: 10,
    borderTopColor: '#CCCCCC',
    borderTopWidth: 1,
    backgroundColor: '#FFFFFF',
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
    padding: 15,
    fontFamily: 'sans-serif-medium',
    fontSize: 15,
    borderBottomLeftRadius: 8,
  },
  modalButtonRight: {
    color: '#FFFFFF',
    backgroundColor: '#687DFC',
    flexBasis: 1,
    flexGrow: 1,
    padding: 15,
    fontFamily: 'sans-serif-medium',
    fontSize: 15,
    borderBottomRightRadius: 8,
  },
  listItem: {
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 20,
    marginRight: 20,
    fontSize: 15,
    color: '#000000',
  },
  textModalButton: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: 'sans-serif-light',
  },
  date: {
    flexBasis: 1,
    flexGrow: 1,
    borderTopRightRadius: 8,
  },
  dateText: {
    fontFamily: 'sans-serif-thin',
    fontSize: 12,
    textAlign: 'center',
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingLeft: 12,
    paddingRight: 12,
  },
  picker: {
    flexGrow: 1,
  },
});
