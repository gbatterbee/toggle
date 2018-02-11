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
    tagId: number;
}
interface ProjectSelectorState extends ProjectTimeEntry {
}
interface Selected {
    value: number;
}
export default class ProjectSelector extends React.Component<ProjectSelectorProps, ProjectSelectorState> {
    constructor(props: ProjectSelectorProps) {
        super(props);
        this.state = { projectId: 0, tagId: 0};
    }

    render() {
        const projects = this.props.projects || [];
        const tags = this.props.tags || [];
        const requiresSelection = this.state.projectId === 0 || this.state.tagId === 0;
        return (
            <>
                <Dropdown
                    placeholder="Select project"
                    fluid={true}
                    search={true}
                    selection={true}
                    options={projects.map(p => { return { key: p.id, value: p.id, text: p.name }; })}
                    onChange={(e, d: Selected) => this.setState({ projectId: d.value })}
                />
                <Dropdown
                    placeholder="Select activity"
                    fluid={true}
                    search={true}
                    selection={true}
                    options={tags.map(p => { return { key: p.id, value: p.id, text: p.name }; })}
                    onChange={(e, d: Selected) => this.setState({ tagId: d.value })}
                />
                <Button
                    disabled={requiresSelection}
                    fluid={true}
                    onClick={() => this.props.onAdded(this.state)}
                />
            </>
        );
    }
}