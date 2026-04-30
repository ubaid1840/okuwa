// components/InsightCard.jsx
import { Box, Text, Icon, useColorModeValue, useColorMode } from '@chakra-ui/react';
import { FaStethoscope, FaUserMd, FaClock } from 'react-icons/fa';

const InsightCard = ({ title, value, icon }) => {
  const { colorMode } = useColorMode()
  const bgColor = useColorModeValue('white', 'gray.700')
  return (
    <Box
      p={5}
      shadow="md"
      borderWidth="1px"
      borderRadius="lg"
      bg={bgColor}
      display="flex"
      alignItems="center"
    >
      <Icon as={icon} w={6} h={6} mr={4} color="purple.500" />
      <Box>
        <Text color={colorMode === 'dark' && 'gray.300'} fontWeight="bold">{title}</Text>
        <Text>{value}</Text>
      </Box>
    </Box>
  );
};

export default InsightCard;
