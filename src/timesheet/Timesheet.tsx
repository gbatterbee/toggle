import * as React from 'react';
import { Tag, Project } from '../toggl/model';
import DateSelector from './components/DateSelector';
import ProjectSelector, { ProjectTimeEntry } from './components/ProjectSelector';
import { TimeSheetView } from './components/timesheet/TimesheetView';
import { Button, Menu, Container } from 'semantic-ui-react';
import * as moment from 'moment';
import { Days } from './models/enums';
import { TimesheetEntry, TimeChangedArgs, DescriptionChangedArgs } from './components/timesheet/models';
import addTimes from './addTimes';

interface TimesheetProps {
    tags: Tag[]; projects: Project[];
}

interface TimesheetState {
    date?: Date | undefined;
    timeEntered: boolean;
    projectEntries: ProjectEntry[];
    dailySummaries: string[];
}

interface Entry {
    time: string;
    description: string;
}
interface ProjectEntry {
    projectId: number;
    tagId: number;
    day: Entry[];
}

export default class Timesheet extends React.Component<TimesheetProps, TimesheetState> {

    constructor(props: TimesheetProps) {
        super(props);
        const previousEntriesCache = localStorage.getItem('previous');
        const previousEntries = previousEntriesCache ? JSON.parse(previousEntriesCache) : [];

        this.state = {
            projectEntries: previousEntries,
            timeEntered: previousEntries && previousEntries.length,
            dailySummaries: this.calculateSummary(previousEntries),
        };
    }

    render() {
        const totalHours = this.state.dailySummaries.reduce((a, v) => addTimes(a, v), '');
        return (
            <>
                <Menu fixed="top" style={{ padding: '0em', marginTop: '3em' }}>
                    <Menu.Item style={{ padding: '0em', width: '100%'}}>
                        <h3 style={{ width: '100%'}}>
                            <DateSelector onDateChanged={this.setDate} /></h3>
                    </Menu.Item>
                </Menu>
                <Container style={{ padding: '0em', marginTop: '6em' }}>
                    <ProjectSelector
                        projects={this.props.projects}
                        tags={this.props.tags}
                        onAdded={this.addProjectEntry}
                    />
                    <TimeSheetView
                        entries={this.getTimeViewEntries()}
                        dailySummaries={this.state.dailySummaries}
                        onTimeChanged={this.updateTime}
                        onDescriptionChanged={this.updateDescription}
                        onRemove={this.removeProjectEntry}
                    />
                    {
                        this.state.timeEntered ?
                            <Button
                                primary
                                disabled={!this.state.timeEntered}
                                fluid={false}
                                onClick={this.save}
                            >add {totalHours}hrs! Toggl It
                            </Button>
                            : null
                    }
                </Container>
            </>
        );
    }
    getTimeViewEntries = (): TimesheetEntry[] => {
        const props = this.props;
        const state = this.state;
        return state.projectEntries.map((e: ProjectEntry) => {
            const tag = props.tags.find(t => t.id === e.tagId);
            const project = props.projects.find(p => p.id === e.projectId);

            return {
                projectId: e.projectId,
                tagId: e.tagId,
                days: e.day,
                projectName: project ? project.name : 'unknown project',
                tagName: tag ? tag.name : 'unknown tag'
            };
        });
    }

    addProjectEntry = (data: ProjectTimeEntry) => {
        const { projectId, tagId } = data;
        const exists = this.state.projectEntries.find(e => e.tagId === data.tagId && e.projectId === data.projectId);
        if (exists) {
            return;
        }

        const newProjectEntriesState = [...this.state.projectEntries, { projectId, tagId, day: [] }];
        this.setState({ projectEntries: newProjectEntriesState });
    }

    removeProjectEntry = (projectId: number, tagId: number): void => {
        const stateEntries = this.state.projectEntries;
        const projectEntries = stateEntries.filter(e => e.projectId !== projectId || (tagId && tagId !== e.tagId));
        this.setState({ projectEntries, dailySummaries: this.calculateSummary(projectEntries) });
    }

    updateTime = (args: TimeChangedArgs) => {
        const state = this.state;
        const newEntryState =
            state.projectEntries.filter(pe => pe.projectId !== args.projectId
                || pe.tagId !== args.tagId);

        const newEntry =
            state.projectEntries.filter(pe => pe.projectId === args.projectId
                && pe.tagId === args.tagId)[0];

        newEntry.day[args.day] = { ...newEntry.day[args.day], time: args.hours };

        newEntryState.push(newEntry);
        this.setState(
            {
                projectEntries: newEntryState,
                timeEntered: this.canSave(),
                dailySummaries: this.calculateSummary(newEntryState)
            });
    }

    calculateSummary = (entries: ProjectEntry[]) => {
        const dailySummaries = ['', '', '', '', '', '', ''];
        entries.forEach(e => {
            for (var i = 0; i < 7; i++) {
                if (e.day[i] && e.day[i].time) {
                    dailySummaries[i] = addTimes(e.day[i].time, dailySummaries[i]);
                }
            }
        });
        return dailySummaries;
    }

    updateDescription = (args: DescriptionChangedArgs) => {
        const state = this.state;
        const newEntryState =
            state.projectEntries.filter(pe => pe.projectId !== args.projectId
                || pe.tagId !== args.tagId);

        const newEntry =
            state.projectEntries.filter(pe => pe.projectId === args.projectId
                && pe.tagId === args.tagId)[0];

        newEntry.day[args.day] = { ...newEntry.day[args.day], description: args.description };
        newEntryState.push(newEntry);
        this.setState({ projectEntries: newEntryState, timeEntered: this.canSave() });
    }

    setDate = (date: Date) => {

        this.setState({ date });
    }

    canSave = () => {
        return (this.state.projectEntries.filter(e => e.day.filter(d => d).length > 0).length !== 0);
    }

    save = () => {
        const date = this.state.date;
        const dates: string[] = [];
        dates[Days.Mon] = moment(date).format('YYYY-MM-DD');
        dates[Days.Tue] = (moment(date).add(1, 'days')).format('YYYY-MM-DD');
        dates[Days.Wed] = (moment(date).add(2, 'days')).format('YYYY-MM-DD');
        dates[Days.Thur] = (moment(date).add(3, 'days')).format('YYYY-MM-DD');
        dates[Days.Fri] = (moment(date).add(4, 'days')).format('YYYY-MM-DD');
        // dates[Days.Sat] = (moment(date).add(5, 'days')).format('YYYY-MM-DD');
        // dates[Days.Sun] = (moment(date).add(6, 'days')).format('YYYY-MM-DD');

        this.state.projectEntries.forEach(e => {
            e.day.forEach((day, i) => {
                if (day && day.time && day.time !== '00:00') {
                    console.log(
                        {
                            'pid': e.projectId,
                            'tid': e.tagId,
                            'hrs': day.time,
                            'description': day.description,
                            'date': dates[i],
                            'wid': (this.props.projects.find(p => p.id === e.projectId) as any).wid
                        });
                }
            });
        });

        localStorage.setItem('previous', JSON.stringify(this.state.projectEntries));
    }
}