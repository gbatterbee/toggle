import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { configure } from 'enzyme';
import { prototype } from 'enzyme-adapter-react-16';

import Timesheet from './Timesheet';
import DateSelector from './components/DateSelector';
import ProjectSelector from './components/ProjectSelector';
import TimeSheetView from './components/TimesheetView';
import { Days } from './models/enums';

configure({ adapter: prototype });
const tags =
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

const projects =
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

    it('adds project to state when selected', () => {
        const sut = shallow(<Timesheet tags={[]} projects={[]} />);

        addProjectToSut(sut, 1, 2);

        expect(sut.state())
            .toEqual({ 'projectEntries': [{ 'days': [], 'projectId': 1, 'tagId': 2 }] });
    });

    it('adds project to view when selected', () => {
        const sut = shallow(<Timesheet tags={tags} projects={projects} />);

        addProjectToSut(sut, 1, 2);

        const entries: any = sut.find(TimeSheetView).prop('entries');
        expect(entries)
            .toEqual([{
                projectId: 1,
                projectName: 'Brandbank US',
                tagId: 2,
                tagName: 'Admin',
                days: []
            }]);
    });

    it('updates State model with time when entered', () => {
        const sut = shallow(<Timesheet tags={tags} projects={projects} />);

        addProjectToSut(sut, 1, 2);

        const onTimeEntryChanged: any
            = sut.find(TimeSheetView).prop('onTimeEntryChanged');

        onTimeEntryChanged({ projectId: 1, tagId: 2, day: Days.Wed, hours: 10 });
        sut.update();

        expect(sut.state())
            .toEqual({
                'projectEntries':
                    [{ 'days': [undefined, undefined, 10], 'projectId': 1, 'tagId': 2 }]
            });

    });
});

function addProjectToSut(sut: ShallowWrapper<any, any>, projectId: number, tagId: number) {
    const projSelector: any = sut.find(ProjectSelector).prop('onAdded');
    projSelector({ projectId, tagId });
    sut.update();
}