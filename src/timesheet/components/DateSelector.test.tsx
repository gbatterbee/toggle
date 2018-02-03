import * as React from 'react';
import { shallow } from 'enzyme';
import { configure } from 'enzyme';
import { prototype } from 'enzyme-adapter-react-16';
import * as sinon from 'sinon';

import DateSelector from './DateSelector';

configure({ adapter: prototype });

describe('DateSelector ', () => {
    let dateNowSpy: any;

    beforeAll(() => {
        dateNowSpy = jest.spyOn(Date, 'now').mockImplementation(() => 1487076708000); // 14.02.2017
    });

    it('initialised with the monday for the current week.', () => {
        const sut = shallow(<DateSelector onDateChanged={(d) => null} />);
        expect(sut.text()).toContain('13.02.2017');
    });

    describe('Clicking previous ', () => {
        it('moves date back one week', () => {
            const sut = shallow(<DateSelector onDateChanged={(d) => null} />);
            sut.find('button').at(0).simulate('click');
            expect(sut.text()).toContain('06.02.2017');
        });

        it('raises onDateChanged event', () => {
            let dateChangedSpy = sinon.spy();
            const sut = shallow(<DateSelector onDateChanged={dateChangedSpy} />);
            sut.find('button').at(0).simulate('click');

            expect(dateChangedSpy.callCount).toEqual(1);
        });
    });

    describe('Clicking next ', () => {
        it('moves date forward one week', () => {
            const sut = shallow(<DateSelector onDateChanged={(d) => null} />);
            sut.find('button').at(1).simulate('click');
            expect(sut.text()).toContain('20.02.2017');
        });

        it('raises onDateChanged event', () => {
            let dateChangedSpy = sinon.spy();
            const sut = shallow(<DateSelector onDateChanged={dateChangedSpy} />);
            sut.find('button').at(1).simulate('click');

            expect(dateChangedSpy.callCount).toEqual(1);
        });
    });

    afterAll(() => {
        dateNowSpy.mockReset();
        dateNowSpy.mockRestore();
    });
});

// const dateSelector: any = sut.find('DateSelector').prop('onDateChanged');
// dateSelector('2017-01-01');

// expect(sut.state('date')).toEqual('2017-01-01');
//   it('sets Apikey in state when entered', () => {
//     const setItemSpy = sinon.spy();
//     (global as any).localStorage = { setItem: setItemSpy };

//     const app = shallow(<App />);

//     const apiEntry: any = app.find('ApiEntry').prop('onApiKeySet');
//     apiEntry('akey');

//     expect(app.state('apiKey')).toEqual('akey');
//   });
// https://www.toggl.com/api/v9/me/workspaces
// const workspace -- 792899