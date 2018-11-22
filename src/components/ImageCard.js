import React from 'react';
import { Card, Heading } from 'rebass';

export default ({ src, children, ...props }) => (
  <Card
    backgroundImage={`linear-gradient(rgba(0,0,0,0.12), rgba(0,0,0,0.2)), url(${src})`}
    backgroundSize="cover"
    bg="gray"
    color="white"
    p={3}
    borderRadius={3}
    {...props}
  >
    <Heading as="h1" textAlign="center" fontSize={5} py={100}>
      {children}
    </Heading>
  </Card>
);
