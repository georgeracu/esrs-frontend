import React, {useEffect} from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-community/async-storage';

const TicketDashboard = ({route, navigation}) => {
  const {id, from, to, dateTime} = route.params;

  useEffect(() => {
    messaging().onMessage(remoteMessage => {
      console.log('FCM Message Data:', JSON.stringify(remoteMessage));
    });
  }, []);

  /**
   * Delete journey
   */
  const deleteJourney = async () => {
    const journeys = await AsyncStorage.getItem('journeys');
    const parsedJourneys = JSON.parse(journeys);
    const otherJourneys = parsedJourneys.filter(
      journey => journey.journey_id !== id,
    );

    await AsyncStorage.setItem('journeys', JSON.stringify(otherJourneys));
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
  };

  return (
    <View style={styles.root}>
      <ImageBackground
        source={require('../resources/wallpaper.png')}
        style={styles.topView}
      />
      <View style={styles.darkContainer}>
        <View style={styles.darkContainerContents}>
          <Text style={styles.darkContainerTxt}>
            Ticket: 12345dfsdgw4etryhgfd
          </Text>
          <Image
            style={styles.dateIcon}
            source={require('../resources/ticket.png')}
          />
        </View>
      </View>
      <View style={styles.ticketDetailsContainer}>
        <View style={styles.ticketDetailView}>
          <Image
            style={styles.dateIcon}
            source={require('../resources/arrow.png')}
          />
          <View style={styles.ticketDetailTextContainer}>
            <Text style={styles.ticketDetailLabelText}>From</Text>
            <Text style={styles.ticketDetailText}>{from}</Text>
          </View>
        </View>
        <View style={styles.ticketDetailView}>
          <Image
            style={styles.dateIcon}
            source={require('../resources/map_pin.png')}
          />
          <View style={styles.ticketDetailTextContainer}>
            <Text style={styles.ticketDetailLabelText}>To</Text>
            <Text style={styles.ticketDetailText}>{to}</Text>
          </View>
        </View>
        <View style={styles.ticketDetailView}>
          <Image
            style={styles.dateIcon}
            source={require('../resources/tiny_date.png')}
          />
          <View style={styles.ticketDetailTextContainer}>
            <Text style={styles.ticketDetailLabelText}>Date</Text>
            <Text style={styles.ticketDetailText}>{dateTime}</Text>
          </View>
        </View>
      </View>
      <View style={styles.ticketButtonsContainer}>
        <TouchableOpacity onPress={deleteJourney}>
          <View style={styles.deleteBtn}>
            <Text style={styles.claimSubmissionBtnTxt}>Delete</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View style={styles.claimSubmissionBtn}>
            <Text style={styles.claimSubmissionBtnTxt}>Submit claim</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TicketDashboard;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'space-around',
  },
  topView: {
    backgroundColor: '#687DFC',
    padding: 20,
    flexGrow: 3,
  },
  darkContainer: {
    backgroundColor: '#373759',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    flexGrow: 1,
    marginTop: -30,
  },
  darkContainerContents: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
  },
  darkContainerTxt: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  ticketDetailsContainer: {
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    backgroundColor: '#DCDCF0',
    padding: 20,
    marginTop: -30,
    flexGrow: 1,
  },
  ticketDetailView: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    padding: 20,
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
    padding: 30,
    marginTop: -30,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  claimSubmissionBtn: {
    backgroundColor: '#5C5FC9',
    borderRadius: 15,
    padding: 20,
    width: 150,
  },
  deleteBtn: {
    backgroundColor: '#FA6B6B',
    borderRadius: 15,
    padding: 20,
    width: 150,
  },
  claimSubmissionBtnTxt: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: 'sans-serif-medium',
  },
});
