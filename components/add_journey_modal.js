import React, {useState} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import DateTimePicker from '@react-native-community/datetimepicker';

const AddJourneyModal = props => {
  const [dateTimeMode, toggleDateTimeMode] = useState('date');
  const [shouldShowDateTime, toggleShowDateTime] = useState(false);

  return (
    <View>
      <Modal isVisible={props.visible}>
        <View style={styles.modal}>
          <View style={styles.textInputContainer}>
            <TextInput
              value={props.departStation}
              style={[styles.textInputBasic, styles.textInputStationLeft]}
              placeholder="Depart"
              onChangeText={text => props.onSearchStation(text)}
              onFocus={() => props.onDepartStationInputFocus()}
            />
            <TextInput
              value={props.destStation}
              style={[styles.textInputBasic, styles.textInputStationRight]}
              placeholder="Dest"
              onChangeText={text => props.onSearchStation(text)}
              onFocus={() => props.onDestStationInputFocus()}
            />
            <TouchableOpacity
              style={styles.date}
              onPress={() => toggleShowDateTime(true)}>
              <Text style={styles.dateText}>
                {props.journeyDay} {props.journeyTime}
              </Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={props.stations}
            keyExtractor={station => station}
            showsHorizontalScrollIndicator={true}
            renderItem={({item}) => (
              <TouchableOpacity onPress={() => props.onSelectStation(item)}>
                <Text style={styles.listItem}>{item}</Text>
              </TouchableOpacity>
            )}
          />
          <View style={styles.textInputContainer}>
            <TextInput
              value={props.ticketNumber}
              style={[styles.textInputBasic, styles.textInputNumRight]}
              placeholder="Ticket Number"
              onChangeText={text => props.onTicketNumberChange(text)}
            />

            <TextInput
              value={props.ticketPrice}
              style={styles.textInputBasic}
              placeholder="Ticket Price"
              keyboardType={'numeric'}
              onChangeText={text => props.onTicketPriceChange(text)}
            />
          </View>

          <View style={styles.modalButtonsContainer}>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => props.openOCR()}>
              <Text style={styles.textModalButton}>Auto-Fill From Ticket</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalButtonsContainer}>
            <TouchableOpacity
              style={styles.modalButtonLeft}
              onPress={() => props.onCancel()}>
              <Text style={styles.textModalButton}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButtonRight}
              onPress={() => props.onAddJourney()}>
              <Text style={styles.textModalButton}>
                {props.positiveButtonName}
              </Text>
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
                props.onSetJourneyDay(newDate);
              } else if (dateTimeMode === 'time') {
                toggleShowDateTime(false);
                toggleDateTimeMode('date');
                props.onSetJourneyTime(newDate);
              }
            }
          }}
        />
      )}
    </View>
  );
};

export default AddJourneyModal;

const styles = StyleSheet.create({
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    maxHeight: 400,
    elevation: 15,
    zIndex: 5,
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
  textInputNumRight: {
    flexBasis: 1,
    flexGrow: 1,
    textAlign: 'center',
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
  modalButton: {
    color: '#FFFFFF',
    backgroundColor: '#255C99',
    flexBasis: 1,
    flexGrow: 1,
    padding: 15,
    fontFamily: 'sans-serif-medium',
    fontSize: 15,
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
    borderBottomColor: '#CCCCCC',
    borderBottomWidth: 1,
    justifyContent: 'center',
    height: 50,
  },
  dateText: {
    fontFamily: 'sans-serif-thin',
    fontSize: 12,
    textAlign: 'center',
  },
});
