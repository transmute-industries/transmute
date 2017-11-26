import * as React from 'react';
import { shallow } from 'enzyme';
import HomePage from './HomePage';

describe('HomePage', () => {
  it('Does not crash', () => {
      expect(shallow(<HomePage/>).length).toBe(1);
  });

  it('Loads characters on mount');
});