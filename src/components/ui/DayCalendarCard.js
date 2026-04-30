import { theme } from "@/data/data"
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons"
import { Box, Text, useColorModeValue, VStack } from "@chakra-ui/react"


const DayCalendarCard = ({ day, date, onClick, selected, colorMode }) => {
    
    return (
        <VStack
            _hover={{ cursor: 'pointer' }}
            gap={0}
            onClick={onClick}
            height={"62px"}
            width={"82px"}
            backgroundColor={selected ? colorMode === 'light' ? theme.color.selection : 'gray.600' : colorMode === 'light' ? "#FFFFFF" : 'gray.800'}
            color={"black"}
            border={"1px solid"}
            borderColor={selected ? colorMode === 'light' ?  theme.color.primaryBorderColor : 'gray.700' : colorMode === 'light' ? '#CCCCCC' : 'gray.700'}
            borderRadius={"8px"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
        >

            <Text color={selected ? theme.color.primary : colorMode === 'dark' ? 'gray.300' : '#101828'} fontSize={'12px'} fontWeight={'400'}>{day}</Text>
            <Text color={selected ? theme.color.primary : colorMode === 'dark' ? 'gray.300' : '#101828'} fontSize={'16px'} fontWeight={'500'}>{date}</Text>
        </VStack>
    )
}

export default DayCalendarCard