import React from "react";
import { Button } from "rebass";

class FileUploadButton extends React.Component {
  showFilePicker() {
    this.input.click();
  }

  render() {
    const { children, onSelect, ...props } = this.props;
    return (
      <React.Fragment>
        <input
          accept="image/*"
          style={{display: 'none'}}
          type="file"
          onChange={this.props.onSelect}
          ref={node => (this.input = node)}
        />
        <Button onClick={() => this.showFilePicker()} {...props}>
          {children}
        </Button>
      </React.Fragment>
    );
  }
}

export default FileUploadButton;
