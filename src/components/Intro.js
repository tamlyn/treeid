import React from 'react';
import { Text, Card } from 'rebass';
import ImageCard from './ImageCard';
import treeInfo from '../treeInfo';

const species = Object.values(treeInfo).map(tree => tree.name);

export default () => (
  <React.Fragment>
    <ImageCard src="/bark.jpg" mb={2}>
      What's that tree?
    </ImageCard>
    <Card borderRadius={3} bg="#f0f0f0" color="#333" mb={2} p={3}>
      <Text fontSize={3} mb={3}>
        This is an early prototype app to identify the species of a tree from
        photos of bark. It uses a deep neural network to recognise the unique
        patterns in the bark.
      </Text>
      <Text fontSize={3} mb={3}>
        At the stage it is not 100% accurate and it only knows about the
        following species:
        <ul>
          {species.map(name => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      </Text>
      <Text fontSize={3}>Start by uploading a photo ⤴</Text>
    </Card>
  </React.Fragment>
);
