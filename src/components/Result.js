import React from 'react';
import { Text, Card, Link } from 'rebass';
import ImageCard from './ImageCard';
import treeInfo from '../treeInfo';

export default ({ fileData, result }) => (
  <React.Fragment>
    <ImageCard src={fileData} mb={2}>
      {treeInfo[result].name}
    </ImageCard>
    <Card borderRadius={3} border="1px solid lightgrey" mb={2} p={3}>
      <Text fontFamily="serif" fontSize={3} mb={3}>
        Looks like {treeInfo[result].name} (<em>{treeInfo[result].binomial}</em>
        ).
      </Text>
      <Link href={treeInfo[result].link} fontSize={3} mb={3}>
        About this species
      </Link>
    </Card>
  </React.Fragment>
);
