import React from 'react';
import { Text, Card } from 'rebass';
import ImageCard from './ImageCard';

export default ({ fileData }) => (
  <React.Fragment>
    <ImageCard src={fileData} mb={2}>
      Thanks
    </ImageCard>
    <Card borderRadius={3} bg="#eee" mb={2} p={3}>
      <Text fontSize={3} mb={3}>
        Thank you. Your feedback helps us expand our library of tree images. A
        more diverse library allows the neural network to learn which bark
        features are most important.
      </Text>
    </Card>
  </React.Fragment>
);
