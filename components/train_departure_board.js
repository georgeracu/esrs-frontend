import React, {useState, useEffect} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {stations} from '../utils/stations';

const TrainDepartureBoardScreen = ({navigation}) => {
  const [station, setStation] = useState('');
  const [stationsSuggestions, setStationsSuggestions] = useState([]);
  const [departures, updateDepartures] = useState([]);
  const [isRefreshing, toggleIsRefreshing] = useState(false);

  useEffect(() => {
    async function getLiveTrainUpdates() {}
    getLiveTrainUpdates();
  }, []);

  /**
   * Returns matching stations
   * @param stationName
   */
  const searchStation = stationName => {
    setStation(stationName);
    const results = stations.names.filter(station => {
      return station.toLowerCase().startsWith(stationName.toLowerCase());
    });
    if (stationName === '') {
      setStationsSuggestions([]);
    } else {
      console.log(stationName);
      setStationsSuggestions(results.slice(0, 5));
    }
  };

  /**
   * Make a GET call to pull departure information about a particular station
   * @returns {Promise<void>}
   */
  const fetchDepartures = async () => {
    toggleIsRefreshing(true);
    if (station !== '') {
      fetch(`http://esrs.herokuapp.com/api/departures/${station.toLowerCase()}`)
        .then(response => response.json())
        .then(json => {
          let count = 0;
          const departures = json.trainServices.map(departure => {
            console.log(departure);
            return {
              id: `${++count}`,
              departName: departure.origin[0].locationName,
              destName: departure.destination[0].locationName,
              departCRS: departure.origin[0].crs,
              destCRS: departure.destination[0].crs,
              std: departure.std,
              etd: departure.etd,
              platform: departure.platform,
              operator: departure.operator,
              cancelReason: departure.cancelReason,
              delayReason: departure.delayReason,
            };
          });
          toggleIsRefreshing(false);
          updateDepartures(departures);
        });
    }
  };

  return (
    <View style={styles.root}>
      <View style={styles.navBar}>
        <Text style={styles.navBarText}>Departures</Text>
        <TouchableOpacity
          onPress={() => {
            navigation.reset({
              index: 0,
              routes: [{name: 'Tickets'}],
            });
          }}>
          <Text style={styles.closeButton}>close</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.searchIconContainer}>
        <TextInput
          value={station}
          placeholder="Station"
          style={styles.searchInput}
          onChangeText={text => searchStation(text)}
        />
        <TouchableOpacity
          onPress={() => fetchDepartures()}
          style={styles.searchIcon}>
          <Image source={require('../resources/search.png')} />
        </TouchableOpacity>
        <FlatList
          data={stationsSuggestions}
          keyExtractor={station => station}
          showsHorizontalScrollIndicator={true}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => {
                setStation(stations.stationsAndCodes.get(station));
                setStationsSuggestions([]);
              }}>
              <Text style={styles.listItem}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
      <FlatList
        data={departures}
        keyExtractor={departure => departure.id}
        contentContainerStyle={
          departures.length > 0 ? styles.emptyStateNull : styles.emptyState
        }
        ListEmptyComponent={() => (
          <Image source={require('../resources/empty_state.png')} />
        )}
        refreshing={isRefreshing}
        onRefresh={() => fetchDepartures()}
        renderItem={({item, index}) => (
          <View style={[styles.departureView, item.style]}>
            <View style={styles.journeyDetails}>
              <View style={styles.dotsContainer}>
                <Text style={styles.departCrs}>°</Text>
                <View style={styles.dots}>
                  <View style={styles.dot} />
                  <View style={styles.dot} />
                  <View style={styles.dot} />
                  <View style={styles.dot} />
                  <View style={styles.dot} />
                </View>
                <Text style={styles.arriveCrs}>°</Text>
              </View>
              <View style={styles.departureDetailContainer}>
                <View style={styles.departureDetails}>
                  <Text style={styles.departureText}>DEPARTURE</Text>
                  <Text style={styles.LocationName}>{item.departName}</Text>
                  <Text style={styles.boldDetails}>
                    ESTIMATED TIME: {item.etd}
                  </Text>
                  <Text style={styles.boldDetails}>
                    PLATFORM: {item.platform}
                  </Text>
                </View>
                <View style={styles.departureDetails}>
                  <Text style={styles.arrivalText}>ARRIVAL</Text>
                  <Text style={styles.LocationName}>{item.destName}</Text>
                </View>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default TrainDepartureBoardScreen;

const styles = StyleSheet.create({
  root: {
    padding: 20,
    backgroundColor: 'rgba(104, 126, 252, 0.1)',
    ...StyleSheet.absoluteFillObject,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navBarText: {
    fontWeight: 'bold',
    fontSize: 30,
    color: '#190320',
    fontFamily: 'sans-serif-thin',
  },
  searchIconContainer: {
    height: 60,
    marginTop: 10,
  },
  searchIcon: {
    position: 'absolute',
    right: 20,
    top: 20,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CCCCCC',
    borderRadius: 8,
    borderWidth: 1,
    padding: 20,
    fontFamily: 'sans-serif-light',
  },
  listItem: {
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 20,
    marginRight: 20,
    fontSize: 15,
    color: '#000000',
  },
  departureView: {
    flexDirection: 'row',
    marginTop: 10,
  },
  journeyDetails: {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    padding: 5,
    margin: 1,
    flex: 1,
    color: '#000000',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignContent: 'center',
  },
  emptyState: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateNull: {},
  dots: {
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  dot: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    margin: 5,
  },
  dotsContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
  },
  arriveCrs: {
    color: '#CCCCCC',
    fontWeight: 'bold',
  },
  departCrs: {
    fontWeight: 'bold',
    color: '#373759',
  },
  departureDetails: {
    flexDirection: 'column',
    padding: 10,
    marginLeft: 15,
  },
  departureText: {
    fontWeight: 'bold',
    fontSize: 10,
    color: '#373759',
  },
  arrivalText: {
    fontWeight: 'bold',
    fontSize: 10,
    color: '#CCCCCC',
  },
  LocationName: {
    fontWeight: 'bold',
    fontSize: 15,
    paddingTop: 3,
    letterSpacing: 1,
  },
  departureDetailContainer: {
    flexDirection: 'column',
  },
  closeButton: {
    backgroundColor: '#687DFC',
    borderRadius: 8,
    color: '#FFFFFF',
    padding: 8,
    textAlign: 'center',
  },
  boldDetails: {
    fontWeight: 'bold',
    fontSize: 11,
    color: '#687DFC',
  },
});
