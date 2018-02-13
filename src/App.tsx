import * as React from 'react';
import './App.css';

import ApiEntry from './api/ApiEntry';
import TimesheetComponent from './timesheet/TimesheetComponent';
import { Tag, Project } from './toggl/model';
import { Menu, Container, Dropdown } from 'semantic-ui-react';

class App extends React.Component<{}, { apiKey?: string | null, tags: Tag[], projects: Project[] }> {
  constructor(props: {}) {
    super(props);

    const key = localStorage.getItem('apiKey');
    this.state = { apiKey: key, tags: [], projects: [] };
  }

  render() {
    return (
      <div className="App">
        <Menu fixed="top" inverted style={{ padding: '0em', marginTop: '0em', zIndex: '1000' }}>
          <Container fluid >
            <Menu.Item as="text" header>Toggl It</Menu.Item>
            <Menu.Item as="text" position="right" style={{ padding: '0em', marginRight: '3em', zIndex: '1000' }}>
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
              <TimesheetComponent apiKey={this.state.apiKey} /> : <ApiEntry onApiKeySet={this.apiKeySet} />}
        </Container>
      </div>
    );
  }

  clearApiKey = () => {
    localStorage.removeItem('apiKey');
    this.setState({ apiKey: '' });
  }

  apiKeySet = (key: string) => {
    const apiKey = btoa(`${key}:api_token`);
    localStorage.setItem('apiKey', apiKey);
    this.setState({ apiKey });
  }
}
export default App;
