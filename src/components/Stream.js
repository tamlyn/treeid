import React from 'react';
import { Box } from 'rebass';
import Intro from './Intro';
import ImageCard from './ImageCard';
import Result from './Result';

export default ({ uploading, fileData, result }) => (
  <Box width={[1, 400]} mx={[0, 'auto']} p={2}>
    {!fileData && <Intro />}
    {fileData &&
      uploading && (
        <ImageCard src={fileData} mb={2}>
          Uploading...
        </ImageCard>
      )}
    {result && <Result fileData={fileData} result={result} />}
  </Box>
);
