"use client"
import { useColorMode, Box, Icon, HStack, useColorModeValue } from "@chakra-ui/react";
import { MdDarkMode, MdLightMode } from "react-icons/md";

const DarkModeSwitcher = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const colorDark = useColorModeValue("black", "whiteSmoke")
  const bgColor2 = useColorModeValue('transparent', 'gray.600')

  return (
    <Box onClick={() => toggleColorMode()} _hover={{ cursor: 'pointer' }}
      transition="background-color 0.3s ease">
      {colorMode === 'light'
        ?
        <Box p={'4px'} bg={colorMode == 'light' ? 'gray.300' : 'transparent'} rounded={'full'} transition="background-color 0.3s ease">
          <Icon as={MdLightMode} boxSize={6} color={'black'} />
        </Box >
        :
        <Box p={'4px'} bg={bgColor2} rounded={'full'} transition="background-color 0.3s ease">
          <Icon as={MdDarkMode} boxSize={6} color={colorDark} />
        </Box>
      }



    </Box>
  );
};

export default DarkModeSwitcher;
