import * as React from 'react';
import { TimesheetEntry, TimeChangedArgs, DescriptionChangedArgs } from './models';
import { Project } from './models';
import { ProjectView } from './ProjectView';
import { HoursSummary } from './HoursSummary';

interface TimeSheetViewProps {
    entries: TimesheetEntry[];
    dailySummaries: string[];
    onTimeChanged: (period: TimeChangedArgs) => void;
    onDescriptionChanged: (period: DescriptionChangedArgs) => void;
    onRemove: (projectId: number, tagId: string) => void;
}

export const TimeSheetView = (props: TimeSheetViewProps) => {
    const projectList =
        props.entries.reduce((acc: any, cur) => {
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
                        <ProjectView
                            key={p.projectId}
                            project={p}
                            tags={props.entries.filter(e => e.projectId === p.projectId)}
                            onTimeChanged={props.onTimeChanged}
                            onDescriptionChanged={props.onDescriptionChanged}
                            onRemove={props.onRemove}
                        />
                    )
            }
            {props.dailySummaries ? <HoursSummary dailySummaries={props.dailySummaries} /> : null}
        </div >
    );
};