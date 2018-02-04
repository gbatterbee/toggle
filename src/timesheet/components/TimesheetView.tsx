import * as React from 'react';
import { Header, Grid, Segment } from 'semantic-ui-react';

export interface TimeEntryChangedArgs {
    projectId: number;
    tagId: number;
    day: number;
    hours: number;
}

interface TimeSheetViewProps {
    entries: TimesheetEntry[];
    onTimeEntryChanged?: (period: TimeEntryChangedArgs) => void;
}

export interface TimesheetEntry {
    projectId: number;
    projectName: string;
    tagId: number;
    tagName: string;
    days: number[];
}

interface TimeSheetViewState {
}

export default class TimeSheetView extends React.Component<TimeSheetViewProps, TimeSheetViewState> {
    constructor(props: TimeSheetViewProps) {
        super(props);
    }

    render() {
        const projectList = this.props.entries.map(e => {
            return { projectId: e.projectId, projectName: e.projectName };
        });

        return (
            <div>
                <Project />
            </div >
        );
    }
}

const Project = () => (
    <>
    <Header
        as="h3"
        content="Blah Project"
        textAlign="center"
    />
    <Tag />
    </>
);

const Tag = () => (
    <>
    <Header
        as="h5"
        content="Blah Tag"
        textAlign="left"
    />
    <Grid columns={7} stackable>
        <Grid.Column>
            <Segment>Content</Segment>
        </Grid.Column>
        <Grid.Column>
            <Segment>Content</Segment>
        </Grid.Column>
        <Grid.Column>
            <Segment>Content</Segment>
        </Grid.Column>
        <Grid.Column>
            <Segment>Content</Segment>
        </Grid.Column>
        <Grid.Column>
            <Segment>Content</Segment>
        </Grid.Column>
        <Grid.Column>
            <Segment>Content</Segment>
        </Grid.Column>
        <Grid.Column>
            <Segment>Content</Segment>
        </Grid.Column>
    </Grid>
    </>
);
