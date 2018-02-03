import * as React from 'react';
import * as sinon from 'sinon';
import ApiEntry from './ApiEntry';
import { shallow } from 'enzyme';

import { configure } from 'enzyme';
import { prototype } from 'enzyme-adapter-react-16';

configure({ adapter: prototype });

const enterEvent = { key: 'Enter' };
const charEvent = { key: 'a' };
const apiChangedEvent = { target: { value: 'apikey' } };

describe('ApiEntry ', () => {
  it('only raises onApiSet with and api value and Enter key', () => {
    const onApiSet = sinon.spy();
    const sut = shallow(<ApiEntry onApiKeySet={onApiSet} />);

    sut.find('input').simulate('change', apiChangedEvent);
    sut.find('input').simulate('keyDown', charEvent);
    sut.find('input').simulate('keyDown', enterEvent);

    expect(onApiSet.callCount).toEqual(1);
  });

  it('does not raise onApiSet when no api key has been specified', () => {
    const onApiSet = sinon.spy();
    const sut = shallow(<ApiEntry onApiKeySet={onApiSet} />);

    sut.find('input').simulate('keyDown', enterEvent);
    expect(onApiSet.callCount).toEqual(0);
  });
});