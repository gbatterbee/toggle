import * as React from 'react';
import { Tag, Project } from '../toggl/model';
import DateSelector from './components/DateSelector';
import ProjectSelector, { AddedData } from './components/ProjectSelector';
import TimeSheetView, { TimesheetEntry, TimeEntryChangedArgs } from './components/TimesheetView';
import { Button } from 'semantic-ui-react';
import * as moment from 'moment';
import { Days } from './models/enums';

// , tags, projects 
interface TimesheetProps {
    tags: Tag[]; projects: Project[];
}

interface TimesheetState {
    date?: Date | undefined;
    canSave: boolean;
    projectEntries: ProjectEntry[];
}

interface ProjectEntry {
    projectId: number;
    tagId: number;
    days: number[];
}

export default class Timesheet extends React.Component<TimesheetProps, TimesheetState> {

    constructor(props: TimesheetProps) {
        super(props);
        this.state = { projectEntries: [], canSave: false };
    }

    render() {
        return (
            <>
            <DateSelector onDateChanged={this.setDate} />
            <ProjectSelector projects={this.props.projects} tags={this.props.tags} onAdded={this.addProjectEntry} />
            <TimeSheetView
                entries={this.mapStateToTimeViewEntries()}
                onTimeEntryChanged={this.updateTimeEntry}
            />
            {
                this.state.canSave ?
                    <Button
                        disabled={!this.state.canSave}
                        fluid={false}
                        onClick={this.save}
                    >
                        Toggl It
                    </Button>
                    : null
            }

            </>
        );
    }
    mapStateToTimeViewEntries = (): TimesheetEntry[] => {
        const props = this.props;
        const state = this.state;
        return state.projectEntries.map((e: ProjectEntry) => {
            const tag = props.tags.find(t => t.id === e.tagId);
            const project = props.projects.find(p => p.id === e.projectId);

            return {
                projectId: e.projectId,
                tagId: e.tagId,
                days: e.days,
                projectName: project ? project.name : 'unknown project',
                tagName: tag ? tag.name : 'unknown tag'
            };
        });
    }

    addProjectEntry = (data: AddedData) => {
        const { projectId, tagId } = data;
        const exists = this.state.projectEntries.find(e => e.tagId === data.tagId && e.projectId === data.projectId);
        if (exists) {
            return;
        }

        const newProjectEntriesState = [...this.state.projectEntries, { projectId, tagId, days: [] }];
        this.setState({ projectEntries: newProjectEntriesState });
    }

    updateTimeEntry = (args: TimeEntryChangedArgs) => {
        const state = this.state;
        const newEntryState =
            state.projectEntries.filter(pe => pe.projectId !== args.projectId
                || pe.tagId !== args.tagId);

        const newEntry =
            state.projectEntries.filter(pe => pe.projectId === args.projectId
                && pe.tagId === args.tagId)[0];

        newEntry.days[args.day] = args.hours;

        newEntryState.push(newEntry);

        this.setState({ projectEntries: newEntryState, canSave: this.canSave() });
    }

    setDate = (date: Date) => {

        this.setState({ date });
    }

    canSave = () => {
        return (this.state.projectEntries.filter(e => e.days.filter(d => d > 0).length > 0).length !== 0);
    }

    save = () => {
        const date = this.state.date;
        const dates: string[] = [];
        dates[Days.Mon] = moment(date).format('YYYY-MM-DD');
        dates[Days.Tue] = (moment(date).add(1, 'days')).format('YYYY-MM-DD');
        dates[Days.Wed] = (moment(date).add(2, 'days')).format('YYYY-MM-DD');
        dates[Days.Thur] = (moment(date).add(3, 'days')).format('YYYY-MM-DD');
        dates[Days.Fri] = (moment(date).add(4, 'days')).format('YYYY-MM-DD');
        dates[Days.Sat] = (moment(date).add(5, 'days')).format('YYYY-MM-DD');
        dates[Days.Sun] = (moment(date).add(6, 'days')).format('YYYY-MM-DD');

        this.state.projectEntries.forEach(e => {
            e.days.forEach((h, i) => {
                if (h) {

                    console.log(
                        {
                            'pid': e.projectId,
                            'tid': e.tagId,
                            'hrs': h,
                            'date': dates[i]
                        });
                }
            });
        });
    }
}