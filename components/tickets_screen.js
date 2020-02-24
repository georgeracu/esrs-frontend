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

const TicketsScreen = ({navigation}) => {
  const [journeyFrom, setJourneyFrom] = useState('');
  const [journeyTo, setJourneyTo] = useState('');
  const [journeyDateTime, setJourneyDateTime] = useState('Select a date');
  const [journeyLocation, toggleJourneyLocation] = useState('JF'); // Were JF denotes journeyFrom and JT is journeyTo

  const [dateTimeMode, toggleDateTimeMode] = useState('date');
  const [shouldShowDateTime, toggleShowDateTime] = useState(false);

  const [display, setDisplay] = useState({
    isModalVisible: false,
    journeys: [],
  });
  const [stationsSuggestions, setStationsSuggestions] = useState([]);

  const stationsAndCodesJson = require('../resources/stations_and_codes');
  const stationsAndCodes = new Map();
  stationsAndCodesJson.forEach(stationAndCode => {
    stationsAndCodes.set(
      stationAndCode.key.toLowerCase(),
      stationAndCode.value,
    );
  });
  const stations = Array.from(stationsAndCodes.keys());

  /**
   * Returns matching stations
   * @param stationName
   */
  const search = stationName => {
    journeyLocation === 'JF'
      ? setJourneyFrom(stationName)
      : setJourneyTo(stationName);
    const results = stations.filter(station => {
      return station.startsWith(stationName.toLowerCase());
    });
    if (stationName === '') {
      setStationsSuggestions([]);
    } else {
      setStationsSuggestions(results.slice(0, 5));
    }
  };

  /**
   * Toggles the visibility of the modal
   * @param isVisible
   */
  const setModalVisibility = isVisible => {
    setDisplay({isModalVisible: isVisible, journeys: display.journeys});
  };

  /**
   * Adds a new journey
   */
  const addJourney = () => {
    const journey = {
      id: Math.random().toString(),
      from: journeyFrom,
      to: journeyTo,
    };
    const journeys = display.journeys;
    journeys.push(journey);
    setDisplay({isModalVisible: display.isModalVisible, ...journeys});
  };

  return (
    <View style={styles.root}>
      <View style={styles.viewSeeTravels}>
        <Text style={styles.textSeeTravels}>See your</Text>
        <Text style={styles.textSeeTravels}>travels</Text>
      </View>
      <View style={styles.ticketsSearchIconContainer}>
        <TextInput style={styles.textInputTicketsSearch} />
        <Image
          style={styles.ticketsSearchIcon}
          source={require('../resources/search.png')}
        />
      </View>
      <FlatList
        data={display.journeys}
        keyExtractor={journey => journey.id}
        renderItem={({item}) => (
          <View style={styles.journeyView}>
            <View style={styles.imageTrainLogoContainer}>
              <Image source={require('../resources/train_placeholder.png')} />
            </View>
            <View style={styles.journeyDetails}>
              <Text>{item.from}</Text>
              <Image source={require('../resources/arrow-circle-right.png')} />
              <Text>{item.to}</Text>
            </View>
          </View>
        )}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          setModalVisibility(!display.isModalVisible);
        }}>
        <Text style={styles.textPlusSymbol}>+</Text>
      </TouchableOpacity>
      <Modal isVisible={display.isModalVisible}>
        <View style={styles.modal}>
          <View style={styles.textInputContainer}>
            <TextInput
              value={journeyFrom}
              style={styles.textInputStationLeft}
              placeholder="Departure Station:"
              onChangeText={text => search(text)}
              onFocus={() => toggleJourneyLocation('JF')}
            />
            <TextInput
              value={journeyTo}
              style={styles.textInputStationRight}
              placeholder="Destination Station:"
              onChangeText={text => search(text)}
              onFocus={() => toggleJourneyLocation('JT')}
            />
          </View>
          <View style={styles.dateContainer}>
            <Image
              style={styles.dateIcon}
              source={require('../resources/date.png')}
            />
            <TouchableOpacity
              onPress={() => {
                toggleShowDateTime(true);
              }}>
              <Text style={styles.dateText}>{journeyDateTime}</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={stationsSuggestions}
            keyExtractor={station => station}
            renderItem={({item}) => (
              <Text
                style={styles.listItem}
                onPress={() => {
                  journeyLocation === 'JF'
                    ? setJourneyFrom(stationsAndCodes.get(item))
                    : setJourneyTo(stationsAndCodes.get(item));
                  setStationsSuggestions([]);
                }}>
                {item}
              </Text>
            )}
          />
          <View style={styles.modalButtonsContainer}>
            <TouchableOpacity
              style={styles.modalButtonLeft}
              onPress={() => {
                setStationsSuggestions([]);
                setJourneyFrom('');
                setJourneyTo('');
                setModalVisibility(false);
              }}>
              <Text style={styles.textModalButton}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButtonRight}
              onPress={() => {
                if (
                  journeyFrom === '' ||
                  journeyTo === '' ||
                  journeyDateTime === 'Select a date'
                ) {
                  Alert.alert(
                    'Add Journey',
                    'Oops, looks like you are missing something',
                  );
                } else {
                  addJourney();
                  setJourneyFrom('');
                  setJourneyTo('');
                  setModalVisibility(false);
                }
              }}>
              <Text style={styles.textModalButton}>Add Journey</Text>
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
              } else if (dateTimeMode === 'time') {
                toggleShowDateTime(false);
                toggleDateTimeMode('date');
                setJourneyDateTime(moment(newDate).format('DD-MM-YYYY HH:mm'));
              }
            }
          }}
        />
      )}
    </View>
  );
};

export default TicketsScreen;

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
