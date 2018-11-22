import React from 'react';
import { Box } from 'rebass';

import Intro from './Intro';
import ImageCard from './ImageCard';
import Result from './Result';
import Feedback from './Feedback';
import Thanks from './Thanks';

export default ({
  uploading,
  fileData,
  result,
  showFeedback,
  showThanks,
  onFeedbackClick,
  onFeedbackSubmit,
}) => {
  let content = <Intro />;

  if (uploading && fileData) {
    content = (
      <ImageCard src={fileData} mb={2}>
        Uploading...
      </ImageCard>
    );
  } else if (showFeedback) {
    content = (
      <Feedback fileData={fileData} onFeedbackSubmit={onFeedbackSubmit} />
    );
  } else if (showThanks) {
    content = <Thanks fileData={fileData} />;
  } else if (result) {
    content = (
      <Result
        fileData={fileData}
        result={result}
        onFeedbackClick={onFeedbackClick}
      />
    );
  }

  return (
    <Box width={[1, 400]} mx={[0, 'auto']} p={2}>
      {content}
    </Box>
  );
};
