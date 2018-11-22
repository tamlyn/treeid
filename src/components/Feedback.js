import React from 'react';
import { Button, Text, Card, Flex } from 'rebass';
import ImageCard from './ImageCard';
import treeInfo from '../treeInfo';

export default ({ fileData, onFeedbackSubmit }) => (
  <React.Fragment>
    <ImageCard src={fileData} mb={2}>
      What's this tree?
    </ImageCard>
    <Card borderRadius={3} bg="#eee" mb={2} p={3}>
      <Text fontSize={3} mb={3}>
        If you know what kind of tree this is, please send feedback to help the
        neural network learn.
      </Text>
      <Flex flexDirection="column">
        {Object.entries(treeInfo).map(([key, info]) => (
          <Button key={key} mb={2} onClick={() => onFeedbackSubmit(key)}>
            {info.name}
          </Button>
        ))}
        <Button mb={2} bg="#888" onClick={() => onFeedbackSubmit()}>
          I'm not sure
        </Button>
      </Flex>
    </Card>
  </React.Fragment>
);
