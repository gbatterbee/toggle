import * as React from 'react';
import { Tag, Project, tags, projects } from '../toggl/model';
import DateSelector from './components/DateSelector';
import ProjectSelector, { AddedData } from './components/ProjectSelector';
import TimeSheetView, { TimesheetEntry } from './components/TimesheetView';

interface TimesheetProps {
    tags: Tag[]; projects: Project[];
}

interface TimesheetState {
    date?: Date | undefined;
    projectEntries: ProjectEntry[];
}

export default class Timesheet extends React.Component<TimesheetProps, TimesheetState> {

    constructor(props: TimesheetProps) {
        super(props);
        this.state = { projectEntries: [] };
    }

    render() {
        return (
            <>
            <DateSelector onDateChanged={(date: Date) => this.setState({ date })} />
            <ProjectSelector projects={projects} tags={tags} onAdded={this.addProjectEntry} />
            <TimeSheetView entries={this.mapStateToTimeViewEntries()} />
            </>
        );
    }
    mapStateToTimeViewEntries = (): TimesheetEntry[] => {
        return this.state.projectEntries.map((e: ProjectEntry) => {
            const tag = this.props.tags.find(t => t.id === t.id);
            const project = this.props.projects.find(p => p.id === e.projectId);

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
        const newProjectEntriesState = [...this.state.projectEntries, { projectId, tagId, days: [7] }];
        this.setState({ projectEntries: newProjectEntriesState });
    }
}

class ProjectEntry {
    projectId: number;
    tagId: number;
    days: number[];
}