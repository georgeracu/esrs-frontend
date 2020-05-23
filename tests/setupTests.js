import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import mockAsyncStorage from '@react-native-community/async-storage/jest/async-storage-mock';
import {NativeModules} from 'react-native';

jest.mock('@react-native-community/async-storage', () => mockAsyncStorage);

configure({ adapter: new Adapter() });