import { Box, Text, Icon, useColorMode } from "@chakra-ui/react";
import { theme } from "@/data/data";
import { GoMail } from "react-icons/go";


function FooterOne() {
    const {colorMode} = useColorMode()

    return (
        <Box as="footer" p={4} paddingInline={10} width="100%">
            <Text color={colorMode === 'dark' && 'gray.300'}fontSize={'12px'}>© Okuwa 2024</Text>
        </Box>
    )
}

function FooterTwo() {
    const {colorMode} = useColorMode()

    return (
        <Box as="footer" pb={'40px'} width="100%" justifyContent={'space-between'} display={'flex'}>
            <Text color={colorMode === 'dark' ? 'gray.300' : theme.text.secondary} fontSize={'12px'}>© Okuwa 2024</Text>
            <div style={{ display: 'flex', alignItems:'center' }}>
                <Icon as={GoMail} color={theme.text.secondary}/>
                <Text color={colorMode === 'dark' ? 'gray.300' : theme.text.secondary}ml={2}  fontSize={'12px'}>help@Okuwa.com</Text>
            </div>
        </Box>
    )
}

export {FooterOne, FooterTwo}