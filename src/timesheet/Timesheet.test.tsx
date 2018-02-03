import * as React from 'react';
import { shallow } from 'enzyme';
import { configure } from 'enzyme';
import { prototype } from 'enzyme-adapter-react-16';

import Timesheet from './Timesheet';
import DateSelector from './components/DateSelector';
import ProjectSelector from './components/ProjectSelector';

configure({ adapter: prototype });

describe('Timesheet ', () => {
    it('sets date when changed', () => {
        const sut = shallow(<Timesheet tags={[]} projects={[]} />);
        const dateSelector: any = sut.find(DateSelector).prop('onDateChanged');
        dateSelector('2017-01-01');

        expect(sut.state('date')).toEqual('2017-01-01');
    });

    it('creates a new entry on add event', () => {
        const sut = shallow(<Timesheet tags={[]} projects={[]} />);
        const projSelector: any = sut.find(ProjectSelector).prop('onAdded');
        projSelector({ projectId: 1, tagId: 2 });
        expect(sut.state('timesheet')).toEqual({ entries: [{ projectId: 1, tagId: 2, days: [7] }] });
    });
});

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