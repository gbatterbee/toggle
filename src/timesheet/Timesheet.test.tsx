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
            id: 3,
            workspace_id: 792899,
            name: 'Architecture/Design',
        },
        {
            id: 4,
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
            id: 2,
            name: 'Rejections Management',
            is_private: false,
            active: true,
            wid: 792899,
            cid: 18026123
        },
        {
            id: 3,
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

    it('sends single project to view when there is one project in state', () => {
        const sut = shallow(<Timesheet tags={tags} projects={projects} />);

        addEntryToSut(sut, 1, 2);

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

    it('sends multiple projects to view when there is more than one project in state', () => {
        const sut = shallow(<Timesheet tags={tags} projects={projects} />);

        addEntryToSut(sut, 1, 2);
        addEntryToSut(sut, 2, 3);
        const entries: any = sut.find(TimeSheetView).prop('entries');
        expect(entries)
            .toEqual([{
                projectId: 1,
                projectName: 'Brandbank US',
                tagId: 2,
                tagName: 'Admin',
                days: []
            }, {
                projectId: 2,
                projectName: 'Rejections Management',
                tagId: 3,
                tagName: 'Architecture/Design',
                days: []
            }]);
    });

    it('updates entry with hours when onTimeEntryChanged is raised', () => {
        const sut = shallow(<Timesheet tags={tags} projects={projects} />);

        addEntryToSut(sut, 1, 2);
        addEntryToSut(sut, 1, 2);

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

    describe('Add button ', () => {
        it('adds a new entry to State model when no entries have been created', () => {
            const sut = shallow(<Timesheet tags={[]} projects={[]} />);

            addEntryToSut(sut, 1, 2);

            expect(sut.state())
                .toEqual({ 'projectEntries': [{ 'days': [], 'projectId': 1, 'tagId': 2 }] });
        });

        it('appends a new entry to State model when entries have been created', () => {
            const sut = shallow(<Timesheet tags={[]} projects={[]} />);

            addEntryToSut(sut, 1, 2);
            addEntryToSut(sut, 2, 3);

            expect(sut.state())
                .toEqual({
                    'projectEntries': [
                        { 'days': [], 'projectId': 1, 'tagId': 2 },
                        { 'days': [], 'projectId': 2, 'tagId': 3 }]
                });
        });

        it('ignores a new entry to State model when project and tag already exists', () => {
            const sut = shallow(<Timesheet tags={[]} projects={[]} />);

            addEntryToSut(sut, 1, 2);
            addEntryToSut(sut, 1, 2);

            expect(sut.state())
                .toEqual({ 'projectEntries': [{ 'days': [], 'projectId': 1, 'tagId': 2 }] });
        });
    });
});

function addEntryToSut(sut: ShallowWrapper<any, any>, projectId: number, tagId: number) {
    const projSelector: any = sut.find(ProjectSelector).prop('onAdded');
    projSelector({ projectId, tagId });
    sut.update();
}