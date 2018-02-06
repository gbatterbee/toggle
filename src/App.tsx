import * as React from 'react';
import './App.css';

import ApiEntry from './api/ApiEntry';
import Timesheet from './timesheet/Timesheet';
import { Tag, Project } from './toggl/model';

const logo = require('./logo.svg');

class App extends React.Component<{}, { apiKey?: string | null, tags: Tag[], projects: Project[] }> {
  constructor(props: {}) {
    super(props);

    const key = localStorage.getItem('apiKey');
    this.state = { apiKey: key, tags: [], projects: [] };

    this.getTags();
    this.getProjects();
  }

  getTags = () => {
    fetch('https://www.toggl.com/api/v9/me/tags', {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Basic ${this.state.apiKey}`,
      }
    }).then(response => response.json().then(j => this.setState({ tags: j })));
  }

  getProjects = () => {
    fetch('https://www.toggl.com/api/v9/me/projects', {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Basic ${this.state.apiKey}`,
      }
    }).then(response => response.json().then(j => this.setState({ projects: j })));
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome</h1>
        </header>
        {
          this.state.apiKey ?
            <Timesheet
              tags={this.state.tags}
              projects={this.state.projects}
            /> : <ApiEntry onApiKeySet={this.apiKeySet} />}
      </div>
    );
  }

  apiKeySet = (key: string) => {
    localStorage.setItem('apiKey', btoa(`${key}:api_token`));
    this.getTags();
    this.getProjects();
    this.setState({ apiKey: key });
  }
}
export default App;
