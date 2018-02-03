import * as React from 'react';
import * as ReactDOM from 'react-dom';
// import { shallow } from 'enzyme';
// import * as sinon from 'sinon';
// import { configure } from 'enzyme';
// import { prototype } from 'enzyme-adapter-react-16';

import App from './App';

// configure({ adapter: prototype });

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});
// describe('App ', () => {
//   it('renders without crashing', () => {
//     const div = document.createElement('div');
//     ReactDOM.render(<App />, div);
//   });

//   it('renders api input when no api key has been set', () => {
//     const app = shallow(<App />);
//     expect(app.find('ApiEntry').length).toEqual(1);
//   });

//   // it('hides api input when api key has been set', () => {
//   //   const app = shallow(<App />);
//   //   expect(app.find('ApiEntry').length).toEqual(0);
//   // });

//   it('sets Apikey in local storage when entered', () => {
//     const setItemSpy = sinon.spy();
//     (global as any).localStorage = { setItem: setItemSpy };

//     const app = shallow(<App />);

//     const apiEntry: any = app.find('ApiEntry').prop('onApiKeySet');
//     apiEntry('akey');
//     expect(setItemSpy.callCount).toEqual(1);
//   });

//   it('sets Apikey in state when entered', () => {
//     const setItemSpy = sinon.spy();
//     (global as any).localStorage = { setItem: setItemSpy };

//     const app = shallow(<App />);

//     const apiEntry: any = app.find('ApiEntry').prop('onApiKeySet');
//     apiEntry('akey');

//     expect(app.state('apiKey')).toEqual('akey');
//   });

//   it('sets Apikey in state when entered', () => {
//     const setItemSpy = sinon.spy();
//     (global as any).localStorage = { setItem: setItemSpy };

//     const app = shallow(<App />);

//     const apiEntry: any = app.find('ApiEntry').prop('onApiKeySet');
//     apiEntry('akey');

//     expect(app.state('apiKey')).toEqual('akey');
//   });

//   it('retrieves config from toggl, when api key is set.', () => {
//     const g = (global as any);
//     g.localStorage = { setItem: () => true };

//     const fetch = sinon.spy();
//     window.fetch = fetch;

//     const app = shallow(<App />);

//     const apiEntry: any = app.find('ApiEntry').prop('onApiKeySet');
//     apiEntry('akey');

//     const calls = fetch.getCalls();
//     expect(calls.length).toEqual(2);

//     const tagsCall = calls[0];
//     expect(tagsCall.args[0]).toEqual('https://www.toggl.com/api/v9/me/tags');

//   });
// });
// // https://www.toggl.com/api/v9/me/workspaces
// // const workspace -- 792899