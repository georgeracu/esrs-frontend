jest.mock('@react-native-firebase/auth', () => ({
   isAndroid: jest.fn(() => true),
   isBoolean: jest.fn(() => false),
}));