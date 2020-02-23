import React, {useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';

const TicketsScreen = ({navigation}) => {
  const [journeyFrom, setJourneyFrom] = useState('');
  const [journeyTo, setJourneyTo] = useState('');
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
      <Modal isVisible={display.isModalVisible} hasBackdrop={false}>
        <View style={styles.modal}>
          <View style={styles.departDestContainer}>
            <TextInput
              style={styles.textInputStationLeft}
              placeholder="Departure Station:"
              onChangeText={text => search(text)}
            />
            <TextInput
              style={styles.textInputStationRight}
              placeholder="Destination Station:"
              onChangeText={text => search(text)}
            />
          </View>
          <FlatList
            data={stationsSuggestions}
            renderItem={({item}) => <Text style={styles.listItem}>{item}</Text>}
          />
          <Text style={styles.selectDate}>Select Date</Text>
          <View style={styles.modalButtonsContainer}>
            <TouchableOpacity style={styles.modalButtonLeft} onPress={() => setModalVisibility(false)}>
              <Text style={styles.textModalButton}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.modalButtonRight}
                onPress={() => {
                addJourney();
                setModalVisibility(false);
              }}>
              <Text style={styles.textModalButton}>Add Journey</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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

  },
  textInputStationLeft: {
    height: 60,
    padding: 20,
    flexBasis: 1,
    flexGrow: 1,
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
    padding: 10,
    fontFamily: 'sans-serif-medium',
    fontSize: 15,
    borderBottomLeftRadius: 8,
  },
  modalButtonRight: {
    color: '#FFFFFF',
    backgroundColor: '#687DFC',
    flexBasis: 1,
    flexGrow: 1,
    padding: 10,
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
    margin: 5,
    color: '#FFFFFF',
  },
  departDestContainer: {
    flexDirection: 'row',
    borderColor: '#FFFFFF',
    borderRadius: 8,
    fontFamily: 'sans-serif-light',
  },
  textModalButton: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: 'sans-serif-medium',
  },
});
