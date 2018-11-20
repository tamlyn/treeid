import React from "react";
import { Flex, Box, Heading } from "rebass";
import FileUploadButton from './FileUploadButton'

export default ({ onFileSelect }) => (
  <Flex p={3} color="white" bg="black" alignItems="center">
    <Heading as="span">TreeID</Heading>
    <Box mx="auto" />
    <FileUploadButton onSelect={onFileSelect}>Take a photo</FileUploadButton>
  </Flex>
);
