import React, {Component} from 'react';
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

export default class TicketsScreen extends Component {
  constructor(props) {
    super(props);
    this.journeyFrom = '';
    this.journeyTo = '';
    this.state = {
      isModalVisible: false,
      journeys: [],
    };
  }

  /**
   * Toggles the visibility of the modal
   * @param isVisible
   */
  setModalVisibility(isVisible) {
    this.setState({
      isModalVisible: isVisible,
    });
  }

  /**
   * Adds a new journey
   */
  addJourney() {
    const journey = {
      id: Math.random().toString(),
      from: this.journeyFrom,
      to: this.journeyTo,
    };
    const journeys = this.state.journeys;
    journeys.push(journey);
    this.setState({
      ...journeys,
    });
  }

  render() {
    return (
      <View style={styles.root}>
        <View style={styles.viewSeeTravels}>
          <Text style={styles.textSeeTravels}>See your</Text>
          <Text style={styles.textSeeTravels}>travels</Text>
        </View>
        <View style={styles.ticketsSearchIconContainer}>
          <TextInput
            style={styles.textInputTicketsSearch}
            ref={component => (this.textInputTicketsSearch = component)}
          />
          <Image
            style={styles.ticketsSearchIcon}
            source={require('../resources/search.png')}
          />
        </View>
        <FlatList
          data={this.state.journeys}
          keyExtractor={journey => journey.id}
          renderItem={({item}) => (
            <View style={styles.journeyView}>
              <View style={styles.imageTrainLogoContainer}>
                <Image source={require('../resources/train_placeholder.png')} />
              </View>
              <View style={styles.journeyDetails}>
                <Text>{item.from}</Text>
                <Image
                  source={require('../resources/arrow-circle-right.png')}
                />
                <Text>{item.to}</Text>
              </View>
            </View>
          )}
        />
        <TouchableOpacity
          style={styles.fab}
          onPress={() => {
            this.setModalVisibility(!this.state.isModalVisible);
          }}>
          <Text style={styles.textPlusSymbol}>+</Text>
        </TouchableOpacity>
        <Modal isVisible={this.state.isModalVisible} hasBackdrop={false}>
          <View style={styles.modal}>
            <View>
              <TextInput
                style={styles.textInputStation}
                placeholder="Departure Station:"
                ref={component => (this.textInputDepartStation = component)}
                onChangeText={text => (this.journeyFrom = text)}
              />
              <TextInput
                style={styles.textInputStation}
                placeholder="Destination Station:"
                ref={component => (this.textInputDestStation = component)}
                onChangeText={text => (this.journeyTo = text)}
              />
            </View>
            <Text style={styles.selectDate}>Select Date</Text>
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity onPress={() => this.setModalVisibility(false)}>
                <Text style={styles.modalButton}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.addJourney();
                  this.setModalVisibility(false);
                }}>
                <Text style={styles.modalButton}>Add Journey</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

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
    backgroundColor: 'rgb(104, 126, 252)',
    borderRadius: 8,
    padding: 15,
  },
  textInputStation: {
    borderColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 2,
    height: 50,
    padding: 10,
    margin: 5,
    backgroundColor: '#FFFFFF',
    fontFamily: 'sans-serif-light',
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
  modalButton: {
    color: '#FFFFFF',
    fontFamily: 'sans-serif-medium',
    margin: 5,
    fontSize: 15,
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
});
