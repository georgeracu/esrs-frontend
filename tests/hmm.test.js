import React from 'react';
import RegisterScreen from '../modules/register_screen.js';

import renderer from 'react-test-renderer';

test('Displays alert for filling in all required fields', () => {
  const tree = renderer.creat(<RegisterScreen />).toJSON();
  expect(tree).toMatchSnapshot();
});
