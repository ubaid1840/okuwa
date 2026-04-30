import { theme } from '@/data/data'
import { Box, Icon, useColorMode, useColorModeValue } from '@chakra-ui/react'
import { Calendar as PrimeCalendar } from 'primereact/calendar'
import { CiCalendar } from 'react-icons/ci'


const Calendar = ({ disabled, onChange, value }) => {
    const bdColor = useColorModeValue(theme.color.primaryBorderColor, "gray.600")
    const {colorMode}  = useColorMode()
    
    return (
        <Box
            display={"flex"}
            width={"100%"}
            height={10}
            borderRadius={"0.375rem"}
            outline={"2px solid transparent"}
            border={"1px solid"}
            borderColor={bdColor}
            paddingInlineStart={"1rem"}
            paddingInlineEnd={"1rem"}
            alignItems={"center"}
            _hover={{ borderColor: bdColor }}
            _focusWithin={{
                boxShadow: `0px 0px 2px 2px ${bdColor}`,
                borderColor: bdColor,
            }}
        >
            <PrimeCalendar
            inputStyle={{backgroundColor : 'transparent'}}
            dateFormat="dd/mm/yy"
                disabled={disabled}
                className="custom-datepicker"
                value={value}
                onChange={onChange}
            />
            <Icon as={CiCalendar} size={20} />
        </Box>
    )
}

export default Calendar