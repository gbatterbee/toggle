import * as React from 'react';

export default class ApiEntry extends React.Component<{ onApiKeySet: (apikey: string) => void }, { apiKey: string }> {
    constructor(props: { onApiKeySet: (apikey: string) => void }) {
        super(props);
        this.state = { apiKey: '' };
    }   
    render() {
        return (
            <>
                <p className="App-intro">
                    Retrieve your toggle api key and enter here into your local app cache.
                    </p>
                <p>
                    <input
                        type="text"
                        onKeyDown={this.onkeyDown}
                        onChange={e => this.setState({ apiKey: e.target.value })}
                    />
                </p>
            </>
        );
    }

    onkeyDown = (e: { key: string }) => {
        if (e.key === 'Enter' && this.state.apiKey) {
            this.props.onApiKeySet(this.state.apiKey);
        }
    }
}