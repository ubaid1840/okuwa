import { theme } from "@/data/data";
import { Box, HStack, Icon, Input, Text, useColorModeValue } from "@chakra-ui/react"
import DatePicker from "react-datepicker";
import { CiCalendar } from "react-icons/ci";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "primereact/calendar";


const InputCalendarRow = ({ title, value, disabled, props, onChange, placeholder, colorMode }) => {
    const bdColor = useColorModeValue(theme.color.primaryBorderColor, 'gray.700')
    return (
        <HStack
            alignItems={"flex-start"}
            width={"100%"}
            maxWidth={'800px'}
            {...props}
        >
            <div style={{ width: "280px" }}>
                <Text color={colorMode === 'dark' && 'gray.300'} variant="subheading" mt={2}>
                    {title}
                </Text>
            </div>
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
                _hover={{ borderColor: theme.color.border }}
                _focusWithin={{
                    boxShadow: "0px 0px 3px 3px #b2d8d8",
                    borderColor: theme.color.border,
                }}
            >
                <Calendar
                    className={colorMode === 'light' ? `custom-datepicker` : 'custom-datepicker custom-datepicker-dark'}
                    value={value}
                    onChange={onChange}
                />
                <Icon as={CiCalendar} size={20} />
            </Box>
        </HStack>
    )

}

export default InputCalendarRow