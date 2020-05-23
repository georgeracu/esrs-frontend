import React from 'react';
import { shallow, render as rend } from 'enzyme';
import TicketsScreen from './tickets_screen.js';
import {StyleSheet, Text, View} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { render, fireEvent } from 'react-native-testing-library';

describe('TicketsScreen', () => {
  it('should render correctly in "debug" mode', () => {
    const component = shallow(<TicketsScreen debug/>);
  
    expect(component).toMatchSnapshot();
  });
  
  it('should use styles.root', () => {
    const component = shallow(<TicketsScreen />);
    expect(component.findWhere((node) => node.prop('style') === 'styles.root')).not.toBeNull();
  });
  
  /*it('checks if Async Storage is used', async () => {
	AsyncStorage.setItem('email', 'hello@hello.com');
	expect(AsyncStorage.getItem('email')).toHaveBeenCalled();
  });*/
});