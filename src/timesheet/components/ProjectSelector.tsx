import * as React from 'react';
import { Tag, Project } from '../../toggl/model';
import { Dropdown, Button } from 'semantic-ui-react';

interface ProjectSelectorProps {
    projects: Project[];
    tags: Tag[];
    onAdded: (data: ProjectTimeEntry) => void;
}
export interface ProjectTimeEntry {
    projectId: number;
    tagId: string;
}
interface ProjectSelectorState extends ProjectTimeEntry {
}
interface Selected {
    value: string;
}
export default class ProjectSelector extends React.Component<ProjectSelectorProps, ProjectSelectorState> {
    constructor(props: ProjectSelectorProps) {
        super(props);
        this.state = { projectId: -1, tagId: ''};
    }

    render() {
        const projects = this.props.projects || [];
        const tags = this.props.tags || [];
        const requiresSelection = this.state.projectId === -1 || !this.state.tagId;
        return (
            <>
                <Dropdown
                    placeholder="Select project"
                    fluid={true}
                    search={true}
                    selection={true}
                    options={projects.map(p => { return { key: p.id, value: p.id, text: p.name }; })}
                    onChange={(e, d: Selected) => this.setState({ projectId: Number(d.value) })}
                />
                <Dropdown
                    placeholder="Select activity"
                    fluid={true}
                    search={true}
                    selection={true}
                    options={tags.map(tag => { return { key: tag.name, value: tag.name, text: tag.name }; })}
                    onChange={(e, d: Selected) => this.setState({ tagId: d.value })}
                />
                <Button
                    disabled={requiresSelection}
                    fluid={true}
                    onClick={() => this.props.onAdded(this.state)}
                    content="Add to timesheet"
                />
            </>
        );
    }
}