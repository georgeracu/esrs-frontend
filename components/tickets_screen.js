import React, {useState, useEffect} from 'react';
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
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import {sha256} from 'react-native-sha256';
import {stations} from '../utils/stations';
import AddJourneyModal from './add_journey_modal';
import RNMlKit from 'react-native-firebase-mlkit';
import ImagePicker from 'react-native-image-picker';
import * as Progress from 'react-native-progress';


const TicketsScreen = ({navigation}) => {
  const [selectedJourneysCount, updateSelectedJourneyCount] = useState(0);
  const [journeyFrom, setJourneyFrom] = useState('');
  const [journeyTo, setJourneyTo] = useState('');
  const [journeyDay, setJourneyDay] = useState('DD-MM-YYYY');
  const [journeyTime, setJourneyTime] = useState('HH:mm');
  const [journeyLocation, toggleJourneyLocation] = useState('JF'); // Were JF denotes journeyFrom and JT is journeyTo

  const [ticketNumber, setTicketNumber] = useState('');
  const [ticketPrice, setTicketPrice] = useState('');

  const [isModalVisible, toggleModalVisibility] = useState(false);

  const [journeys, setJourneys] = useState([]);

  const [id, setId] = useState('');

  const [stationsSuggestions, setStationsSuggestions] = useState([]);

  const [ticketImage, setTicketImage] = useState({});

  const [loading, setLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

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

  /**
   * Gets image from camera or gallery
   */
  const options = {
    title: 'Get A Ticket Picture',
  };

  const getImage = async () => {
    
    cancelJourney();
    toggleModalVisibility(true);
    
    

    ImagePicker.showImagePicker(options, async response => {
      //console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
        setLoading(false);
        //return false;
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        setLoading(false);
        //return false;
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        setLoading(false);
        //return false;
      } else {
        const source = {
          uri: response.uri,
          data: response.data,
          name: response.fileName,
        };
        setTicketImage(source);
        const deviceTextRecognition = await RNMlKit.deviceTextRecognition(
          response.uri,
        );
        /*console.log('HELLO');
        console.log(
          'Text Recognition On-Device',
          deviceTextRecognition[4].resultText,
        );
        console.log('HELLO', deviceTextRecognition.length);*/
        setLoading(true);
        for (let i = 0; i < 2; i++) {
          setLoadProgress(i/deviceTextRecognition.length);
          const array = deviceTextRecognition[i].resultText.split('\n');
          for (var x in array) {

            var str = array[x];
            if(String(str).split(' ')[0] == "National" || String(str).split(' ')[0] == "Rail" || String(str).split(' ')[0] == "ail" 
            || String(str).split(' ')[0] == "ional" || String(str).split(' ')[0] == "onal" || String(str).split(' ')[0] == "Nati" 
            || String(str).split(' ')[0] == "al" || String(str).split(' ')[0] == "Ra" || String(str).split(' ')[0] == "tional"
            || String(str).split(' ')[0] == "nal" || String(str).split(' ')[0] == "ational" || String(str).split(' ')[0] == "lail"
            || String(str).split(' ')[0] == "Na" || String(str).split(' ')[0] == "pnal" || String(str).split(' ')[0] == "Bail"
            || String(str).split(' ')[0] == "Date" || String(str).split(' ')[0] == "Refundable" || String(str).split(' ')[0] == "Adult"
            || String(str).split(' ')[0] == "Valid" || String(str).split(' ')[0] == "D" || String(str).split(' ')[0] == "Hal"
            || String(str).split(' ')[0] == "at" || String(str).split(' ')[0] == "Rl" || String(str).split(' ')[0] == "tion"
            || String(str).split(' ')[0] == "Anytime" || String(str).split(' ')[0] == "aNational" || String(str).split(' ')[0] == "ait"
            || String(str).split(' ')[0] == "mal" || String(str).split(' ')[0] == "al1d") {
              continue;
            }

            console.log(array[x]);

            if(ticketNumber == '') {
              var pattern = new RegExp('^[0-9-]*$');
              var res = pattern.test(str);
              if (res) {
                setTicketNumber(String(array[x]));
              }
            }

            if(journeyDay == 'DD-MM-YYYY' || journeyTime == 'HH:mm') {
              var pattern = new RegExp('^[0-9]*:');
              var res = pattern.test(str);
              if (res) {
                let time = String(array[x]);
                let date = time.split(':')[1];
                time = time.split(':')[0];
                time = time.slice(0, 2) + ':' + time.slice(2);
                setJourneyTime(time);

                let dateFormat = date.slice(2,4) + "/" + date.slice(0,2) + "/20" + date.slice(4,6);
                let daytime = moment(new Date(dateFormat)).format('DD-MM-YYYY');
                setJourneyDay(daytime);
              }

              var pattern = new RegExp('^[0-9]* ');
              var res = pattern.test(str);
              if (res) {
                let time = String(array[x]);
                let date = time.split(' ')[1];
                time = time.split(' ')[0];
                time = time.slice(0, 2) + ':' + time.slice(2);
                setJourneyTime(time);

                let dateFormat = date.slice(2,4) + "/" + date.slice(0,2) + "/20" + date.slice(4,6);
                let daytime = moment(new Date(dateFormat)).format('DD-MM-YYYY');
                setJourneyDay(daytime);
              }
            }

            if(ticketPrice == '') {
              var pattern = new RegExp('£+');
              var res = pattern.test(str);
              if (res) {
                let price = String(array[x]);
                price = price.split('£')[1];
                price = price.split('X')[0];
                price = price.split('K')[0];
                price = price.trim();
                price = price.replace(' ', '.');
                setTicketPrice(price);
              } 

              var pattern = new RegExp('f+');
              var res = pattern.test(str);
              if (res) {
                let price = String(array[x]);
                price = price.split('f')[1];
                price = price.split('X')[0];
                price = price.split('K')[0];
                price = price.trim();
                price = price.replace(' ', '.');
                setTicketPrice(price);
              }

              var pattern = new RegExp('^[0-9.]* X+$');
              var res = pattern.test(str);
              if (res) {
                let price = String(array[x]);
                price = price.split('X')[0];
                price = price.split('K')[0];
                price = price.trim();
                setTicketPrice(price);
              }
            }


            if(journeyTo == '' || journeyFrom == '') {
              if (str.split(' ')[0] == 'to' || str.split(' ')[0] == 'from' || str.split(' ')[0] == 'fron') {
                for (let i = 0; i < stations.names.length; i++) {
                  const key = stations.names[i];
                  const regex = /^\w+( \w+| \&+)*/g;
                  const found = key.match(regex);
                  const from = array[x].substring(5).split(" ")[0];
                  var to = array[x].substring(3).split(" ")[0];
                  if (String(found[0]) == String(from)) {
                    console.log(stations.codes[i]);
                    setJourneyFrom(String(stations.codes[i]));
                  }
                  if (String(found[0]) == String(to)) {
                    console.log(stations.codes[i]);
                    setJourneyTo(String(stations.codes[i]));
                  }
                }
              }
            }
          }
        }
        setLoading(false);
      }
    });
  };

  /**
   * Returns matching stations
   * @param stationName
   */
  const searchStation = stationName => {
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
  const addJourney = async () => {
    const isValid = validateJourney();
    if (isValid) {
      const journeyDetails = `${journeyFrom}${journeyTo}${journeyDay}${journeyTime}`;
      const hash = await sha256(journeyDetails);
      const journey = {
        journey_id: hash,
        journey_from: journeyFrom,
        journey_to: journeyTo,
        journey_datetime: `${journeyDay} ${journeyTime}`,
        ticket_price: ticketPrice,
        ticket_number: ticketNumber,
      };
      setJourneys([...journeys, journey]);

      // Clear inputs
      setJourneyFrom('');
      setJourneyTo('');
      setTicketNumber('');
      setTicketPrice('');
      setJourneyDay('DD-MM-YYYY');
      setJourneyTime('HH:mm');
      setLoading(false);

      AsyncStorage.setItem('journeys', JSON.stringify([...journeys, journey]));

      delete journey.isSelected;
      delete journey.style;

      toggleModalVisibility(false);

      // fetch('http://esrs.herokuapp.com/api/auth/user/journey', {
      //   method: 'PUT',
      //   headers: {
      //     Accept: 'application/json',
      //     'Content-Type': 'application/json',
      //     user_id: id,
      //   },
      //   body: JSON.stringify(journey),
      // });
    }
  };

  /**
   * Validate journey inputs
   */
  const validateJourney = () => {
    let isValid = true;
    if (
      !stations.codes.includes(journeyFrom) ||
      !stations.codes.includes(journeyTo) ||
      ticketNumber === '' ||
      ticketPrice === '' ||
      (journeyDay === 'DD-MM-YYYY' && journeyTime === 'HH:mm')
    ) {
      Alert.alert('Add Journey', 'Oops, looks like you are missing something');
      isValid = false;
    } else if (journeyFrom === journeyTo) {
      Alert.alert(
        'Add Journey',
        "Oops, Departure and Destination can't be same",
      );
      isValid = false;
    }
    return isValid;
  };

  /**
   * Cancel adding a journey
   */
  const cancelJourney = () => {
    setStationsSuggestions([]);
    setJourneyFrom('');
    setJourneyTo('');
    setTicketNumber('');
    setTicketPrice('');
    setJourneyDay('DD-MM-YYYY');
    setJourneyTime('HH:mm');
    toggleModalVisibility(false);
    setLoading(false);
  };

  /**
   * Selects a journey item and updates the count
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
    const selectedJourneys = journeys.filter(journey => journey.isSelected);
    updateSelectedJourneyCount(selectedJourneys.length);
  };

  /**
   * Delete journey(s)
   */
  const deleteJourney = () => {
    Alert.alert(
      'Delete Journey',
      'Are you sure you want to delete your journeys?',
      [
        {
          text: 'No',
          onPress: () => {
            updateSelectedJourneyCount(0);
            journeys.map(journey => {
              if (journey.isSelected) {
                journey.isSelected = false;
                journey.style = styles.journeyView;
              }
            });
            setJourneys([]);
            setJourneys([...journeys]);
          },
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            const unselectedJourneys = journeys.filter(
              journey => !journey.isSelected,
            );
            setJourneys(unselectedJourneys);
            updateSelectedJourneyCount(0);
            AsyncStorage.setItem(
              'journeys',
              JSON.stringify(unselectedJourneys),
            );
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
      <View style={styles.seeTravelsContainer}>
        <View style={styles.viewSeeTravels}>
          <Text style={styles.textSeeTravels}>See your</Text>
          <Text style={styles.textSeeTravels}>journeys</Text>
          <Progress.Bar progress={0.3} width={100} />
        </View>
        <TouchableOpacity
          onPress={() => {
            deleteJourney();
          }}>
          {selectedJourneysCount > 0 ? (
            <Image source={require('../resources/delete.png')} />
          ) : null}
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
        contentContainerStyle={
          journeys.length > 0 ? styles.emptyStateNull : styles.emptyState
        }
        ListEmptyComponent={() => (
          <Image source={require('../resources/empty_state.png')} />
        )}
        renderItem={({item, index}) => (
          <TouchableOpacity
            onPress={() => {
              if (selectedJourneysCount > 0) {
                selectJourney(item);
              }
              if (selectedJourneysCount === 0) {
                navigation.navigate('TicketDashboard', {
                  id: journeys[index].journey_id,
                  from: journeys[index].journey_from,
                  to: journeys[index].journey_to,
                  dateTime: journeys[index].journey_datetime,
                  type: journeys[index].ticket_type,
                  price: journeys[index].ticket_price,
                  number: journeys[index].ticket_number,
                });
              }
            }}
            onLongPress={() => {
              selectJourney(item);
            }}>
            <View style={[styles.journeyView, item.style]}>
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
        style={[styles.fab, {bottom: 100}]}
        onPress={() => {
          navigation.navigate('TrainDepartureBoard');
        }}>
        <Image source={require('../resources/train.png')} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          toggleModalVisibility(!isModalVisible);
        }}>
        <Text style={styles.textPlusSymbol}>+</Text>
      </TouchableOpacity>
      <AddJourneyModal
        openOCR={getImage}
        visible={isModalVisible}
        onCancel={cancelJourney}
        onAddJourney={addJourney}
        onSearchStation={searchStation}
        onDepartStationInputFocus={() => toggleJourneyLocation('JF')}
        onDestStationInputFocus={() => toggleJourneyLocation('JT')}
        stations={stationsSuggestions}
        onSelectStation={station => {
          journeyLocation === 'JF'
            ? setJourneyFrom(stations.stationsAndCodes.get(station))
            : setJourneyTo(stations.stationsAndCodes.get(station));
          setStationsSuggestions([]);
        }}
        onTicketNumberChange={number => setTicketNumber(number)}
        onTicketPriceChange={price => setTicketPrice(price)}
        onSetJourneyDay={newDate =>
          setJourneyDay(moment(newDate).format('DD-MM-YYYY'))
        }
        onSetJourneyTime={newDate =>
          setJourneyTime(moment(newDate).format('HH:mm'))
        }
        departStation={journeyFrom}
        destStation={journeyTo}
        journeyDay={journeyDay}
        journeyTime={journeyTime}
        ticketNumber={ticketNumber}
        ticketPrice={ticketPrice}
        load={loading}
        loadNum={loadProgress}
        onLoad={num => setLoading(num)}
        onLoadNum={num => setLoadProgress(num)}
        positiveButtonName="Add Journey"
      />
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
    elevation: 10,
  },
  textPlusSymbol: {
    fontSize: 30,
    color: '#FFFFFF',
  },
  textInputContainer: {
    flexDirection: 'row',
    borderBottomColor: '#CCCCCC',
    justifyContent: 'space-around',
    alignItems: 'center',
    fontFamily: 'sans-serif-light',
  },
  textInputStationLeft: {
    flexBasis: 1,
    flexGrow: 1,
    borderRightColor: '#CCCCCC',
    borderRightWidth: 1,
    textAlign: 'center',
    borderTopLeftRadius: 8,
    borderBottomColor: '#CCCCCC',
    borderBottomWidth: 1,
  },
  textInputStationRight: {
    flexBasis: 1,
    flexGrow: 1,
    borderRightColor: '#CCCCCC',
    borderRightWidth: 1,
    textAlign: 'center',
    borderBottomColor: '#CCCCCC',
    borderBottomWidth: 1,
  },
  textInputBasic: {
    fontFamily: 'sans-serif-light',
    height: 50,
    padding: 10,
    backgroundColor: '#FFFFFF',
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
  journeyView: {
    flexDirection: 'row',
    marginTop: 10,
    height: 80,
  },
  journeyViewSelected: {
    opacity: 0.5,
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
  emptyState: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateNull: {},
});
