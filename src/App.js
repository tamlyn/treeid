import React from 'react';
import NavBar from './components/NavBar';
import Stream from './components/Stream';

const ENDPOINT_URL = '/analyze';

class App extends React.Component {
  state = { uploading: false, error: null };

  uploadFile = event => {
    this.setState({ uploading: true, error: null });

    const file = event.target.files[0];
    const body = new FormData();
    body.append('file', file);

    const reader = new FileReader();
    reader.onload = event => this.setState({ fileData: event.target.result });
    reader.readAsDataURL(file);

    fetch(ENDPOINT_URL, { method: 'POST', body })
      .then(res => {
        if (res.status >= 300) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then(({ result, id }) => this.setState({ uploading: false, result, id }))
      .catch(err => {
        this.setState({ error: err, uploading: false });
        console.error(err);
      });
  };

  render() {
    return (
      <div>
        <NavBar onFileSelect={this.uploadFile} />
        <Stream
          uploading={this.state.uploading}
          fileData={this.state.fileData}
          result={this.state.result}
        />
      </div>
    );
  }
}

export default App;
