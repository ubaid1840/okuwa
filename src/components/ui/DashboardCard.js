const { Box, HStack, VStack, Icon, Text, useColorMode, useColorModeValue } = require("@chakra-ui/react")
const { SlOptionsVertical } = require("react-icons/sl")


const DashboardCard = ({title, detail, colorMode}) => {


    return (
        <Box
        border={"1px solid"}
        borderColor={colorMode == 'dark' ? "gray.700": "#DDDDDD" }
        p={5}
        borderRadius={"8px"}
        width={"256px"}
      >
        <HStack
          width={"100%"}
          justifyContent={"space-between"}
          alignItems={"flex-start"}
        >
          <VStack spacing={2} alignItems={"flex-start"}>
            <Text variant="description" color={colorMode === 'dark' && 'gray.300'}>{title}</Text>
            <Text variant="heading" color={colorMode === 'dark' && 'gray.300'} fontSize={"24px"}>
              {detail}
            </Text>
          </VStack>
          {/* <Icon as={SlOptionsVertical} color={"#98A2B3"} /> */}
        </HStack>
      </Box>
    )
}

export default DashboardCard