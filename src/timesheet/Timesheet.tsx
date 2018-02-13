import * as React from 'react';
import { Tag, Project } from '../toggl/model';
import DateSelector from './components/DateSelector';
import ProjectSelector, { ProjectTimeEntry } from './components/ProjectSelector';
import { TimeSheetView } from './timesheet-view/TimesheetView';
import { Button, Menu, Container } from 'semantic-ui-react';
import { TimesheetEntry, TimeChangedArgs, DescriptionChangedArgs } from './timesheet-view/models';
import addTimes from './addTimes';

interface TimesheetProps {
    tags: Tag[]; projects: Project[];
    date?: Date | undefined;
    timeEntered: boolean;
    projectEntries: ProjectEntry[];
    dailySummaries: string[];
    saving: boolean;
    onDateSelected: (date: Date) => void;
    onProjectAdded: (data: ProjectTimeEntry) => void;
    onTimeEntryChanged: (args: TimeChangedArgs) => void;
    onProjectRemoved: (projectId: number, tagId: number) => void;
    onDescriptionChanged: (args: DescriptionChangedArgs) => void;
    onSave: () => void;

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

export default class Timesheet extends React.Component<TimesheetProps> {

    constructor(props: TimesheetProps) {
        super(props);
    }

    render() {
        const totalHours = this.props.dailySummaries.reduce((a, v) => addTimes(a, v), '');
        return (
            <>
                <Menu fixed="top" style={{ padding: '0em', marginTop: '3em' }}>
                    <Menu.Item style={{ padding: '0em', width: '100%' }}>
                        <h3 style={{ width: '100%' }}>
                            <DateSelector onDateChanged={this.props.onDateSelected} /></h3>
                    </Menu.Item>
                </Menu>
                <Container style={{ padding: '0em', marginTop: '6em' }}>
                    <ProjectSelector
                        projects={this.props.projects}
                        tags={this.props.tags}
                        onAdded={this.props.onProjectAdded}
                    />
                    <TimeSheetView
                        entries={this.getTimeViewEntries()}
                        dailySummaries={this.props.dailySummaries}
                        onTimeChanged={this.props.onTimeEntryChanged}
                        onDescriptionChanged={this.props.onDescriptionChanged}
                        onRemove={this.props.onProjectRemoved}
                    />
                    {
                        this.props.timeEntered ?
                            <Button
                                primary
                                loading={this.props.saving}
                                disabled={!this.props.saving && !this.props.timeEntered}
                                fluid={false}
                                onClick={this.props.onSave}
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
        return props.projectEntries.map((e: ProjectEntry) => {
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
}