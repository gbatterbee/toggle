import * as React from 'react';
import { Header, Grid, Input } from 'semantic-ui-react';
import { DayNames, Day } from '../models/enums';

export interface TimeChangedArgs {
    projectId: number;
    tagId: number;
    day: number;
    hours: string;
}

interface Entry {
    time: string;
    description: string;
}

export interface DescriptionChangedArgs {
    projectId: number;
    tagId: number;
    day: number;
    description: string;
}

interface TimeSheetViewProps {
    entries: TimesheetEntry[];
    onTimeChanged: (period: TimeChangedArgs) => void;
    onDescriptionChanged: (period: DescriptionChangedArgs) => void;
}

export interface TimesheetEntry {
    projectId: number;
    projectName: string;
    tagId: number;
    tagName: string;
    days: Entry[];
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
                                onTimeChanged={this.props.onTimeChanged}
                                onDescriptionChanged={this.props.onDescriptionChanged}
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
    onTimeChanged: (args: TimeChangedArgs) => void;
    onDescriptionChanged: (args: DescriptionChangedArgs) => void;

}

export const Project = ({ project, tags, onTimeChanged, onDescriptionChanged }: ProjectProps) => (
    <>
    <Header
        as="h3"
        content={project.projectName}
        textAlign="center"
    />
    {
        tags
            .sort((t1: TimesheetEntry, t2: TimesheetEntry) => t1.tagName > t2.tagName ? 1 : -1)
            .map(t => (
                <Tag
                    key={t.tagId}
                    tag={t}
                    onTimeChanged={onTimeChanged}
                    onDescriptionChanged={onDescriptionChanged}
                />))}
    </>
);

const Tag = ({ tag, onTimeChanged, onDescriptionChanged }:
    {
        tag: TimesheetEntry;
        onDescriptionChanged: (description: DescriptionChangedArgs) => void;
        onTimeChanged: (period: TimeChangedArgs) => void
    }) => (
        <>
        <Header
            as="h5"
            content={tag.tagName}
            textAlign="left"
        />
        <Grid columns={7} stackable>
            {
                DayNames.map(d => {
                    const day: any = tag.days[Day[d]] || {};
                    return (
                        <Grid.Column key={d}>
                            <Input
                                type="text"
                                placeholder="description"
                                defaultValue={day.description}
                                onChange={(evt) => {
                                    onDescriptionChanged({
                                        tagId: tag.tagId,
                                        projectId: tag.projectId,
                                        description: evt.currentTarget.value,
                                        day: Day[d],
                                    });
                                }
                                }
                            />
                            <Input
                                type="time"
                                defaultValue={day.time}
                                onChange={(evt) => {
                                    onTimeChanged({
                                        tagId: tag.tagId,
                                        projectId: tag.projectId,
                                        day: Day[d],
                                        hours: evt.currentTarget.value
                                    });
                                }
                                }
                            />
                        </Grid.Column>
                    );
                })
            }
        </Grid>
        </>
    );
