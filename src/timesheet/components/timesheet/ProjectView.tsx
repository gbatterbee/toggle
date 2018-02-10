import * as React from 'react';
import { TimesheetEntry, TimeChangedArgs, DescriptionChangedArgs, Project } from './models';
import { TagView } from './TagView';
import RemoveableHeader from './RemoveableHeader';

interface ProjectProps {
    project: Project;
    tags: TimesheetEntry[];
    onTimeChanged: (args: TimeChangedArgs) => void;
    onDescriptionChanged: (args: DescriptionChangedArgs) => void;
    onRemove: (projectId: number, tagId?: number) => void;
}

export const ProjectView = (props: ProjectProps) => {
    const { project, tags, onTimeChanged, onDescriptionChanged, onRemove } = props;
    return (
        <>
        <RemoveableHeader
            as="h2"
            title={project.projectName}
            onRemove={() => onRemove(project.projectId)}
            align="center"
        />
        {
            tags
                .sort((t1: TimesheetEntry, t2: TimesheetEntry) => t1.tagName > t2.tagName ? 1 : -1)
                .map(t => (
                    <TagView
                        key={t.tagId}
                        tag={t}
                        onTimeChanged={onTimeChanged}
                        onDescriptionChanged={onDescriptionChanged}
                        onRemove={(tagId) => onRemove(project.projectId, tagId)}
                    />))}

        </>
    );
};
