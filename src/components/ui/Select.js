import { theme } from '@/data/data'
import { Select as ChakraSelect, useColorModeValue } from '@chakra-ui/react'

const Select = ({ ...props }) => {
    return (
        <ChakraSelect
        _disabled={{bg : 'transparent', borderColor : 'gray.600'}}
         
            {...props} />
    )
}

export default Select