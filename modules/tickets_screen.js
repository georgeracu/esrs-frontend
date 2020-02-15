import React, {Component} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default class TicketsScreen extends Component {
  constructor(props) {
    super(props);
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
        <TouchableOpacity style={styles.fab}>
          <Text style={styles.textPlusSymbol}>+</Text>
        </TouchableOpacity>
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
});
