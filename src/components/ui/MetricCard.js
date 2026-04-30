// components/MetricCard.jsx
import { Box, Text, Icon, useColorModeValue, useColorMode } from '@chakra-ui/react';
import { FaDollarSign, FaUserFriends, FaChartLine } from 'react-icons/fa';

const MetricCard = ({ title, value, icon }) => {
  const { colorMode } = useColorMode()
  const bgColor = useColorModeValue('white', 'gray.700')

  return (
    <Box
      p={5}
      shadow="md"
      borderWidth="1px"
      borderRadius="lg"
      bg={bgColor}
    >
      <Box display="flex" alignItems="center">
        <Icon as={icon} w={6} h={6} mr={4} color="teal.500" />
        <Box>
          <Text color={colorMode === 'dark' && 'gray.300'} fontWeight="bold" fontSize="lg">
            {value}
          </Text>
          <Text color={colorMode === 'dark' ? 'gray.300' : "gray.500"}>{title}</Text>
        </Box>
      </Box>
    </Box>
  );
};

export default MetricCard;
