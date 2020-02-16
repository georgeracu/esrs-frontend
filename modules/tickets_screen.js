import React, {Component} from 'react';
import {
  ScrollView,
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
    this.state = {
      isModalVisible: false,
    };
  }

  /**
   *
   * @param isVisible
   */
  setModalVisibility(isVisible) {
    this.setState({
      isModalVisible: isVisible,
    });
  }

  render() {
    return (
      <View style={styles.root}>
        <View style={styles.viewSeeTravels}>
          <Text style={styles.textSeeTravels}>See your</Text>
          <Text style={styles.textSeeTravels}>travels</Text>
        </View>
        <TextInput
          style={styles.textInputTicketsSearch}
          ref={component => (this.textInputTicketsSearch = component)}
        />
        <ScrollView />
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
              />
              <TextInput
                style={styles.textInputStation}
                placeholder="Destination Station:"
                ref={component => (this.textInputDestStation = component)}
              />
            </View>
            <Text style={styles.selectDate}>Select Date</Text>
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity onPress={() => this.setModalVisibility(false)}>
                <Text style={styles.modalButton}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity>
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
  textInputTicketsSearch: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CCCCCC',
    borderRadius: 8,
    borderWidth: 1,
    height: 60,
    padding: 20,
    fontFamily: 'sans-serif-light',
    marginTop: 10,
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
});
