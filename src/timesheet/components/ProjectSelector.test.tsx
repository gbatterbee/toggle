import * as React from 'react';
import { shallow } from 'enzyme';
import { configure } from 'enzyme';
import { prototype } from 'enzyme-adapter-react-16';
import { Dropdown, Button } from 'semantic-ui-react';
import * as sinon from 'sinon';

import ProjectSelector from './ProjectSelector';

const tags =
    [
        {
            id: 972666,
            workspace_id: 792899,
            name: 'Admin',
        }
    ];

const projects =
    [
        {
            id: 11887936,
            name: 'Brandbank US',
            is_private: false,
            active: true,
            wid: 792899,
            cid: 18026123
        }
    ];

configure({ adapter: prototype });

describe('ProjectSelector ', () => {
    it('initialises dropdown with projects', () => {
        const sut = shallow(<ProjectSelector tags={[]} projects={projects} onAdded={() => null} />);
        const dropDownElement = sut.find(Dropdown).at(0);
        const dropDownElementProps = dropDownElement.props();

        const expectedProps = [
            {
                key: 11887936,
                value: 11887936,
                text: 'Brandbank US'
            }
        ];

        expect(dropDownElementProps.options).toEqual(expectedProps);
    });

    it('initialises dropdown with tags', () => {
        const sut = shallow(<ProjectSelector tags={tags} projects={[]} onAdded={() => null}/>);
        const dropDownElement = sut.find(Dropdown).at(1);
        const dropDownElementProps = dropDownElement.props();

        const expectedTags = [
            {
                key: 972666,
                value: 972666,
                text: 'Admin'
            }
        ];

        expect(dropDownElementProps.options).toEqual(expectedTags);
    });

    describe('Add ', () => {
        it('is disabled when project and tag is not selected', () => {
            const sut = shallow(<ProjectSelector tags={[]} projects={[]} onAdded={() => null}/>);
            const button = sut.find(Button);
            expect(button.props().disabled).toEqual(true);
        });

        it('is enabled when project and tag is selected', () => {
            const sut = shallow(<ProjectSelector tags={tags} projects={projects} onAdded={() => null}/>);
            const projectOnChange = (sut.find(Dropdown).at(0).prop('onChange')) as any;
            const tagOnChange = (sut.find(Dropdown).at(1).prop('onChange')) as any;
            projectOnChange(null, { value: 2 });
            tagOnChange(null, { value: 2 });

            sut.update();
            const button = sut.find(Button);
            expect(button.props().disabled).toEqual(false);
        });

        it('raises onAdded when clicked', () => {
            const onAddedSpy = sinon.spy();
            const sut = shallow(<ProjectSelector tags={tags} projects={projects} onAdded={onAddedSpy} />);
            const projectOnChange = (sut.find(Dropdown).at(0).prop('onChange')) as any;
            const tagOnChange = (sut.find(Dropdown).at(1).prop('onChange')) as any;

            projectOnChange(null, { value: 2 });
            tagOnChange(null, { value: 2 });
            sut.update();

            const buttonClick = sut.find(Button).prop('onClick') as any;
            buttonClick();

            expect(onAddedSpy.callCount).toEqual(1);
            expect(onAddedSpy.args[0][0]).toEqual({ projectId: 2, tagId: 2 });
        });
    });
});

// https://www.toggl.com/api/v9/me/workspaces
// const workspace -- 792899