import * as React from 'react';
import { shallow } from 'enzyme';
import { configure } from 'enzyme';
import { prototype } from 'enzyme-adapter-react-16';

import { TimeSheetView } from './TimesheetView';
import { TimesheetEntry } from './models';
import { ProjectView } from './ProjectView';
import { TagView } from './TagView';

configure({ adapter: prototype });

describe('TimesheetView ', () => {
    it('displays one projects when entries are for a single project', () => {
        const entries: TimesheetEntry[] = [
            { days: [], projectId: 1, projectName: 'p1', tagId: '1', tagName: 't1' },
            { days: [], projectId: 1, projectName: 'p1', tagId: '2', tagName: 't2' }
        ];

        const sut = shallow(
            <TimeSheetView
                entries={entries}
                dailySummaries={[]}
                onTimeChanged={() => null}
                onDescriptionChanged={() => null}
                onRemove={() => null}
            />);
        const projectWrappers = sut.find(ProjectView);

        expect(projectWrappers.length).toEqual(1);
    });

    it('displays two distinct projects when entries are for different project', () => {
        const entries: TimesheetEntry[] = [
            { days: [], projectId: 1, projectName: 'p1', tagId: '1', tagName: 't1' },
            { days: [], projectId: 2, projectName: 'p2', tagId: '2', tagName: 't2' }
        ];
        const sut = shallow(
            <TimeSheetView
                entries={entries}
                dailySummaries={[]}
                onTimeChanged={() => null}
                onDescriptionChanged={() => null}
                onRemove={() => null}
            />);
        const projectWrappers = sut.find(ProjectView);

        expect(projectWrappers.length).toEqual(2);
    });

    it('propgates TimeEntryChanged event', () => {
        const entries: TimesheetEntry[] = [
            { days: [], projectId: 1, projectName: 'p1', tagId: '1', tagName: 't1' },
        ];
        const onTimeEntryChanged = jest.fn();

        const sut = shallow((
            <TimeSheetView
                entries={entries}
                dailySummaries={[]}
                onTimeChanged={onTimeEntryChanged}
                onDescriptionChanged={() => null}
                onRemove={() => null}
            />));

        const onTimeEntryChangedWrapper: any = sut.find(ProjectView).prop('onTimeChanged');
        const expectedPropogation = {
            projectId: 1,
            tagId: 1,
            day: 3,
            hours: 10,
        };
        onTimeEntryChangedWrapper(expectedPropogation);

        expect(onTimeEntryChanged.mock.calls.length).toEqual(1);
        expect(onTimeEntryChanged.mock.calls[0][0]).toEqual(expectedPropogation);
    });
});

describe('Project ', () => {
    it('adds project id to time changed propogation event', () => {
        const entries: TimesheetEntry[] = [
            { days: [], projectId: 1, projectName: 'p1', tagId: '1', tagName: 't1' },
        ];
        const onTimeEntryChanged = jest.fn();

        const sut = shallow((
            <ProjectView
                project={{ projectId: 1, projectName: 'p1' }}
                tags={entries}
                onTimeChanged={onTimeEntryChanged}
                onDescriptionChanged={() => null}
                onRemove={() => null}
            />));

        const onTimeEntryChangedWrapper: any = sut.find(TagView).prop('onTimeChanged');
        const expectedPropogation = {
            projectId: 1,
            tagId: 1,
            day: 3,
            hours: 10,
        };
        onTimeEntryChangedWrapper(expectedPropogation);

        expect(onTimeEntryChanged.mock.calls.length).toEqual(1);
        expect(onTimeEntryChanged.mock.calls[0][0]).toEqual(expectedPropogation);
    });
});