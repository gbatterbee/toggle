import * as React from 'react';
import { Header, Grid, Input } from 'semantic-ui-react';
import { DayNames, Day } from '../models/enums';

export interface TimeEntryChangedArgs {
    projectId: number;
    tagId: number;
    day: number;
    hours: number;
}

interface TimeSheetViewProps {
    entries: TimesheetEntry[];
    onTimeEntryChanged: (period: TimeEntryChangedArgs) => void;
}

export interface TimesheetEntry {
    projectId: number;
    projectName: string;
    tagId: number;
    tagName: string;
    days: number[];
}

export default class TimeSheetView extends React.Component<TimeSheetViewProps> {
    constructor(props: TimeSheetViewProps) {
        super(props);
    }

    render() {
        const projectList =
            this.props.entries.reduce((acc: any, cur) => {
                if (!acc[cur.projectId]) {
                    acc[cur.projectId] = true;
                    acc.projects.push({ projectId: cur.projectId, projectName: cur.projectName });
                }
                return acc;
            }, { projects: [] });

        return (
            <div>
                {
                    projectList.projects
                        .sort((p1: Project, p2: Project) => p1.projectName > p2.projectName ? 1 : -1)
                        .map((p: { projectId: number, projectName: string }) =>
                            <Project
                                key={p.projectId}
                                project={p}
                                tags={this.props.entries.filter(e => e.projectId === p.projectId)}
                                onTimeEntryChanged={this.props.onTimeEntryChanged}
                            />
                        )}
            </div >
        );
    }
}
interface Project { projectId: number; projectName: string; }
interface ProjectProps {
    project: Project;
    tags: TimesheetEntry[];
    onTimeEntryChanged: (args: TimeEntryChangedArgs) => void;
}

export const Project = ({ project, tags, onTimeEntryChanged }: ProjectProps) => (
    <>
    <Header
        as="h3"
        content={project.projectName}
        textAlign="center"
    />
    {tags
    .sort((t1: TimesheetEntry, t2: TimesheetEntry) => t1.tagName > t2.tagName ? 1 : -1)
    .map(t => (
        <Tag
            key={t.tagId}
            tag={t}
            onTimeEntryChanged={onTimeEntryChanged}
        />))}
    </>
);

const Tag = ({ tag, onTimeEntryChanged }:
    { tag: TimesheetEntry; onTimeEntryChanged: (period: TimeEntryChangedArgs) => void }) => (
        <>
        <Header
            as="h5"
            content={tag.tagName}
            textAlign="left"
        />
        <Grid columns={7} stackable>
            {DayNames.map(d => (
                <Grid.Column key={d}>
                    <Input
                        type="number"
                        placeholder={d}
                        defaultValue={tag.days[Day[d]]}
                        onChange={(evt) => {
                            onTimeEntryChanged({
                                tagId: tag.tagId,
                                projectId: tag.projectId, day: Day[d],
                                hours: Number(evt.currentTarget.value)
                            });
                        }
                        }
                    />
                </Grid.Column>
            ))}
        </Grid>
        </>
    );
