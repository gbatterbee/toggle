import * as React from 'react';
import { shallow } from 'enzyme';
import { configure } from 'enzyme';
import { prototype } from 'enzyme-adapter-react-16';

import Timesheet from './Timesheet';
import DateSelector from './components/DateSelector';
import ProjectSelector from './components/ProjectSelector';
import TimeSheetView from './components/TimesheetView';

configure({ adapter: prototype });
export const tags =
    [
        {
            id: 2,
            workspace_id: 792899,
            name: 'Admin',
        },
        {
            id: 972665,
            workspace_id: 792899,
            name: 'Architecture/Design',
        },
        {
            id: 970595,
            workspace_id: 792899,
            name: 'BA/PM',
        }
    ];

export const projects =
    [
        {
            id: 1,
            name: 'Brandbank US',
            is_private: false,
            active: true,
            wid: 792899,
            cid: 18026123
        },
        {
            id: 11311299,
            name: 'Rejections Management',
            is_private: false,
            active: true,
            wid: 792899,
            cid: 18026123
        },
        {
            id: 8729763,
            name: 'KTLO',
            is_private: false,
            active: true,
            wid: 792899,
            cid: 18026146
        }
    ];

describe('Timesheet ', () => {
    it('sets date when changed', () => {
        const sut = shallow(<Timesheet tags={tags} projects={projects} />);
        const dateSelector: any = sut.find(DateSelector).prop('onDateChanged');
        dateSelector('2017-01-01');

        expect(sut.state('date')).toEqual('2017-01-01');
    });

    it('adds project to view', () => {
        const sut = shallow(<Timesheet tags={tags} projects={projects} />);
        const projSelector: any = sut.find(ProjectSelector).prop('onAdded');
        projSelector({ projectId: 1, tagId: 2 });
        sut.update();

        const timsheetViewProps: any = sut.find(TimeSheetView).props();

        expect(timsheetViewProps.entries)
            .toEqual([{
                projectId: 1,
                projectName: 'Brandbank US',
                tagId: 2,
                tagName: 'Admin',
                days: [7]
            }]);
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