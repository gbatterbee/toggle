
import * as React from 'react';
import { Header, Icon } from 'semantic-ui-react';

interface RemoveableHeaderProps {
    as: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    title: string;
    onRemove: () => void;
    align: 'left' | 'center';
}

interface RemoveableHeaderState {
    projectHighlighted: boolean;
}

export default class RemoveableHeader extends React.Component<RemoveableHeaderProps, RemoveableHeaderState> {
    constructor(props: RemoveableHeaderProps) {
        super(props);
        this.state = { projectHighlighted: false };
    }

    render() {
        return (
            < Header
                as={this.props.as}
                onMouseOver={() => this.setState({ projectHighlighted: true })}
                onMouseOut={() => this.setState({ projectHighlighted: false })}
                textAlign={this.props.align}
            >
                <span>
                    {this.props.title}
                    <Icon
                        style={{ display: this.state.projectHighlighted ? 'inline' : 'none' }}
                        link
                        name="trash"
                        onClick={this.props.onRemove}
                    />
                </span>
            </Header>
        );
    }
}
