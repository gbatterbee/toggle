import * as React from 'react';
import * as moment from 'moment';
import { Loader, Dimmer } from 'semantic-ui-react';

import { Days } from './models/enums';
import { Tag, Project } from '../toggl/model';

import { TimeChangedArgs, DescriptionChangedArgs } from './timesheet-view/models';
import addTimes from './addTimes';
import Timesheet from './Timesheet';
import { ProjectTimeEntry } from './components/ProjectSelector';

interface TimesheetComponentProps {
    apiKey: string;
}

interface TimesheetComponentState {
    tags: Tag[]; projects: Project[];
    date?: Date | undefined;
    projectEntries: ProjectEntry[];
    dailySummaries: string[];
    saving: boolean;
}

interface Entry {
    time: string;
    description: string;
}
interface ProjectEntry {
    projectId: number;
    tagId: string;
    day: Entry[];
}

export default class TimesheetComponent extends React.Component<TimesheetComponentProps, TimesheetComponentState> {

    constructor(props: TimesheetComponentProps) {
        super(props);
        const previousEntriesCache = localStorage.getItem('previous');
        const previousEntries = previousEntriesCache ? JSON.parse(previousEntriesCache) : [];

        this.state = {
            tags: [],
            projects: [],
            date: undefined,
            saving: false,
            projectEntries: previousEntries,
            dailySummaries: this.calculateSummary(previousEntries),
        };

        if (this.props.apiKey) {
            this.getTags(this.props.apiKey);
            this.getProjects(this.props.apiKey);
        }
    }

    componentWillReceiveProps(nextProps: TimesheetComponentProps) {
        if (this.props.apiKey) {
            this.getTags(this.props.apiKey);
            this.getProjects(this.props.apiKey);
        } else {
            this.setState({
                tags: [],
                projects: [],
                date: undefined,
                saving: false,
                projectEntries: [],
                dailySummaries: [],
            });
        }
    }

    render() {
        const togglDataLoaded = this.state.projects && this.state.projects.length
            && this.state.tags && this.state.tags.length;

        if (!togglDataLoaded) {
            return (
                < Dimmer active >
                    <Loader>Loading</Loader>
                </Dimmer >
            );
        }

        return (
            < Timesheet
                {...this.state}
                onDateSelected={this.setTimeSheetDate}
                onProjectAdded={this.addProjectEntry}
                onTimeEntryChanged={this.updateTime}
                onProjectRemoved={this.removeProjectEntry}
                onDescriptionChanged={this.updateDescription}
                onSave={this.save}
            />);
    }

    setTimeSheetDate = (date: Date) => {
        this.setState({ date });
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
                dailySummaries: this.calculateSummary(newEntryState)
            });
    }

    removeProjectEntry = (projectId: number, tagId: string): void => {
        const stateEntries = this.state.projectEntries;
        const projectEntries = stateEntries.filter(e => e.projectId !== projectId || (tagId && tagId !== e.tagId));
        this.setState({ projectEntries, dailySummaries: this.calculateSummary(projectEntries) });
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
        this.setState({ projectEntries: newEntryState });
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

    getTags = (key: string) => {
        fetch('https://toggle-eun-fn.azurewebsites.net/tags', {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Basic ${key}`
            }
        }).then(response => response.json().then(j => this.setState({ tags: j })));
    }

    getProjects = (key: string) => {
        fetch('https://toggle-eun-fn.azurewebsites.net/projects', {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                
                'Content-Type': 'application/json',
                'Authorization': `Basic ${key}`,
            }
        }).then(response => response.json().then(j => {
            j.unshift({
                id: 0,
                name: 'No project',
                is_private: false,
                active: true,
                wid: 792899,
                cid: 18026146,
            });
            this.setState({ projects: j });
        }
        ));
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

        const toSend: any[] = [];
        this.state.projectEntries.forEach(pe => {
            pe.day.forEach((day, i) => {
                if (day && day.time && day.time !== '00:00') {
                    const request = {
                        'tags': [pe.tagId],
                        'duration': day.time.split(':')
                            .reduce((acc, time) => (60 * (Number(acc) + Number(time))), 0),
                        'start': dates[i] + 'T09:00:00+00:00',
                        'created_with': 'Toggle',
                        'wid': (this.state.projects.find(p => p.id === pe.projectId) as Project).wid
                    };
                    if (day.description) {
                        // tslint:disable-next-line:no-string-literal
                        request['description'] = day.description;
                    }
                    if (pe.projectId) {
                        // tslint:disable-next-line:no-string-literal
                        request['pid'] = pe.projectId;
                    }
                    toSend.push(request);
                }
            });
        });
        console.log(JSON.stringify(toSend));
        this.setState({ saving: true });
        const promises = toSend.map(r => fetch('https://toggle-eun-fn.azurewebsites.net/entries', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Basic ${this.props.apiKey}`,
            },
            body: JSON.stringify({ 'time_entry': r })
        }));

        Promise.all(promises)
            .then(resp => {
                if (resp.filter(r => !r.ok).length) {
                    resp[0].json().then(x => console.log(x));
                    console.log(resp);
                    alert('There were problems sending the requests.\nSuggest checking Toggl - before trying again');
                }
                this.setState({ saving: false });
            })
            .catch(r => {
                // tslint:disable-next-line:max-line-length
                console.log(r);
                alert('There was a network error sending your requests.\nSuggest checking Toggl - before trying again');
                this.setState({ saving: false });
            });

        localStorage.setItem('previous', JSON.stringify(this.state.projectEntries));
    }
}