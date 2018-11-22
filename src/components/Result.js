import React from 'react';
import { Text, Card, Link } from 'rebass';
import ImageCard from './ImageCard';
import treeInfo from '../treeInfo';

export default ({ fileData, result, onFeedbackClick }) => (
  <React.Fragment>
    <ImageCard src={fileData} mb={2}>
      {treeInfo[result].name}
    </ImageCard>
    <Card borderRadius={3} bg="#eee" mb={2} p={3}>
      <Text fontFamily="serif" fontSize={3} mb={3}>
        Looks like{' '}
        <a href={treeInfo[result].link}>
          {treeInfo[result].name} (<em>{treeInfo[result].binomial}</em>)
        </a>
        .
      </Text>
      <Link onClick={onFeedbackClick} fontSize={3} mb={3}>
        Is this right?
      </Link>
    </Card>
  </React.Fragment>
);
