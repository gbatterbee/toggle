import * as React from 'react';
import './App.css';

import ApiEntry from './api/ApiEntry';
import Timesheet from './timesheet/Timesheet';
import { Tag, Project } from './toggl/model';
import { Menu, Container, Dropdown, Loader, Dimmer } from 'semantic-ui-react';

class App extends React.Component<{}, { apiKey?: string | null, tags: Tag[], projects: Project[] }> {
  constructor(props: {}) {
    super(props);

    const key = localStorage.getItem('apiKey');
    this.state = { apiKey: key, tags: [], projects: [] };

    if (key) {
      this.getTags(key);
      this.getProjects(key);
    }
  }

  render() {
    let View;
    if (this.state.projects && this.state.projects.length && this.state.tags && this.state.tags.length) {
      View = (
        <Timesheet
          tags={this.state.tags}
          projects={this.state.projects}
        />);
    } else {
      View =
        (
          <Dimmer active>
            <Loader>Loading</Loader>
          </Dimmer>
        );
    }

    return (
      <div className="App">
        <Menu fixed="top" inverted>
          <Container fluid >
            <Menu.Item as="text" header>Toggl It</Menu.Item>
            <Menu.Item as="text" position="right" style={{ padding: '0em', marginRight: '3em' }}>
              <Dropdown item simple icon="user" position="right">
                <Dropdown.Menu>
                  <Dropdown.Item onClick={this.clearApiKey}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown></Menu.Item>
          </Container>
        </Menu>

        <Container fluid style={{ marginTop: '3em' }}>
          {
            this.state.apiKey ?
              View : <ApiEntry onApiKeySet={this.apiKeySet} />}
        </Container>
      </div>
    );
  }

  getTags = (key: string) => {
    fetch('https://gbapiman.azure-api.net/toggl/tags', {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Basic ${key}`
      }
    }).then(response => response.json().then(j => this.setState({ tags: j })));
  }

  getProjects = (key: string) => {
    fetch('https://gbapiman.azure-api.net/toggl/projects', {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Basic ${key}`,
      }
    }).then(response => response.json().then(j => {
      console.log(j);
      j.unshift({
        id: 0,
        name: 'No project',
        is_private: false,
        active: true,
        wid: 792899,
        cid: 18026146,
      });
      this.setState({ projects: j });
    }
    ));
  }

  clearApiKey = () => {
    localStorage.removeItem('apiKey');
    this.setState({ apiKey: '' });
  }

  apiKeySet = (key: string) => {
    const apiKey = btoa(`${key}:api_token`);
    localStorage.setItem('apiKey', apiKey);
    this.getTags(apiKey);
    this.getProjects(apiKey);
    this.setState({ apiKey });
  }
}
export default App;
