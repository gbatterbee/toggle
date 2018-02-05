import * as React from 'react';
import './App.css';

import ApiEntry from './api/ApiEntry';
import Timesheet from './timesheet/Timesheet';
import { Tag, Project } from './toggl/model';

const logo = require('./logo.svg');

class App extends React.Component<{}, { apiKey?: string, tags: Tag[], projects: Project[] }> {
  constructor(props: {}) {
    super(props);
    this.state = { tags: [], projects: [] };
  }

  getTags = () => {
    fetch('https://www.toggl.com/api/v9/me/tags', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Basic ZjM2OTFjMjk4ZDk5ZjRmNGE1MGU1ZDg2YjI5NmVkNmI6YXBpX3Rva2Vu',
      }
    }).then(response => response.json().then(j => this.setState({ tags: j })));
  }

  getProjects = () => {
    fetch('https://www.toggl.com/api/v9/me/projects', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Basic ZjM2OTFjMjk4ZDk5ZjRmNGE1MGU1ZDg2YjI5NmVkNmI6YXBpX3Rva2Vu',
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
    localStorage.setItem('apiKey', key);

    this.getTags();
    this.getProjects();
    this.setState({ apiKey: key });
  }
}
export default App;
