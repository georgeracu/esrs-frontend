import React, {useState, useEffect, useRef} from 'react';
import {
  Alert,
  AsyncStorage,
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
import {sha256} from 'react-native-sha256';

const TicketsScreen = ({navigation}) => {
  const [deleteIconVisibility, toggleDeleteIconVisibility] = useState('hidden');
  const [journeyFrom, setJourneyFrom] = useState('');
  const [journeyTo, setJourneyTo] = useState('');
  const [journeyDay, setJourneyDate] = useState(
    moment(new Date()).format('DD-MM-YYYY'),
  );
  const [journeyTime, setJourneyTime] = useState(
    moment(new Date()).format('HH:mm'),
  );
  const [journeyLocation, toggleJourneyLocation] = useState('JF'); // Were JF denotes journeyFrom and JT is journeyTo

  const [dateTimeMode, toggleDateTimeMode] = useState('date');
  const [shouldShowDateTime, toggleShowDateTime] = useState(false);

  const [isModalVisible, toggleModalVisibility] = useState(false);

  const [journeys, setJourneys] = useState([]);

  const [id, setId] = useState('');

  useEffect(() => {
    async function getPersistedJourneys() {
      setId(await AsyncStorage.getItem('id'));
      const persistedJourneys = await AsyncStorage.getItem('journeys');
      if (persistedJourneys != null) {
        const parsedJourneysJson = JSON.parse(persistedJourneys);
        const modifiedJourneys = parsedJourneysJson.map(journey => {
          journey.isSelected = false;
          journey.style = styles.journeyView;
          return journey;
        });
        setJourneys(modifiedJourneys);
      }
    }
    getPersistedJourneys();
  }, []);

  const [stationsSuggestions, setStationsSuggestions] = useState([]);

  const stationsAndCodesJson = require('../resources/stations_and_codes');
  const stationsAndCodes = new Map();
  stationsAndCodesJson.forEach(stationAndCode => {
    stationsAndCodes.set(stationAndCode.key, stationAndCode.value);
  });
  const stations = Array.from(stationsAndCodes.keys());
  const stationsCodes = Array.from(stationsAndCodes.values());

  /**
   * Returns matching stations
   * @param stationName
   */
  const search = stationName => {
    journeyLocation === 'JF'
      ? setJourneyFrom(stationName)
      : setJourneyTo(stationName);
    const results = stations.filter(station => {
      return station.toLowerCase().startsWith(stationName);
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
  const addJourney = async () => {
    const journeyDetails = `${journeyFrom}${journeyTo}${journeyDay}${journeyTime}`;
    const hash = await sha256(journeyDetails);
    const journey = {
      journey_id: hash,
      journey_from: journeyFrom,
      journey_to: journeyTo,
      journey_datetime: `${journeyDay} ${journeyTime}`,
    };
    const response = await fetch(
      'http://esrs.herokuapp.com/api/auth/user/journey',
      {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          user_id: id,
        },
        body: JSON.stringify(journey),
      },
    );

    if (response.status === 200) {
      setJourneys([...journeys, journey]);
      AsyncStorage.setItem('journeys', JSON.stringify([...journeys, journey]));
    }
  };

  /**
   * Selects a journey item
   * @param item
   */
  const selectJourney = item => {
    item.isSelected = !item.isSelected;
    item.style = item.isSelected
      ? styles.journeyViewSelected
      : styles.journeyView;
    const index = journeys.findIndex(
      value => value.journey_id === item.journey_id,
    );
    journeys[index] = item;
    setJourneys([...journeys]);
  };

  return (
    <View style={styles.root}>
      <View style={styles.seeTravelsContainer}>
        <View style={styles.viewSeeTravels}>
          <Text style={styles.textSeeTravels}>See your</Text>
          <Text style={styles.textSeeTravels}>journeys</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            const unselectedJourneys = journeys.filter(
              journey => !journey.isSelected,
            );
            setJourneys(unselectedJourneys);
            AsyncStorage.setItem(
              'journeys',
              JSON.stringify(unselectedJourneys),
            );
          }}>
          <Image
            style={'visibility: hidden'}
            source={require('../resources/delete.png')}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.ticketsSearchIconContainer}>
        <TextInput style={styles.textInputTicketsSearch} />
        <Image
          style={styles.ticketsSearchIcon}
          source={require('../resources/search.png')}
        />
      </View>
      <FlatList
        data={journeys}
        extraData={journeys}
        keyExtractor={journey => journey.journey_id}
        renderItem={({item, index}) => (
          <TouchableOpacity
            onPress={() => {
              const selectedJourneys = journeys.filter(
                journey => journey.isSelected,
              );
              if (selectedJourneys.length > 0) {
                selectJourney(item);
              } else {
                navigation.navigate('TicketDashboard', {
                  id: journeys[index].journey_id,
                  from: journeys[index].journey_from,
                  to: journeys[index].journey_to,
                  dateTime: journeys[index].journey_datetime,
                });
              }
            }}
            onLongPress={() => {
              selectJourney(item);
            }}>
            <View style={[styles.journeyView, item.style]}>
              <View style={styles.imageTrainLogoContainer}>
                <Image source={require('../resources/train_placeholder.png')} />
              </View>
              <View style={styles.journeyDetails}>
                <Text>{item.journey_from}</Text>
                <Image
                  source={require('../resources/arrow-circle-right.png')}
                />
                <Text>{item.journey_to}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          toggleModalVisibility(!isModalVisible);
        }}>
        <Text style={styles.textPlusSymbol}>+</Text>
      </TouchableOpacity>
      <Modal isVisible={isModalVisible}>
        <View style={styles.modal}>
          <View style={styles.textInputContainer}>
            <TextInput
              value={journeyFrom}
              style={styles.textInputStationLeft}
              placeholder="Departure Station:"
              onChangeText={text => search(text.toLowerCase())}
              onFocus={() => toggleJourneyLocation('JF')}
            />
            <TextInput
              value={journeyTo}
              style={styles.textInputStationRight}
              placeholder="Destination Station:"
              onChangeText={text => search(text.toLowerCase())}
              onFocus={() => toggleJourneyLocation('JT')}
            />
          </View>
          <FlatList
            data={stationsSuggestions}
            keyExtractor={station => station}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() => {
                  journeyLocation === 'JF'
                    ? setJourneyFrom(stationsAndCodes.get(item))
                    : setJourneyTo(stationsAndCodes.get(item));
                  setStationsSuggestions([]);
                }}>
                <Text style={styles.listItem}>{item}</Text>
              </TouchableOpacity>
            )}
          />
          <View style={styles.dateContainer}>
            <Image
              style={styles.dateIcon}
              source={require('../resources/date.png')}
            />
            <TouchableOpacity
              onPress={() => {
                toggleShowDateTime(true);
              }}>
              <Text style={styles.dateText}>
                {journeyDay + ' ' + journeyTime}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.modalButtonsContainer}>
            <TouchableOpacity
              style={styles.modalButtonLeft}
              onPress={() => {
                setStationsSuggestions([]);
                setJourneyFrom('');
                setJourneyTo('');
                setJourneyDate(moment(new Date()).format('DD-MM-YYYY'));
                setJourneyTime(moment(new Date()).format('HH:mm'));
                toggleModalVisibility(false);
              }}>
              <Text style={styles.textModalButton}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButtonRight}
              onPress={() => {
                if (
                  !stationsCodes.includes(journeyFrom) ||
                  !stationsCodes.includes(journeyTo)
                ) {
                  Alert.alert(
                    'Add Journey',
                    'Oops, looks like you are missing something',
                  );
                } else {
                  addJourney();
                  setJourneyFrom('');
                  setJourneyTo('');
                  setJourneyDate(moment(new Date()).format('DD-MM-YYYY'));
                  setJourneyTime(moment(new Date()).format('HH:mm'));
                  toggleModalVisibility(false);
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
                setJourneyDate(moment(newDate).format('DD-MM-YYYY'));
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

export default TicketsScreen;

const styles = StyleSheet.create({
  root: {
    padding: 20,
    backgroundColor: 'rgba(104, 126, 252, 0.1)',
    ...StyleSheet.absoluteFillObject,
  },
  seeTravelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  journeyViewSelected: {
    opacity: 0.5,
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
