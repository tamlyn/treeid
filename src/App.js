import React from 'react';
import NavBar from './components/NavBar';
import Stream from './components/Stream';

const ANALYZE_ENDPOINT = '/analyze';
const FEEDBACK_ENDPOINT = '/feedback';

class App extends React.Component {
  state = {};

  uploadFile = event => {
    this.setState({ uploading: true, error: null });

    if (event.target.files.length !== 1) {
      return;
    }

    const file = event.target.files[0];
    const body = new FormData();
    body.append('file', file);

    const reader = new FileReader();
    reader.onload = event => this.setState({ fileData: event.target.result });
    reader.readAsDataURL(file);

    fetch(ANALYZE_ENDPOINT, { method: 'POST', body })
      .then(res => {
        if (res.status >= 300) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then(({ result, fileId }) =>
        this.setState({ uploading: false, result, fileId }),
      )
      .catch(err => {
        this.setState({ error: err, uploading: false });
        console.error(err);
      });
  };

  handleFeedbackClick = () => this.setState({ showFeedback: true });

  handleFeedbackSubmit = result => {
    this.setState({ showFeedback: false });
    if (result) {
      this.setState({ showThanks: true, result });

      const feedbackBody = { fileId: this.state.fileId, actual: result };
      fetch(FEEDBACK_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackBody),
      }).catch(err => {
        this.setState({ error: err });
        console.error(err);
      });
    }
  };

  render() {
    return (
      <React.Fragment>
        <NavBar onFileSelect={this.uploadFile} />
        <Stream
          uploading={this.state.uploading}
          fileData={this.state.fileData}
          result={this.state.result}
          showFeedback={this.state.showFeedback}
          showThanks={this.state.showThanks}
          onFeedbackClick={this.handleFeedbackClick}
          onFeedbackSubmit={this.handleFeedbackSubmit}
        />
      </React.Fragment>
    );
  }
}

export default App;
