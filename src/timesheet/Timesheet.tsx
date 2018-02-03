import * as React from 'react';
import { Tag, Project, tags, projects } from '../toggl/model';
import DateSelector from './components/DateSelector';
import ProjectSelector from './components/ProjectSelector';

interface TimesheetProps {
    tags: Tag[]; projects: Project[];
}

interface TimesheetState {
    date: Date | undefined;
    projects: Projects[];
    entries: Entry[];
}

export default class Timesheet extends React.Component<TimesheetProps, TimesheetState> {
    constructor(props: TimesheetProps) {
        super(props);
    }

    render() {
        return (
            <>
            <DateSelector onDateChanged={(date: Date) => this.setState({ date })} />
            <ProjectSelector projects={projects} tags={tags} onAdded={(d) => console.log(d)} />
            </>
        );
    }
}

class Projects {
    id: string;
    projectId: number;
    entries: string[];
}

class Entry {
    id: string;
    tagId: number;
    days: number[];
}